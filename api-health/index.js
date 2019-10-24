// SAMPLE API FOR TESTING JWT ACCESS TOKENS ISSUED BY CUSTOM AZURE API MANAGEMENT POLICY CODE

var express = require("express");
var morgan = require("morgan");
var passport = require("passport");
var BearerStrategy = require('passport-azure-ad').BearerStrategy;

// TODO: Update these three variables based on your registered API in AAD B2C
var clientID = "b942470e-4b84-4160-bdf5-41355af9a41a";

var options = {
    identityMetadata: "https://nielskilab-hello.azurewebsites.net/demoidp/.well-known/openid-configuration/",
    clientID: clientID,
    isB2C: false,
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

app.get("/",
    function (req, res) {
        res.status(200).json({'data': 'hello!'});
    }
);

app.get("/health",
    passport.authenticate('oauth-bearer', {session: false}),
    function (req, res) {
        var claims = req.authInfo;
        console.log('User info: ', req.user);
        console.log('Validated claims: ', claims);
        
        if (claims['scp'].split(" ").indexOf("health.read") >= 0) {
            // Service relies on the name claim.  
            res.status(200).json({'firstName': claims['given_name'], 'lastName': claims['family_name']});
        } else {
            console.log("Invalid Scope, 403");
            res.status(403).json({'error': 'insufficient_scope'}); 
        }
    }
);

var port = process.env.PORT || 5000;
app.listen(port, function () {
    console.log("Listening on port " + port);
});
