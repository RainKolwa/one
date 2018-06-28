module.exports = {
  apps: [
    {
      name: "luck-api",
      script: "index.js",
      env_production: {
        NODE_ENV: "production"
      }
    }
  ],
  deploy: {
    production: {
      user: "root",
      host: "118.25.7.248", // tx
      ref: "origin/master",
      repo: "git@github.com:RainKolwa/one.git",
      path: "/var/www/one",
      "post-deploy":
        "yarn && yarn run db && pm2 startOrGracefulReload ecosystem.config.js --env production && pm2 save"
    }
  }
};
