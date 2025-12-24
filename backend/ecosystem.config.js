module.exports = {
  apps: [
    {
      name: "auth-service",
      cwd: "./auth-service",
      script: "src/server.js"
    },
    {
      name: "restaurant-service",
      cwd: "./restaurant-service",
      script: "src/server.js"
    },
    {
      name: "order-service",
      cwd: "./order-service",
      script: "src/server.js"
    },
    {
      name: "delivery-service",
      cwd: "./delivery-service",
      script: "src/server.js"
    },
    {
      name: "payment-service",
      cwd: "./payment-service",
      script: "src/server.js"
    },
    {
      name: "notification-service",
      cwd: "./notification-service",
      script: "src/server.js"
    }
  ]
};
