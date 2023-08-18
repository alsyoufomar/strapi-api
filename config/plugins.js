module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: "cloudinary",
      providerOptions: {
        cloud_name: env("CLOUDINARY_NAME"),
        api_key: env("CLOUDINARY_KEY"),
        api_secret: env("CLOUDINARY_SECRET"),
      },
      actionOptions: {
        upload: {},
        delete: {},
      },
    },
  },
  email: {
    config: {
      provider: "strapi-provider-email-sendinblue",
      providerOptions: {
        sendinblue_api_key: env(
          "SENDINBLUE_API_KEY",
          "xsmtpsib-54b4a22dbb89d4b073c572da12d1bd8d25000ae5fc4092915731724d13403525-DQqPL4In01FCrOpy"
        ),
        sendinblue_default_from: "info@hithers.co.uk",
        sendinblue_default_from_name: "Ali Alsyouf",
      },
    },
  },
});
