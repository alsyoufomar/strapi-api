module.exports = ({ env }) => ({
  url: env("PUBLIC_URL", "https://ali-website-server.onrender.com"),
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 3030),
  app: {
    keys: env.array("APP_KEYS"),
  },
  webhooks: {
    populateRelations: env.bool("WEBHOOKS_POPULATE_RELATIONS", false),
  },
});
