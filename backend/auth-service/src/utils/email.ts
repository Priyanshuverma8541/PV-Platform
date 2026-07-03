import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

// Create transporter
const createTransporter = () => {
  // For development, use console logging
  if (process.env.NODE_ENV === 'development') {
    return nodemailer.createTransport({
      streamTransport: true,
      newline: true,
      debug: true,
    });
  }

  // For production, use SMTP
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'PV Platform <noreply@pvplatform.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    if (process.env.NODE_ENV === 'development') {
      console.log('📧 Email would be sent:', mailOptions);
    } else {
      await transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully');
    }
  } catch (error) {
    console.error('❌ Error sending email:', error);
    // Don't throw error in development
    if (process.env.NODE_ENV !== 'development') {
      throw error;
    }
  }
};