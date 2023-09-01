var authClient = new OktaAuth({
  issuer: "https://dev-48408385.okta.com/oauth2/default",
  clientId: "0oab20bh2b3d1vEpw5d7",
  redirectUri: "http://localhost:8080",
});

var accessToken = authClient.tokenManager.get("accessToken")
  .then((accessToken) => {
    //If access token exists, output it to the console
    if (accessToken) {
      console.log(`access_token ${accessToken}`);
      return accessToken;
    }
    //If Id Token isn't found, try to parse it from the current URL
    else if (location.hash) {
      authClient.token.parseFromUrl().then((res) => {
        var accessToken = res[0];
        var idToken = res[1];
        authClient.tokenManager.add("accessToken", accessToken);
        authClient.tokenManager.add("idToken", idToken);
        window.location.hash = "";
      });
    } else {
      //You're not logged in, you need a sessionToken
      authClient.token.getWithRedirect({
        responseType: ["token", "id_token"],
      });
    }
  });

// const authClient = new OktaAuth(config);
// const tokenManager = authClient.tokenManager;
// const accessToken = tokenManager.get('accessToken');
// const idToken = await tokenManager.get('idToken');
// const userInfo = await authClient.token.getUserInfo(accessToken, idToken);
