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
                  {
                    "kid":"57E713B900BBB613FC492E2FC0EC9A10FF9E9CF29457198C429B71FE89383421",
                    "nbf":1493763266,
                    "use":"sig",
                    "kty":"RSA", 
                    "alg":"RS256",
                    "e": "AQAB",
                    "n": "QjNBQjY0MDBDRDU1MjkzOEMzQ0JDODU4MzdDNkYzQzdCMDRDOTQxMDk3RDJFQTJENzUzNEY1OUM5REFBNUFDODkzNzA4QThBNDEyQjY5NkUyNjk2MzM0RkVBOEI1MTlBOTk3OTI0RjFGMjZGOUFEQjg0RkU4QTZEOUI2M0IyQjFFNkU3OUU4MUNGQ0UzMEZEN0Y1NEU4Q0U2NEUzRkQ2REY1QTY0MTBEQTc3RUU0RDc2NUI5MjJBNUQ2RTY1MEU4NjQyQ0NCMzQxQ0VBNUQwNzM1MDVCQkJDODZEM0Q1MzY5NUE1N0I2MUZGMDY0QkYzMkY4QTYyNkRCREEyNUYwNkJEQzM5MTVBRjlDNTNFQkYyRTg5NkEzMkY0RkY3Q0NBQ0EzODYxQTM2MURFRUUyQkVGMzE0NkIyRDI5QzJFMzlFNUJGQzhERTY3MUQ2QzI0MDJFOUNCMDg2NURFNEJGNjE2RjQwQ0FGNDMwM0FEN0NENzVDMzRGQzMzMzBDMEE2OTc4RjVFRkVENjg2RTk4MzMwQ0IyQjAzQUU4QkEwOEEzQTQxOUFDRDFGODExRTU0RUJGRjAwOEJBOTAxOTUzQzRGMUI4RUUxNERFRTFFNDRDQjc1Q0VEMDlFMTIyRTQ0ODQ3RTFFQkVDNzdDNTMyOTlFQjdFQzQwRUIxRUEzQUQyQkFDRUQ1NjA4OUU5OTMyQjE2RjhGNjhFMjUzMzdEMDNDQjgzMjc2NzFBNUY0OUQ3N0NBODNDMzU5NURGNzRFRjM2OTdDQ0NGNzdERURBNEExRTM5ODlBNDBCMDI1MjFFQkVFODE4QzEwMTk2OEUxMUU5NkFDMjVDMDFDNzU0MDNFOTAwQUFFNzhCQzA2NDI2QUExMTBFRkZFQzhCNDMyM0M5MTUxNzAwMDU4NTA2MTQ3OUMzODc2RkYxODEwRTQ2NkE4NDZGQjAxQzgxNjU1REMzNTQ2QTk4ODkwNERBQUM5Q0M4NEJGM0RDNTM5RUQ1NUJCMzg1OUQ3OUU4OEMzNTdEQjdBNjkxNTVEQ0FFQjcyRkI5RkQxN0E2OTc0MUQ2QThEQzc2OTMzMjU2QkExOTgwRTVCQUJEM0YxODdEMDM0ODg2NkU0MjM0NEJENTU0QUM4QjNGQzM5RTBGQzRGQzYwRUU3NURBRDEwNEEzNEI4RUQ4QjE4RDhCMjc0RjQzMDY4MzVGQkFBNzFGMDkyQkQ4QTM1NjUzODg2MDJDRjVFMjE4RTE3NzNGQkFGMjczOTc0Njg4OTkxQTU0QjJCRUFCNUZDRjA5OTBERkIxMTY3MDc2OTk3MEZGOTZFNzQyMjU1NkE4RjlDQUZBMzk2RDNDNjJCREUyNTBFRTE3Qg",
                    "x5t": "NTdFNzEzQjkwMEJCQjYxM0ZDNDkyRTJGQzBFQzlBMTBGRjlFOUNGMjk0NTcxOThDNDI5QjcxRkU4OTM4MzQyMQ",
                    "x5c": [
                        "MIIEojCCAooCCQCGvaMCraxtijANBgkqhkiG9w0BAQsFADATMREwDwYDVQQDDAhhcGltZGVtbzAeFw0xOTA5MTMyMzIyMDFaFw0yMDA5MTIyMzIyMDFaMBMxETAPBgNVBAMMCGFwaW1kZW1vMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAs6tkAM1VKTjDy8hYN8bzx7BMlBCX0uotdTT1nJ2qWsiTcIqKQStpbiaWM0_qi1GamXkk8fJvmtuE_optm2OysebnnoHPzjD9f1TozmTj_W31pkENp37k12W5IqXW5lDoZCzLNBzqXQc1Bbu8htPVNpWle2H_BkvzL4pibb2iXwa9w5Fa-cU-vy6JajL0_3zKyjhho2He7ivvMUay0pwuOeW_yN5nHWwkAunLCGXeS_YW9AyvQwOtfNdcNPwzMMCml49e_taG6YMwyysDrougijpBms0fgR5U6_8Ai6kBlTxPG47hTe4eRMt1ztCeEi5EhH4evsd8Uymet-xA6x6jrSus7VYInpkysW-PaOJTN9A8uDJ2caX0nXfKg8NZXfdO82l8zPd97aSh45iaQLAlIevugYwQGWjhHpasJcAcdUA-kAqueLwGQmqhEO_-yLQyPJFRcABYUGFHnDh2_xgQ5GaoRvsByBZV3DVGqYiQTarJzIS_PcU57VW7OFnXnojDV9t6aRVdyuty-5_Reml0HWqNx2kzJWuhmA5bq9Pxh9A0iGbkI0S9VUrIs_w54PxPxg7nXa0QSjS47YsY2LJ09DBoNfuqcfCSvYo1ZTiGAs9eIY4Xc_uvJzl0aImRpUsr6rX88JkN-xFnB2mXD_ludCJVao-cr6OW08Yr3iUO4XsCAwEAATANBgkqhkiG9w0BAQsFAAOCAgEAEuGgKKHd22mNdap-oTY2wW_wqaBKl08RXtZPsCsuQZVs4uMfYoM92SGdDShs4IpfhlbhH5fX_wODc9u2hUr4mZWokdyM_GAzCIPV6m9RYlXT7O8R8NZP8KEJrrH7580j6uVt8GpPPY45xJRKNFDe7Yqv0j7jxEMnbnTdN7b8zRYK9z218jCYmL-bPDbSACwU81ItFyr-yEqNhmkj3_fpGOpmMU4ijGM_TGTgh7QM72bvZmYjhTxWTpHRxsNwLWSXWSzhqxbR4bMEvETulC15lASqdq1DBftThVMhgx5AZT9TZvqi2hOlQ80yHJ2gZfcNKV0TdLK_84RqS07HAcR8fe19hr4mCauatg1g11H_du1l4wDCqw778e_EDLfJSoyUqMXrgW4-j341Ilrh4njG5hNF_9z0NmsGtuxsE-kytZ55tbf8xuK3fbaYEdz45A_59gyeY-41SozLwSLq7kwSNSpnoWL3fyJbQW6sGBaPFbpeono7kWN0nrgjqehxeXHS4sFshL69OFt7aq8qZ5YlOP49YbYGVA2kFaumXiS18FSo_SFEtdisDBtxZ8U3Y0llrcIdTaGhuWEt3X2zs6x1O9D2Ag2L-esebBJ2vAlvNRQdQJiMNxT16wwyP94MynyxokxnMhFthnz7Ff-oKF6Cim-ltxasKaUcr1AtVIbP_aI"
                    ]
                  },
                  {
                    "kid":"84ce2114-4372-4125-bf3f-5a49ace09902",
                    "use":"sig",
                    "kty":"RSA",
                    "alg":"RS256",
                    "e":"AQAB",
                    "n":"s6tkAM1VKTjDy8hYN8bzx7BMlBCX0uotdTT1nJ2qWsiTcIqKQStpbiaWM0_qi1GamXkk8fJvmtuE_optm2OysebnnoHPzjD9f1TozmTj_W31pkENp37k12W5IqXW5lDoZCzLNBzqXQc1Bbu8htPVNpWle2H_BkvzL4pibb2iXwa9w5Fa-cU-vy6JajL0_3zKyjhho2He7ivvMUay0pwuOeW_yN5nHWwkAunLCGXeS_YW9AyvQwOtfNdcNPwzMMCml49e_taG6YMwyysDrougijpBms0fgR5U6_8Ai6kBlTxPG47hTe4eRMt1ztCeEi5EhH4evsd8Uymet-xA6x6jrSus7VYInpkysW-PaOJTN9A8uDJ2caX0nXfKg8NZXfdO82l8zPd97aSh45iaQLAlIevugYwQGWjhHpasJcAcdUA-kAqueLwGQmqhEO_-yLQyPJFRcABYUGFHnDh2_xgQ5GaoRvsByBZV3DVGqYiQTarJzIS_PcU57VW7OFnXnojDV9t6aRVdyuty-5_Reml0HWqNx2kzJWuhmA5bq9Pxh9A0iGbkI0S9VUrIs_w54PxPxg7nXa0QSjS47YsY2LJ09DBoNfuqcfCSvYo1ZTiGAs9eIY4Xc_uvJzl0aImRpUsr6rX88JkN-xFnB2mXD_ludCJVao-cr6OW08Yr3iUO4Xs"
                  }
                ]
            }
        );
    }
);

var port = process.env.PORT || 5000;
app.listen(port, function () {
    console.log("Listening on port " + port);
});
