/**
 * Authentication Email Service
 *
 * Handles email templates for authentication flows
 */

/**
 * Generate email verification template
 */
export function getVerificationEmail(
  name: string,
  verificationUrl: string
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Verify Your Email</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; }
          .header { background: #007bff; color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .button { 
            display: inline-block; 
            background: #000000; 
            color: white !important; 
            padding: 15px 30px; 
            text-decoration: none; 
            border-radius: 6px; 
            margin: 20px 0;
            font-weight: bold;
            text-align: center;
          }
          .footer { 
            background: #f8f9fa; 
            padding: 20px; 
            text-align: center; 
            font-size: 14px; 
            color: #666; 
            border-top: 1px solid #eee; 
          }
          .verification-code { 
            background: #f8f9fa; 
            padding: 15px; 
            border-radius: 6px; 
            text-align: center; 
            margin: 20px 0; 
            border-left: 4px solid #007bff;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to PictruemeAI!</h1>
          </div>
          <div class="content">
            <h2>Hi ${name},</h2>
            <p>Thank you for signing up for PictruemeAI. To complete your registration and start using your account, please verify your email address.</p>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button" style="color: white !important;">Verify Email Address</a>
            </div>
            
            <p>If the button above doesn't work, you can also copy and paste the following link into your browser:</p>
            <div class="verification-code">
              <a href="${verificationUrl}" style="color: #007bff; word-break: break-all;">${verificationUrl}</a>
            </div>
            
            <p><strong>This verification link will expire in 24 hours.</strong></p>
            
            <p>If you didn't create an account with PictruemeAI, you can safely ignore this email.</p>
            
            <p>Best regards,<br>The PictruemeAI Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} PictruemeAI. All rights reserved.</p>
            <p>Need help? Contact us at support@PictruemeAI.com</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Generate password reset email template
 */
export function getPasswordResetEmail(name: string, resetUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Reset Your Password</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; }
          .header { background: #dc3545; color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .button { 
            display: inline-block; 
            background: #000000; 
            color: white !important; 
            padding: 15px 30px; 
            text-decoration: none; 
            border-radius: 6px; 
            margin: 20px 0;
            font-weight: bold;
            text-align: center;
          }
          .footer { 
            background: #f8f9fa; 
            padding: 20px; 
            text-align: center; 
            font-size: 14px; 
            color: #666; 
            border-top: 1px solid #eee; 
          }
          .reset-code { 
            background: #f8f9fa; 
            padding: 15px; 
            border-radius: 6px; 
            text-align: center; 
            margin: 20px 0; 
            border-left: 4px solid #dc3545;
          }
          .warning { 
            background: #fff3cd; 
            border: 1px solid #ffeaa7; 
            padding: 15px; 
            border-radius: 6px; 
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Hi ${name},</h2>
            <p>We received a request to reset the password for your PictruemeAI account. If you made this request, click the button below to reset your password:</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button" style="color: white !important;">Reset Password</a>
            </div>
            
            <p>If the button above doesn't work, you can also copy and paste the following link into your browser:</p>
            <div class="reset-code">
              <a href="${resetUrl}" style="color: #dc3545; word-break: break-all;">${resetUrl}</a>
            </div>
            
            <div class="warning">
              <p><strong>⚠️ Security Notice:</strong></p>
              <ul style="margin: 10px 0;">
                <li>This password reset link will expire in 1 hour</li>
                <li>If you didn't request a password reset, you can safely ignore this email</li>
                <li>Your password will remain unchanged until you create a new one</li>
              </ul>
            </div>
            
            <p>If you're having trouble with your account or didn't request this reset, please contact our support team immediately.</p>
            
            <p>Best regards,<br>The PictruemeAI Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} PictruemeAI. All rights reserved.</p>
            <p>Need help? Contact us at support@PictruemeAI.com</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
