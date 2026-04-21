import nodemailer from 'nodemailer';

export async function sendWelcomeEmail(to: string, studentName: string, attachmentBuffer: Buffer) {
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
    from: `"SMIU CAMS" <${process.env.EMAIL_FROM}>`,
    to: to,
    subject: 'Welcome to SMIU CAMS - Your Student Attendance Card',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #1b4d3e;">Welcome to SMIU Department of Software Engineering!</h2>
        <p>Dear <strong>${studentName}</strong>,</p>
        <p>We are excited to have you join our section. Your registration in the CAMS (Course Attendance Management System) has been successfully completed.</p>
        <p>Attached to this email is your <strong>Digital Attendance Card</strong>. Please keep this card safe as it will be used for all academic and other activities handled through the CAMS system.</p>
        <p>Key Information:</p>
        <ul>
          <li>All attendance will be marked using the QR code on your card.</li>
          <li>Academic schedules and activity updates will be sent to this email.</li>
          <li>Ensure you have your card (digital or printed) during all class sessions.</li>
        </ul>
        <p>We wish you the best of luck in your academic journey at SMIU!</p>
        <br>
        <p>Best Regards,<br><strong>SMIU CAMS Administration</strong></p>
        <hr>
        <p style="font-size: 0.8em; color: #777;">This is an automated message, please do not reply directly to this email.</p>
      </div>
    `,
    attachments: [
      {
        filename: `SMIU_Attendance_Card_${studentName.replace(/\s+/g, '_')}.pdf`,
        content: attachmentBuffer,
        contentType: 'application/pdf',
      },
    ],
  };

  return transporter.sendMail(mailOptions);
}
