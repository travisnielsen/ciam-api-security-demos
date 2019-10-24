# Generate the certificate
openssl req -x509 -subj '/CN=apimdemo' -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365

# Create a PFX file
openssl pkcs12 -export -out cert.pfx -inkey key.pem -in cert.pem

# Get thumbprint
IFS='='
THUMBPRINT=`openssl x509 -noout -fingerprint -sha256 -inform pem -in cert.pem`
echo $THUMBPRINT
