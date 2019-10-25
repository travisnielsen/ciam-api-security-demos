using System;
using System.Text;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using Newtonsoft.Json.Linq;

namespace SignJwt
{
    class Program
    {
        // static string _pfxPath = "cert/cert.pfx";
        static string _pfxPassword = "";
        static string _pfx = "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";

        public static void Main(string[] args)
        {
            // string scopes = @"{'scopes': 'green blue red '}";
            string scopes = @"\""health.read purchases.read\""";
            Console.WriteLine(scopes);
            string newScopes = scopes.Replace("\\", "").Replace("\"", "");
            Console.WriteLine(newScopes);

            // JObject a = JObject.Parse(scopes);
            // Console.WriteLine(a.GetValue("scopes"));

            /*
            string sampleToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ilg1ZVhrNHh5b2pORnVtMWtsMll0djhkbE5QNC1jNTdkTzZRR1RWQndhTmsifQ.eyJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vZWQ0ZWY3NDQtMjU2Yi00ZjQ2LWIwY2ItODQyNmY0YTliZjQ4L3YyLjAvIiwiZXhwIjoxNTcxNjkyMzY4LCJuYmYiOjE1NzE2ODg3NjgsImF1ZCI6IjcwNjNmMDNmLWQzNzQtNGNkZS04YTg0LTQ1ZDE0ZGE3NjIzNyIsInN1YiI6IjE4NTlkZWIzLTUxNDgtNDdmZS1hMDNmLTA2OGZiODRkNmY3NiIsImdpdmVuX25hbWUiOiJUcmV2b3IiLCJmYW1pbHlfbmFtZSI6Ik5pZWxza2kiLCJlbWFpbHMiOlsidHJuQG5pZWxza2kuY29tIl0sInRmcCI6IkIyQ18xX3NvY2lhbC1yZWFjdCIsIm5vbmNlIjoiOGQ3ZjNlMzUtZTI3Zi00OWM5LWFiMmItZmQzNWYxNGQxODZiIiwic2NwIjoiZGVtby5yZWFkIiwiYXpwIjoiOGI4MTA1NjMtODM3Yi00NzcyLTk1OGEtOWQxNjY2YjBhOTE2IiwidmVyIjoiMS4wIiwiaWF0IjoxNTcxNjg4NzY4fQ.UIdw9sA8mSTb3fL8AopwymtCgMA93eOddEOj7YSpixq555pCPMv_PD3zbnGJTH5WHjkKx5ch__8lyPtnmIovaI6MniL0wmXG_vys4IGZF11HiybOH4x4OnCXMSPPxbRbpf7kYeA6TD-fD5D3lSE1WH1pBHZWEWEXBVg9Yi36vkuTeLEv7-I2J3GOwmJRgBu3RTAaKQh85Y2SdHGZFdfHgqzhXY9eym3MDhjY92gm0mAzOe0zgN6dix9sqYmfg_iYCXsE-rqY2bLS-CheCi2JgMLb21XjRgqgB25PnHgcBmVOlOidFcJdEylMmUAhk0RMsNtaricFx75SiR9xnYfbXQ";
            var claims = sampleToken.Split('.')[1];
            // Decoding example: https://stackoverflow.com/a/47209563
            string decoded = Encoding.UTF8.GetString(Convert.FromBase64String(claims.PadRight(claims.Length + (claims.Length % 4), '=')));
            Console.WriteLine(decoded);
            var jwt = JObject.Parse(decoded);
            Console.WriteLine(jwt.ToString(Newtonsoft.Json.Formatting.None));
            var sub = jwt["sub"].ToString(Newtonsoft.Json.Formatting.None).Trim('"');
            Console.WriteLine(sub); 

            var epoch = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);

            DateTime notBefore = DateTime.UtcNow;
            Console.WriteLine(Convert.ToInt64((notBefore - epoch).TotalSeconds));

            DateTime expires = notBefore.Add(TimeSpan.FromMinutes(60));
            Console.WriteLine(Convert.ToInt64((expires - epoch).TotalSeconds));

            string scp = Guid.NewGuid().ToString();
            Console.WriteLine(scp);
            */

            // Console.WriteLine(a["scopes"].ToString());
            // string stuff = JObject.Parse(scopes)["scopes"].ToString();
            // Console.WriteLine(stuff);

            /*
            JObject headerObj = new JObject();
            headerObj.Add("typ", "JWT");
            headerObj.Add("alg", "RS256");
            headerObj.Add("kid", "JLVTwaV69VmN2cRt1O2mnceHVGTog2HBqfXnPffbCS0");
            string header = headerObj.ToString(Newtonsoft.Json.Formatting.None);

            JObject payloadObj = new JObject();
            payloadObj.Add("exp", 1568473920);
            payloadObj.Add("nbf", 1568473920);
            payloadObj.Add("ver", "1.0");
            payloadObj.Add("iss", "https://nielskilab.b2clogin.com/ed4ef744-256b-4f46-b0cb-8426f4a9bf48/v2.0/");
            payloadObj.Add("sub", "b7c539bd-db29-48b6-a89b-5d494326a59e");
            payloadObj.Add("aud", "e383c3ec-054d-48f2-be50-28842d2b8e2");
            payloadObj.Add("acr", "b2c_1a_tou_susi");
            payloadObj.Add("nonce", "defaultNonce");
            payloadObj.Add("iat", "1568470320");
            payloadObj.Add("auth_time", "1568470320");
            payloadObj.Add("name", "Travis Nielsen");
            payloadObj.Add("given_name", "Travis");
            payloadObj.Add("family_name", "Nielsen");
            string payload = payloadObj.ToString(Newtonsoft.Json.Formatting.None);

            var result = Sign(header, payload);
            Console.WriteLine(result);
            */
        }

        private static string Sign(string header, string payload)
        {
            Console.WriteLine(header);
            Console.WriteLine(payload);
            // PFX and password will be stored as variables in APIM
            byte[] pfxBytes = System.Convert.FromBase64String(_pfx);
            X509Certificate2 cert = new X509Certificate2(pfxBytes, _pfxPassword);

            // Will not load pfx from file at this point. Needs to run natively as part of an APIM poicy
            // X509Certificate2 cert2 = new X509Certificate2(_pfxPath, _pfxPassword, X509KeyStorageFlags.PersistKeySet);

            var csp = cert.PrivateKey as RSACryptoServiceProvider;
            RSA rsa = cert.GetRSAPrivateKey();

            // Encode and strip trailing '==' characters
            // TODO: Look for better / more deterministic way to remove this trailing padding
            string encodedHeader = Convert.ToBase64String(Encoding.UTF8.GetBytes(header)).Replace("=", String.Empty);
            string encodedPayload = Convert.ToBase64String(Encoding.UTF8.GetBytes(payload)).Replace("=", String.Empty);
            string jwtData = encodedHeader + "." + encodedPayload;
            byte[] signatureBytes = rsa.SignData(Encoding.ASCII.GetBytes(jwtData), HashAlgorithmName.SHA256, RSASignaturePadding.Pkcs1);

            // Encode the signature using Base64Url encoding 
            string encodedSignature = Convert.ToBase64String(signatureBytes).Split('=')[0].Replace('+', '-').Replace('/', '_');

            return jwtData + "." + encodedSignature;
        }
    }
}
