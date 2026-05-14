const nodemailer = require("nodemailer");

const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("EMAIL_USER or EMAIL_PASS missing in .env");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendInvitationEmail = async ({
  receiverMailAddress,
  invitationLink,
  senderName = "Someone",
}) => {
  try {
    const transporter = createTransporter();

    await transporter.sendMail({
      from: `"SyncMeet Application" <${process.env.EMAIL_USER}>`,
      to: receiverMailAddress,
      subject: "You're Invited To Join SyncMeet 🚀",
      html: `
        <div style="margin:0;padding:40px;background:#0f172a;font-family:Arial,sans-serif;">
          <div style="max-width:600px;margin:auto;background:#111827;border-radius:20px;overflow:hidden;border:1px solid #1e293b;">
            <div style="background:linear-gradient(135deg,#2563eb,#1d4ed8);padding:35px;text-align:center;">
              <h1 style="margin:0;color:white;font-size:34px;">SyncMeet</h1>
              <p style="color:#dbeafe;margin-top:10px;font-size:16px;">Video Conferencing Platform</p>
            </div>

            <div style="padding:40px;color:white;">
              <h2 style="color:#60a5fa;margin-top:0;">You're Invited 🎉</h2>

              <p style="font-size:17px;line-height:1.7;color:#e5e7eb;">
                <b>${senderName}</b> invited you to join <b>SyncMeet</b>.
              </p>

              <p style="font-size:15px;line-height:1.7;color:#cbd5e1;">
                Connect instantly with real-time video meetings, messaging, and collaboration.
              </p>

              <div style="text-align:center;margin-top:35px;">
                <a href="${invitationLink}" style="display:inline-block;padding:16px 28px;background:#2563eb;color:white;text-decoration:none;border-radius:12px;font-size:16px;font-weight:bold;">
                  Accept Invitation
                </a>
              </div>

              <div style="margin-top:40px;padding:20px;background:#0f172a;border-radius:12px;">
                <p style="color:#94a3b8;margin-top:0;font-size:14px;">
                  If the button doesn’t work, copy this link:
                </p>
                <p style="color:#60a5fa;word-break:break-all;font-size:14px;">
                  ${invitationLink}
                </p>
              </div>
            </div>

            <div style="padding:20px;text-align:center;background:#0b1120;color:#64748b;font-size:13px;">
              © 2026 SyncMeet Application
            </div>
          </div>
        </div>
      `,
    });

    return true;
  } catch (error) {
    console.log("❌ Email sending failed:", error.message);
    return false;
  }
};

module.exports = {
  sendInvitationEmail,
};