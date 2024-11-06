const config = {
  development: {
    client: "pg",
    connection: {
      host: "pg-d2cf68d-ga04-static-page.k.aivencloud.com",
      database: "ticketzen",
      user: "avnadmin",
      password: "AVNS_1s829F5C7_B4E5LFZ33",
      port: 21249,
    },
    migrations: {
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds",
    },
  },

  production: {
    client: "pg",
    connection: {
      user: "avnadmin",
      password: "AVNS_1s829F5C7_B4E5LFZ33",
      host: "pg-d2cf68d-ga04-static-page.k.aivencloud.com",
      port: 21249,
      database: "ticketzen",
      ssl: {
        rejectUnauthorized: false,
      },
    },
    migrations: {
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds",
    },
  },
};

module.exports = config["development"];
