const express = require('express');
const app = express();
const { auth, requiredScopes } = require('express-oauth2-jwt-bearer');

var axios = require("axios").default;
const port = 3000 || env.port || process.env.port;

const axiosInstance = axios.create({
  baseURL: 'https://dev-a5l4tidpguu30ikt.us.auth0.com'
});

    // Authorization middleware. When used, the Access Token must
    // exist and be verified against the Auth0 JSON Web Key Set.
const checkJwt = auth({
    audience: 'https://dev-a5l4tidpguu30ikt.us.auth0.com/api/v2/',
    issuerBaseURL: 'https://dev-a5l4tidpguu30ikt.us.auth0.com/',
  });

    // This route doesn't need authentication
    app.get('/api/public', function(req, res) {
      res.json({
        message: 'Hello from a public endpoint! You don\'t need to be authenticated to see this.'
      });
    });

    // This route needs authentication
    //next add axios middleware to get token b4 
    app.get('/api/private', checkJwt, function(req, res) {
      console.log('see me, it reached!')
      const {accessToken} = req.body;

      var auth0MgtApiAccessToken;      

      // const apiAuth0Send = 
      // (tokensObj) => {
        // var mgtApiAccessToken;
        var options = {
          method: 'POST',
          url: 'https://dev-a5l4tidpguu30ikt.us.auth0.com/oauth/token',
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${accessToken}`,
          },
          data: new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: 'ZrPJHabBbjFefV8H5HA6Mmq0Wti3ea3B',
            client_secret: 'Hf4KxO3zAsO0PZEsl07a8DnbWHNYurIaeFg03Vw5LCx86F45HiXUMMyT8P3SR_PR',
            audience: 'https://dev-a5l4tidpguu30ikt.us.auth0.com/api/v2/'
          })
        };
      
      
        axios(options).then(function (response) {
          console.log('authMgtApi file: ', response.data);
      
          auth0MgtApiAccessToken = response.data;
          // getIdpData(response.data.accessToken);
        }).catch(function (error) {
          console.error('authMgtApi Err: ', error);
        });
        // return mgtApiAccessToken;
      // }
      res.json({
        message: 'Hello! Token received and authenticated.'
      });
    });

    const checkScopes = requiredScopes('read:users, read:user_idp_tokens');

    app.get('/api/private-scoped', checkJwt, checkScopes, function(req, res) {
      const {userId} = req;
      // const getIdpData = (userId, mgtAccessToken) => {
      const mgtAccessToken = auth0MgtApiAccessToken;
        // var options = {
        //   method: 'GET',
        //   url: `/api/v2/users/${userId}`,
        //   // params: {q: 'email:"jane@exampleco.com"', search_engine: 'v3'},
        //   headers: {authorization: `Bearer ${mgtAccessToken}`}
        // };

        axiosInstance.interceptors.request.use(
          (config) => {
            if(mgtAccessToken) {
              config.headers['Authorization'] = `Bearer ${mgtAccessToken}`;
            }
            return config;
          // config = {
          // url: `/api/v2/users/${userId}`,
          // params: {q: 'email:"jane@exampleco.com"', search_engine: 'v3'},
          // headers: {authorization: `Bearer ${mgtAccessToken}`}
        },
        (error) => {
            return Promise.reject(error);
          }
        );
        
      try{
        const response = axiosInstance.get(`/api/v2/users/${userId}`)
          console.log('IDP data: ', response.data);
          //Process and return response to react native app
          res.json(response.data);
       } catch (error) {
          console.error(error);
           //Process and return response to react native app
          res.json(error);
          throw error
        }
      // }

      // //Process and return response to react native app
      // res.json(response.data);
    });

    // axios middleware
    // const tokenUse = axios.interceptors.request.use(
    //   (config) => {
    //     // Do something before request is sent
    //     const token = localStorage.getItem('authToken');
    //     if (token) {
    //       config.headers.Authorization = `Bearer ${token}`;
    //     }
    //     return config;
    //   },
    //   (error) => {
    //     // Do something with request error
    //     return Promise.reject(error);
    //   }
    // );

    app.listen(port, function() {
      console.log(`Listening on http://localhost:${port}`);
    });