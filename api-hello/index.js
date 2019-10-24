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
app.get("/demoidp/.well-known/openid-configuration",
    function (req, res) {
        res.status(200).json(
            {
                "issuer": "https://nielskilab-hello.azurewebsites.net/demoidp",
                "authorization_endpoint": "https://nielskilab-hello.azurewebsites.net/demoidp/oauth2/authorize",
                "token_endpoint": "https://nielskilab-hello.azurewebsites.net/demoidp/oauth2/token",
                "end_session_endpoint": "https://nielskilab-hello.azurewebsites.net/demoidp/oauth2/logout",
                "jwks_uri": "https://nielskilab-hello.azurewebsites.net/demoidp/discovery/keys"
            }      
            
        );
    }
);

app.get("/demoidp/discovery/keys",
    function (req, res) {
        res.status(200).json(
            {
                "keys": [
                  { "kid":"JLVTwaV69VmN2cRt1O2mnceHVGTog2HBqfXnPffbCS1","nbf":1493763266,"use":"sig","kty":"RSA" }
                ]
            }
        );
    }
);

var port = process.env.PORT || 5000;
app.listen(port, function () {
    console.log("Listening on port " + port);
});
