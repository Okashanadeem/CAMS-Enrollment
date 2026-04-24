import nodemailer from 'nodemailer';

export async function sendWelcomeEmail(to: string, studentName: string, studentId: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const downloadUrl = `${appUrl}/download?studentId=${encodeURIComponent(studentId)}&name=${encodeURIComponent(studentName)}`;

  const mailOptions = {
    from: `"CAMS Portal" <${process.env.EMAIL_FROM}>`,
    to: to,
    subject: `CAMS Registration Successful - ${studentId}`,
    html: `
      <div style="font-family: sans-serif; line-height: 1.5; color: #1e293b; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;">
        <h2 style="color: #2563eb; margin-top: 0;">Registration Successful</h2>
        <p>Hello <strong>${studentName}</strong> (${studentId}),</p>
        
        <p>Your registration in <strong>CAMS</strong> is complete. This is a class-based system managed by <strong>CR Okasha Nadeem</strong> to serve as the main hub for our academic activities.</p>
        
        <p>You can now download your <strong>Attendance Card</strong> from our portal. You may use this to mark attendance via QR code if requested by the course teacher.</p>
        
        <div style="margin: 30px 0; text-align: center;">
          <a href="${downloadUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">Download ID Card</a>
        </div>

        <p style="margin-bottom: 0;">Best Regards,</p>
        <p style="margin-top: 4px;"><strong>CAMS Admin</strong></p>
        
        <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 20px 0;">
        <p style="font-size: 11px; color: #94a3b8;">This is an automated verification for CAMS Enrollment.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}
