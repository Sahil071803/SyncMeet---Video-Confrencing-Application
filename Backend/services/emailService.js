const https = require("https");

const sendViaSendGrid = async ({ to, subject, html }) => {
  const apiKey = (process.env.SENDGRID_API_KEY || "").trim();
  if (!apiKey) throw new Error("Set SENDGRID_API_KEY in Render Dashboard → Environment");

  const data = JSON.stringify({
    personalizations: [{ to: [{ email: to }] }],
    from: { email: "sahilatram303@gmail.com" },
    subject,
    content: [{ type: "text/html", value: html }],
  });

  await new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: "api.sendgrid.com",
        path: "/v3/mail/send",
        method: "POST",
        headers: {
          Authorization: "Bearer " + apiKey,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data),
        },
      },
      (res) => {
        let body = "";
        res.on("data", (c) => (body += c));
        res.on("end", () => {
          if (res.statusCode === 202) resolve();
          else reject(new Error(`SendGrid API ${res.statusCode}: ${body}`));
        });
      }
    );
    req.on("error", reject);
    req.write(data);
    req.end();
  });
};

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const buildHtml = (safeSenderName, safeInvitationLink) => `
  <div style="margin:0;padding:0;background:#0f172a;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0f172a;padding:24px 12px;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#111827;border-radius:20px;overflow:hidden;border:1px solid #1e293b;">
            <tr>
              <td align="center" style="background:#2563eb;padding:32px 20px;">
                <div style="color:#ffffff;font-size:34px;font-weight:800;line-height:1.1;white-space:nowrap;word-break:keep-all;">SyncMeet</div>
                <div style="color:#dbeafe;margin-top:10px;font-size:15px;line-height:1.5;">Video Conferencing Platform</div>
              </td>
            </tr>
            <tr>
              <td style="padding:34px 24px;color:#ffffff;">
                <h2 style="margin:0 0 18px 0;color:#60a5fa;font-size:26px;line-height:1.3;">You're Invited 🎉</h2>
                <p style="margin:0 0 18px 0;font-size:16px;line-height:1.7;color:#e5e7eb;">
                  <b>${safeSenderName}</b> invited you to join <b>SyncMeet</b>.
                </p>
                <p style="margin:0;font-size:15px;line-height:1.7;color:#cbd5e1;">
                  Connect instantly with real-time video meetings, messaging, and collaboration.
                </p>
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:32px;">
                  <tr><td align="center">
                    <a href="${safeInvitationLink}" style="display:inline-block;background:#7c3aed;color:#ffffff;text-decoration:none;padding:15px 26px;border-radius:12px;font-size:16px;font-weight:700;">Accept Invitation</a>
                  </td></tr>
                </table>
                <div style="margin-top:34px;padding:18px;background:#0f172a;border-radius:14px;border:1px solid #1e293b;">
                  <p style="margin:0 0 10px 0;color:#94a3b8;font-size:13px;line-height:1.6;">If the button doesn't work, copy and paste this link:</p>
                  <p style="margin:0;color:#60a5fa;word-break:break-all;font-size:13px;line-height:1.6;">${safeInvitationLink}</p>
                </div>
                <p style="margin:28px 0 0 0;color:#94a3b8;font-size:13px;line-height:1.6;">If you didn't expect this invitation, you can safely ignore this email.</p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:18px;background:#0b1120;color:#64748b;font-size:12px;line-height:1.6;">© 2026 SyncMeet Application. All rights reserved.</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>`;

const sendInvitationEmail = async ({
  receiverMailAddress,
  invitationLink,
  senderName = "Someone",
}) => {
  try {
    if (!receiverMailAddress || !invitationLink) {
      throw new Error("Receiver email or invitation link missing");
    }

    const safeSenderName = escapeHtml(senderName);
    const safeInvitationLink = escapeHtml(invitationLink);

    await sendViaSendGrid({
      to: receiverMailAddress,
      subject: "You're Invited To Join SyncMeet 🚀",
      html: buildHtml(safeSenderName, safeInvitationLink),
    });

    console.log("✅ Invitation email sent successfully");
    return true;
  } catch (error) {
    console.log("❌ Email sending failed:", error.message);
    return false;
  }
};

module.exports = {
  sendInvitationEmail,
};