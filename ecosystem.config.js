module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    // First application
    {
      name: "API",
      script: "index.js",
      env_production: {
        NODE_ENV: "production"
      }
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy: {
    production: {
      user: "ubuntu",
      host: "118.25.7.248", // tx
      ref: "origin/master",
      repo: "git@github.com:RainKolwa/one.git",
      path: "/var/www/one",
      "post-deploy":
        "yarn install && pm2 reload ecosystem.config.js --env production"
    }
  }
};
