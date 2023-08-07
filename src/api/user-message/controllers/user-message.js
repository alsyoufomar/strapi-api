// @ts-nocheck
"use strict";

/**
 * user-message controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const nodemailer = require("nodemailer");
const axios = require("axios");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

module.exports = createCoreController(
  "api::user-message.user-message",
  ({ strapi }) => ({
    async create(ctx) {
      try {
        ctx.query = { ...ctx.query, local: "en" };
        const entity = await super.create(ctx);

        const response = await axios.post(
          `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET_KEY}&response=${ctx.request.body.data.token}`
        );

        if (!response.data.success) {
          return ctx.throw(400, "Prove you aren't a robot");
        }

        const info = await transporter.sendMail({
          from: process.env.EMAIL_SENDER,
          to: process.env.EMAIL_RECEIVER,
          subject: `New message from ${entity.data.attributes.name}`,
          text: `${entity.data.attributes.message}\n\nPlease reply to this email: ${entity.data.attributes.email}`,
        });

        return { message: "Email sent!", data: entity.data, emailInfo: info };
      } catch (err) {
        return ctx.badRequest(err);
      }
    },
  })
);
