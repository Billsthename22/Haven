import nodemailer from 'nodemailer';

// Create the transporter using Google's SMTP network configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendOtpEmail({ to, otp }: { to: string; otp: string }) {
  try {
    const htmlContent = `
      <div style="font-family: sans-serif; padding: 30px; background-color: #0b0f19; color: #ffffff; border-radius: 12px; max-width: 480px; margin: 0 auto; border: 1px solid #1e293b;">
        <h2 style="color: #38bdf8; font-size: 24px; font-weight: 700; margin-top: 0; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px;">Security Terminal</h2>
        <p style="font-size: 15px; color: #94a3b8; line-height: 1.5; margin-bottom: 24px;">An account registration challenge was initialized. Use the verification token below to authorize access.</p>
        <div style="background-color: #111827; border: 1px solid #334155; padding: 20px; border-radius: 8px; text-align: center; font-size: 36px; font-weight: 800; letter-spacing: 6px; color: #38bdf8; margin: 20px 0; font-family: monospace;">
          ${otp}
        </div>
        <p style="font-size: 11px; color: #64748b; margin-top: 24px; border-top: 1px solid #1e293b; padding-top: 16px;">This token expires shortly. If you did not trigger this request, secure your credentials immediately.</p>
      </div>
    `;

    const mailOptions = {
      from: `"Haven Security" <${process.env.GMAIL_USER}>`,
      to: to,
      subject: 'Your Haven Verification Code',
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("🚀 Gmail dispatched message successfully:", info.messageId);
    
    return { success: true, data: info };

  } catch (error: any) {
    console.error("❌ NODEMAILER GMAIL ERROR:", error);
    return { success: false, error: error.message };
  }
}