// @ts-nocheck
"use strict";

/**
 * subscriber controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const Brevo = require("@getbrevo/brevo");
const validator = require("validator");

const defaultClient = Brevo.ApiClient.instance;

const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

module.exports = createCoreController(
  "api::subscriber.subscriber",
  ({ strapi }) => ({
    unsubscribe: async (ctx) => {
      try {
        const { email } = ctx.request.params;
        const existingUser = await strapi.db
          .query("api::subscriber.subscriber")
          .findOne({ where: { email: email } });

        if (!existingUser) {
          return ctx.badRequest("Invalid unsubscription link.");
        }

        await strapi.db
          .query("api::subscriber.subscriber")
          .delete({ where: { id: existingUser.id } });

        return { message: "Successfully unsubscribed." };
      } catch (err) {
        return ctx.badRequest("Invalid unsubscription link.");
      }
    },
    async create(ctx) {
      try {
        ctx.query = { ...ctx.query, local: "en" };

        const existingEmail = await strapi.db
          .query("api::subscriber.subscriber")
          .findOne({ where: { email: ctx.request.body.data.email } });

        if (existingEmail) {
          return ctx.badRequest("Email already subscribed.");
        }

        if (
          !ctx.request.body.data.email ||
          !validator.isEmail(ctx.request.body.data.email)
        ) {
          return ctx.badRequest("Invalid email provided.");
        }

        const entity = await super.create(ctx);

        const apiInstance = new Brevo.TransactionalEmailsApi();
        const sendSmtpEmail = {
          templateId: 1,
          to: [{ email: entity.data.attributes.email }],
          params: {
            unsubscribe_url: `${process.env.URL}/unsubscribe?email=${entity.data.attributes.email}`,
          },
        };
        const brevoData = await apiInstance.sendTransacEmail(sendSmtpEmail);

        return { data: entity.data, brevoData };
      } catch (err) {
        console.log("error: ", err);
        return ctx.badRequest(err);
      }
    },
  })
);
