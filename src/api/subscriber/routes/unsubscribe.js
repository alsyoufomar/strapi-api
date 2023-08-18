module.exports = {
  routes: [
    {
      method: "GET",
      path: "/unsubscribe/:email",
      handler: "subscriber.unsubscribe",
      config: {
        auth: false,
      },
    },
  ],
};
