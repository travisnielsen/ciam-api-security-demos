// Authors:
// Shane Oatman https://github.com/shoatman
// Sunil Bandla https://github.com/sunilbandla
// Daniel Dobalian https://github.com/danieldobalian

var express = require("express");
var morgan = require("morgan");
var passport = require("passport");
var BearerStrategy = require('passport-azure-ad').BearerStrategy;

// TODO: Update these three variables based on your registered API in AAD B2C
var tenantName = "nielskilab"
var clientID = "7063f03f-d374-4cde-8a84-45d14da76237";
var policyName = "B2C_1_social-react";

var domain = "login.microsoftonline.com"
var tenantID = tenantName + ".onmicrosoft.com";

var options = {
    identityMetadata: "https://" + domain + "/" + tenantID + "/v2.0/.well-known/openid-configuration/",
    clientID: clientID,
    policyName: policyName,
    isB2C: true,
    validateIssuer: true,
    loggingLevel: 'info',
    passReqToCallback: false
};

var bearerStrategy = new BearerStrategy(options,
    function (token, done) {
        // Send user info using the second argument
        done(null, {}, token);
    }
);

var app = express();
app.use(morgan('dev'));

app.use(passport.initialize());
passport.use(bearerStrategy);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get("/hello",
    passport.authenticate('oauth-bearer', {session: false}),
    function (req, res) {
        var claims = req.authInfo;
        console.log('User info: ', req.user);
        console.log('Validated claims: ', claims);
        
        if (claims['scp'].split(" ").indexOf("demo.read") >= 0) {
            // Service relies on the name claim.  
            res.status(200).json({'firstName': claims['given_name'], 'lastName': claims['family_name'], 'city': claims['city']});
        } else {
            console.log("Invalid Scope, 403");
            res.status(403).json({'error': 'insufficient_scope'}); 
        }
    }
);

app.get("/scopes",
    passport.authenticate('oauth-bearer', {session: false}),
    function (req, res) {
        var claims = req.authInfo;
        console.log('User info: ', req.user);
        console.log('Validated claims: ', claims);
        
        if (claims['scp'].split(" ").indexOf("demo.read") >= 0) {
            // hard-coded demo scopes (for now)
            res.status(200).json({'scopes': 'health.read purchases.read'});
        } else {
            console.log("Invalid Scope, 403");
            res.status(403).json({'error': 'insufficient_scope'}); 
        }
    }
);

// FAKE IdP OIDC METADATA
app.get("/demoidp/v2.0/.well-known/openid-configuration",
    function (req, res) {
        res.status(200).json(
            {
                "issuer": "https://nielskilab-hello.azurewebsites.net/demoidp",
                "authorization_endpoint": "https://nielskilab-hello.azurewebsites.net/demoidp/oauth2/authorize",
                "token_endpoint": "https://nielskilab-hello.azurewebsites.net/demoidp/oauth2/token",
                "end_session_endpoint": "https://nielskilab-hello.azurewebsites.net/demoidp/oauth2/logout",
                "jwks_uri": "https://nielskilab-hello.azurewebsites.net/demoidp/discovery/v2.0/keys",
                "response_types_supported": [
                    "code",
                    "code id_token",
                    "code token",
                    "code id_token token",
                    "id_token",
                    "id_token token",
                    "token",
                    "token id_token"
                  ],
                  "scopes_supported": [
                    "openid"
                  ],
                  "subject_types_supported": [
                    "pairwise"
                  ],
                  "id_token_signing_alg_values_supported": [
                    "RS256"
                  ],
                  "token_endpoint_auth_methods_supported": [
                    "client_secret_post",
                    "client_secret_basic"
                  ],
                  "claims_supported": [
                    "idp",
                    "family_name",
                    "given_name",
                    "emails",
                    "city",
                    "sub",
                    "tfp",
                    "iss",
                    "iat",
                    "exp",
                    "aud",
                    "acr",
                    "nonce",
                    "auth_time"
                  ]
            }
        );
    }
);

app.get("/demoidp/discovery/v2.0/keys",
    function (req, res) {
        res.status(200).json(
            {
                "keys": [
                  {"kid":"84ce2114-4372-4125-bf3f-5a49ace09902","nbf":1493763266,"use":"sig","kty":"RSA","e":"AQAB","n":"s6tkAM1VKTjDy8hYN8bzx7BMlBCX0uotdTT1nJ2qWsiTcIqKQStpbiaWM0_qi1GamXkk8fJvmtuE_optm2OysebnnoHPzjD9f1TozmTj_W31pkENp37k12W5IqXW5lDoZCzLNBzqXQc1Bbu8htPVNpWle2H_BkvzL4pibb2iXwa9w5Fa-cU-vy6JajL0_3zKyjhho2He7ivvMUay0pwuOeW_yN5nHWwkAunLCGXeS_YW9AyvQwOtfNdcNPwzMMCml49e_taG6YMwyysDrougijpBms0fgR5U6_8Ai6kBlTxPG47hTe4eRMt1ztCeEi5EhH4evsd8Uymet-xA6x6jrSus7VYInpkysW-PaOJTN9A8uDJ2caX0nXfKg8NZXfdO82l8zPd97aSh45iaQLAlIevugYwQGWjhHpasJcAcdUA-kAqueLwGQmqhEO_-yLQyPJFRcABYUGFHnDh2_xgQ5GaoRvsByBZV3DVGqYiQTarJzIS_PcU57VW7OFnXnojDV9t6aRVdyuty-5_Reml0HWqNx2kzJWuhmA5bq9Pxh9A0iGbkI0S9VUrIs_w54PxPxg7nXa0QSjS47YsY2LJ09DBoNfuqcfCSvYo1ZTiGAs9eIY4Xc_uvJzl0aImRpUsr6rX88JkN-xFnB2mXD_ludCJVao-cr6OW08Yr3iUO4Xs"}
                ]
            }
        );
    }
);

var port = process.env.PORT || 5000;
app.listen(port, function () {
    console.log("Listening on port " + port);
});
