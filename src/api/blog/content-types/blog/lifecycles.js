// @ts-nocheck

const Brevo = require("@getbrevo/brevo");

const defaultClient = Brevo.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

module.exports = {
  async afterCreate(event) {
    const { result, params } = event;

    try {
      const subscribers =
        await strapi.api.subscriber.services.subscriber.find();

      const apiInstance = new Brevo.TransactionalEmailsApi();

      for (let subscriber of subscribers.results) {
        await apiInstance.sendTransacEmail({
          templateId: 2,
          to: [{ email: subscriber.email }],
          params: {
            headline: result.headline,
            post_summary: result.post_summary + "...",
            blog_url: `${process.env.URL}/blog/${result.id}`,
            unsubscribe_url: `${process.env.URL}/unsubscribe?email=${subscriber.email}`,
          },
        });
      }

      console.log("Emails sent!");
    } catch (err) {
      console.log(err);
    }
  },
};
