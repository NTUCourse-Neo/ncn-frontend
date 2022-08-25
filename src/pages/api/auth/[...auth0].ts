import { handleAuth, handleLogin } from "@auth0/nextjs-auth0";

export default handleAuth({
  async login(req, res) {
    try {
      await handleLogin(req, res, {
        authorizationParams: {
          audience: process.env.AUTH0_SELF_API_AUDIENCE,
          scope: "openid profile email offline_access do:anything",
        },
      });
    } catch (error) {
      res.status(400).end("Error in login");
    }
  },
});
