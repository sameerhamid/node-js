module.exports = {
  apps: [
    {
      name: "natours-dev",
      script: "npm",
      args: "run dev",
      watch: false
    },
    {
      name: "natours-prod",
      script: "dist/app.js",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
