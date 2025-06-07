const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const SibApiV3Sdk = require("sib-api-v3-sdk");

const app = express();
const PORT = 4000;

// MIDDLEWARES
app.use(cors());
app.use(express.json());

// MONGODB CONNECTION
mongoose.connect('mongodb+srv://liblissz:goldblissz@cluster0.euum22k.mongodb.net/holyconcept')
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

// MONGOOSE SCHEMA & MODEL
const NewsletterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  date: { type: Date, default: Date.now }
});
const Newsletter = mongoose.model("Newsletter", NewsletterSchema);

// BREVO API CONFIG
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = "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";
const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

// ✅ API ROUTE: Subscribe Email
app.post("/subscribe", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: "Email is required" });

  try {
    const exists = await Newsletter.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: "Email already subscribed" });

    await Newsletter.create({ email });
    res.json({ success: true, message: "Subscription successful" });
  } catch (error) {
    console.error("❌ Subscribe error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ EMAIL SENDER FUNCTION (called every 30 seconds)
const sendNewsletterEmails = async () => {
  console.log("⏰ Attempting to send newsletter emails...");

  try {
    const users = await Newsletter.find({});
    const recipientEmails = users.map(user => user.email);

    if (recipientEmails.length === 0) {
      console.log("ℹ️ No subscribers found.");
      return;
    }

    for (const email of recipientEmails) {
      const sendSmtpEmail = {
        sender: { name: "Holy Concepts", email: "liblissz3@gmail.com" }, // must be verified in Brevo
        to: [{ email }],
        subject: "Stay Updated with Holy Concepts",
        htmlContent: `
          <!DOCTYPE html>
<html lang="en" >
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Holy Concepts Email Campaign</title>
  <style>
    /* Reset */
    body,table,td,a{ -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
    table,td{ mso-table-rspace:0pt; mso-table-lspace:0pt; }
    img{ -ms-interpolation-mode:bicubic; border:0; height:auto; line-height:100%; outline:none; text-decoration:none; }
    body{ margin:0; padding:0; width:100% !important; height:100% !important; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background: #000000; color:#fff; }
    a[x-apple-data-detectors] {color:inherit !important; text-decoration:none !important; font-size:inherit !important; font-family:inherit !important; font-weight:inherit !important; line-height:inherit !important;}
    /* Responsive */
    @media screen and (max-width: 600px) {
      .container { width: 100% !important; }
      .hero-title { font-size: 28px !important; }
      .hero-subtitle { font-size: 16px !important; }
      .gallery img { width: 100% !important; height: auto !important; }
      .gallery td { padding: 5px !important; }
      .service-list td { display: block !important; width: 100% !important; padding: 10px 0 !important; }
      .btn { padding: 12px 18px !important; font-size: 16px !important; }
    }
  </style>
</head>
<body style="background:#000000; margin:0; padding:0;">

  <!-- Container -->
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#000000">
    <tr>
      <td align="center" style="padding: 20px 10px;">
        <!-- Email Wrapper -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" class="container" style="max-width:600px; background: linear-gradient(135deg, #000000 0%, #1c1c1c 100%); border-radius: 8px; overflow: hidden; box-shadow: 0 0 20px rgba(255,215,0,0.5);">
          
          <!-- Hero Section -->
          <tr>
            <td align="center" style="position: relative;">
              <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80" alt="Elegant Wedding Shoot" width="600" style="display:block; width:100%; height:auto; max-height:320px; object-fit: cover; filter: brightness(0.7);" />
              <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: gold; text-align: center; padding: 0 20px;">
                <h1 class="hero-title" style="margin: 0; font-size: 36px; font-weight: 700; font-family: 'Georgia', serif; letter-spacing: 2px; text-shadow: 0 0 10px rgba(255,215,0,0.9);">📸 Capture the Moment with Holy Concepts</h1>
                <p class="hero-subtitle" style="margin: 12px 0 20px; font-size: 18px; font-weight: 400; color: #ffd700cc; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">Premium photoshoot & event coverage studio in Africa</p>
                <a href="https://holyconcepts.africa/book" target="_blank" style="background: gold; color: black; padding: 14px 30px; border-radius: 30px; font-weight: 700; text-decoration: none; font-size: 18px; display: inline-block; box-shadow: 0 4px 10px rgba(255,215,0,0.7);">Book a Session</a>
              </div>
            </td>
          </tr>

          <!-- Spacer -->
          <tr><td style="height: 30px;"></td></tr>

          <!-- Gallery Section -->
          <tr>
            <td style="padding: 0 30px;">
              <h2 style="color: gold; font-family: 'Georgia', serif; font-size: 24px; margin-bottom: 16px; border-bottom: 2px solid gold; padding-bottom: 6px;">Our Work Gallery</h2>
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="gallery">
                <tr>
                  <td width="33%" style="padding: 8px;">
                    <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80" alt="Wedding Shoot" width="160" style="border-radius: 8px; display:block; width: 100%; height:auto; object-fit: cover;" />
                  </td>
                  <td width="33%" style="padding: 8px;">
                    <img src="https://images.unsplash.com/photo-1526045612212-70caf35c14df?auto=format&fit=crop&w=300&q=80" alt="Birthday Session" width="160" style="border-radius: 8px; display:block; width: 100%; height:auto; object-fit: cover;" />
                  </td>
                  <td width="33%" style="padding: 8px;">
                    <img src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=300&q=80" alt="Corporate Event" width="160" style="border-radius: 8px; display:block; width: 100%; height:auto; object-fit: cover;" />
                  </td>
                </tr>
                <tr>
                  <td width="33%" style="padding: 8px;">
                    <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=300&q=80" alt="Photography Gear BTS" width="160" style="border-radius: 8px; display:block; width: 100%; height:auto; object-fit: cover;" />
                  </td>
                  <td width="33%" style="padding: 8px;">
                    <img src="https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=300&q=80" alt="Studio Posing" width="160" style="border-radius: 8px; display:block; width: 100%; height:auto; object-fit: cover;" />
                  </td>
                  <td width="33%" style="padding: 8px;">
                    <img src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=300&q=80" alt="African Models" width="160" style="border-radius: 8px; display:block; width: 100%; height:auto; object-fit: cover;" />
                  </td>
                </tr>
              </table>
              <p style="text-align:center; margin-top: 12px;">
                <a href="https://holyconcepts.africa/gallery" target="_blank" style="color: gold; text-decoration: none; font-weight: 700;">See Our Work →</a>
              </p>
            </td>
          </tr>

          <!-- Spacer -->
          <tr><td style="height: 30px;"></td></tr>

          <!-- Testimonials Section -->
          <tr>
            <td style="padding: 0 40px;">
              <h2 style="color: gold; font-family: 'Georgia', serif; font-size: 24px; margin-bottom: 20px; border-bottom: 2px solid gold; padding-bottom: 6px;">What Our Clients Say</h2>
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="padding-bottom: 20px;">
                    <p style="font-style: italic; font-size: 16px; line-height: 1.4; margin: 0 0 6px 0;">“Holy Concepts made our wedding unforgettable. Their attention to detail and artistic vision is unmatched!”</p>
                    <p style="margin: 0; font-weight: 700; color: gold;">– Nana A.</p>
                    <p style="color: gold; margin: 4px 0 0 0;">★★★★★</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 20px;">
                    <p style="font-style: italic; font-size: 16px; line-height: 1.4; margin: 0 0 6px 0;">“Professional, punctual, and creative. Their corporate event coverage elevated our brand image.”</p>
                    <p style="margin: 0; font-weight: 700; color: gold;">– Michael T.</p>
                    <p style="color: gold; margin: 4px 0 0 0;">★★★★★</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p style="font-style: italic; font-size: 16px; line-height: 1.4; margin: 0 0 6px 0;">“The studio session was fun and inspiring. I felt like a true star thanks to Holy Concepts!”</p>
                    <p style="margin: 0; font-weight: 700; color: gold;">– Amina K.</p>
                    <p style="color: gold; margin: 4px 0 0 0;">★★★★★</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Spacer -->
          <tr><td style="height: 30px;"></td></tr>

          <!-- Services / Pricing Preview -->
          <tr>
            <td style="padding: 0 40px;">
              <h2 style="color: gold; font-family: 'Georgia', serif; font-size: 24px; margin-bottom: 20px; border-bottom: 2px solid gold; padding-bottom: 6px;">Our Services</h2>
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="service-list" style="color: #fff; font-size: 16px; line-height: 1.5;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #444;">Wedding Photography & Videography</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #444; text-align:right; color: gold;">From $1200</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #444;">Birthday & Private Event Sessions</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #444; text-align:right; color: gold;">From $700</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #444;">Corporate & Fashion Event Coverage</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #444; text-align:right; color: gold;">From $1500</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0;">Professional Studio Sessions & Portraits</td>
                  <td style="padding: 10px 0; text-align:right; color: gold;">From $400</td>
                </tr>
              </table>
              <p style="text-align:center; margin-top: 25px;">
                <a href="https://holyconcepts.africa/book" target="_blank" style="background: gold; color: black; padding: 14px 30px; border-radius: 30px; font-weight: 700; text-decoration: none; font-size: 18px; box-shadow: 0 4px 10px rgba(255,215,0,0.7); display: inline-block;">Book a Session</a>
              </p>
            </td>
          </tr>

          <!-- Spacer -->
          <tr><td style="height: 40px;"></td></tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background: linear-gradient(90deg, #000000, #1c1c1c); padding: 20px 30px; color: #bbb; font-size: 14px;">
              <p style="margin: 0 0 8px 0;">Holy Concepts Studio | Premium Photoshoot & Event Coverage</p>
              <p style="margin: 0 0 8px 0;">
                <a href="mailto:contact@holyconcepts.africa" style="color: gold; text-decoration: none;">contact@holyconcepts.africa</a> | +237 654598457
              </p>
              <p style="margin: 0;">
                <a href="https://facebook.com/holyconcepts" style="color: gold; text-decoration: none; margin: 0 8px;" target="_blank">Facebook</a> |
                <a href="https://instagram.com/holyconcepts" style="color: gold; text-decoration: none; margin: 0 8px;" target="_blank">Instagram</a> |
                <a href="https://twitter.com/holyconcepts" style="color: gold; text-decoration: none; margin: 0 8px;" target="_blank">Twitter</a>
              </p>
              <p style="margin-top: 12px; font-size: 12px; color: #666;">You received this email because you subscribed to Holy Concepts updates.<br />If you wish to unsubscribe, <a href="#" style="color: #999;">click here</a>.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>

        `
      };

      try {
        const response = await emailApi.sendTransacEmail(sendSmtpEmail);
        console.log(`✅ Email sent to ${email}:`, response.messageId || "Check Brevo logs");
        await new Promise(resolve => setTimeout(resolve, 1000)); // wait 1 second between sends
      } catch (err) {
        console.error(`❌ Failed to send email to ${email}:`, err.response?.body || err);
      }
    }
  } catch (error) {
    console.error("❌ Error fetching users or sending emails:", error);
  }
};

// ✅ SET INTERVAL TO SEND EVERY 30 SECONDS
setInterval(sendNewsletterEmails, 30000); // 30,000 ms = 30 seconds

// ✅ SERVER START
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
