module.exports = {
  apps: [
    {
      name: "ncn-frontend-v2",
      script:
        "./node_modules/next/dist/bin/next build && ./node_modules/next/dist/bin/next",
      args: "start -p " + (process.env.PORT || 3000),
      watch: false,
      autorestart: true,
    },
  ],
};
