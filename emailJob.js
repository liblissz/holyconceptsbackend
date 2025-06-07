const cron = require('node-cron');
// const Subscriber = require('./models/Subscriber');
const SibApiV3Sdk = require('sib-api-v3-sdk');

require('dotenv').config();

const sendEmails = async () => {
  const defaultClient = SibApiV3Sdk.ApiClient.instance;
  const apiKey = defaultClient.authentications['api-key'];
  apiKey.apiKey = "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"

  // process.env.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;

  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  const subscribers = await Subscriber.find();

  for (const user of subscribers) {
    const sendSmtpEmail = {
      to: [{ email: user.email }],
      sender: { name: 'Your Company', email: 'your@email.com' },
      subject: '🚀 Get the latest updates from us!',
      htmlContent: `
        <h2 style="color: #4CAF50;">Hello!</h2>
        <p>Thanks for subscribing to our newsletter. Here's what's new:</p>
        <ul>
          <li>✅ New product launches</li>
          <li>💥 Flash sales</li>
          <li>📢 Community news</li>
        </ul>
        <p>Stay connected with us!</p>
        <hr>
        <small>If you no longer wish to receive emails, reply "unsubscribe".</small>
      `
    };

    try {
      await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log(`✅ Email sent to ${user.email}`);
    } catch (error) {
      console.error(`❌ Email failed for ${user.email}:`, error.message);
    }
  }
};

// Run every hour
cron.schedule('0 * * * *', () => {
  console.log('⏰ Running hourly email job...');
  sendEmails();
});
