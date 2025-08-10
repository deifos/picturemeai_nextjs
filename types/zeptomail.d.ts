declare module 'zeptomail' {
  export class SendMailClient {
    constructor(config: { url: string; token: string });

    sendMail(mailOptions: {
      from: {
        address: string;
        name?: string;
      };
      to: Array<{
        email_address: {
          address: string;
          name?: string;
        };
      }>;
      subject: string;
      htmlbody?: string;
      textbody?: string;
      reply_to?: Array<{
        address: string;
        name?: string;
      }>;
      attachments?: Array<{
        content: string;
        mime_type: string;
        name: string;
      }>;
    }): Promise<any>;
  }
}
