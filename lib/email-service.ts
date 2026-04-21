import nodemailer from 'nodemailer';

export async function sendWelcomeEmail(to: string, studentName: string, studentId: string, attachmentBuffer: Uint8Array) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"CAMS Portal" <${process.env.EMAIL_FROM}>`,
    to: to,
    subject: `CAMS Registration Successful - ${studentId}`,
    html: `
      <div style="font-family: sans-serif; line-height: 1.5; color: #1e293b; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;">
        <h2 style="color: #2563eb; margin-top: 0;">Registration Successful</h2>
        <p>Hello <strong>${studentName}</strong> (${studentId}),</p>
        
        <p>Your registration in <strong>CAMS</strong> is complete. This is a class-based system managed by <strong>CR Okasha Nadeem</strong> to serve as the main hub for our academic activities.</p>
        
        <p>Your <strong>Attendance Card</strong> is attached. You may use this to mark attendance via QR code if requested by the course teacher.</p>
        
        <p style="margin-bottom: 0;">Best Regards,</p>
        <p style="margin-top: 4px;"><strong>CAMS Admin</strong></p>
        
        <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 20px 0;">
        <p style="font-size: 11px; color: #94a3b8;">This is an automated verification for CAMS Enrollment.</p>
      </div>
    `,
    attachments: [
      {
        filename: `Attendance_Card_${studentId}.pdf`,
        content: Buffer.from(attachmentBuffer),
        contentType: 'application/pdf',
      },
    ],
  };

  return transporter.sendMail(mailOptions);
}
