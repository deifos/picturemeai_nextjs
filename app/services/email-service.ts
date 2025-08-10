import { SendMailClient } from 'zeptomail';

const url = process.env.ZEPTOMAIL_API_URL || 'api.zeptomail.ca/';
const token = process.env.ZEPTO_MAIL_API_KEY || '';

const client = new SendMailClient({ url, token });

type EmailParams = {
  to: string;
  subject: string;
  html: string;
  from?: string;
  fromName?: string;
  replyTo?: string;
};

export const sendEmail = async ({
  to,
  subject,
  html,
  from = process.env.EMAIL_FROM || 'noreply@picturemeai.com',
  fromName = process.env.EMAIL_FROM_NAME || 'Picturemeai',
  replyTo = process.env.EMAIL_REPLY_TO || from,
}: EmailParams) => {
  try {
    console.log('Attempting to send email to:', to);
    console.log('ZeptoMail config:', {
      url: process.env.ZEPTOMAIL_API_URL,
      tokenExists: !!process.env.ZEPTO_MAIL_API_KEY,
    });

    const response = await client.sendMail({
      from: {
        address: from,
        name: fromName,
      },
      to: [
        {
          email_address: {
            address: to,
            name: '',
          },
        },
      ],
      reply_to: [
        {
          address: replyTo,
          name: fromName,
        },
      ],
      subject,
      htmlbody: html,
      textbody: html.replace(/<[^>]*>/g, ''), // Strip HTML tags for plain text
    });

    return { success: true, response };
  } catch (error) {
    console.error('Failed to send email:', JSON.stringify(error, null, 2));

    return { success: false, error };
  }
};
