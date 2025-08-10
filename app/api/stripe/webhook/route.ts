import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

import { stripe } from '@/lib/stripe';
import prisma from '@/lib/prisma';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);

      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        break;

      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(
          event.data.object as Stripe.PaymentIntent
        );
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(
          event.data.object as Stripe.PaymentIntent
        );
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);

    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  try {
    const { userId, productName, credits } = session.metadata!;

    if (!userId || !productName || !credits) {
      console.error('Missing required metadata:', {
        userId,
        productName,
        credits,
      });

      return;
    }

    // We need to fetch the session with line items to get the product ID
    const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ['line_items.data.price.product'],
    });

    // Create purchase record
    await prisma.purchase.create({
      data: {
        userId,
        stripeSessionId: session.id,
        stripePaymentIntentId: session.payment_intent as string,
        stripePriceId: fullSession.line_items?.data[0]?.price?.id || '',
        stripeProductId:
          (typeof fullSession.line_items?.data[0]?.price?.product === 'string'
            ? fullSession.line_items?.data[0]?.price?.product
            : fullSession.line_items?.data[0]?.price?.product?.id) || '',
        productName,
        totalCredits: parseInt(credits),
        creditsRemaining: parseInt(credits),
        amount: session.amount_total || 0,
        currency: session.currency || 'usd',
        status: 'COMPLETED',
      },
    });

    // Update user's available credits
    await prisma.user.update({
      where: { id: userId },
      data: {
        availableCredits: {
          increment: parseInt(credits),
        },
      },
    });

    console.log(
      `✅ Purchase completed for user ${userId}: ${credits} credits added`
    );

    // Broadcast credits update to any connected clients
    // This will be picked up by the credits store if the user is on the page
  } catch (error) {
    console.error('Error handling checkout session completed:', error);
  }
}

async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent
) {
  try {
    // Update purchase status if needed
    await prisma.purchase.updateMany({
      where: {
        stripePaymentIntentId: paymentIntent.id,
        status: 'PENDING',
      },
      data: {
        status: 'COMPLETED',
      },
    });

    console.log(`Payment intent succeeded: ${paymentIntent.id}`);
  } catch (error) {
    console.error('Error handling payment intent succeeded:', error);
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    // Update purchase status to failed
    await prisma.purchase.updateMany({
      where: {
        stripePaymentIntentId: paymentIntent.id,
      },
      data: {
        status: 'FAILED',
      },
    });

    console.log(`Payment intent failed: ${paymentIntent.id}`);
  } catch (error) {
    console.error('Error handling payment intent failed:', error);
  }
}
