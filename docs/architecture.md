# Architecture patterns for securing microservices

## Introduction

This is an analysis of different candidate architectures for operating microservices (APIs) in environments that host sensitive customer data (PHI / PII) and may be subject to regulatory compliance standards such as HITrust, PCI, and others. In this context, customer trust is vital and service domains must operate only against data that has been consented to.

## Zero Trust Security

[Zero Trust Security portal](https://www.microsoft.com/en-us/security/zero-trust)

[Zero Trust Vision Whitepaper](https://go.microsoft.com/fwlink/p/?linkid=2109181)

## Azure Services

The following Azure services are being considered as part of this architecture.

### Azure Active Directory B2C

Supports interactive user authentication, account linking, federation to 3rd party OIDC providers, presenting consent screens and storing consent (preferences), service-to-service authorization scopes (as part of interactive user flow).

AAD B2C does **not** support authentication and authorization flows between services (i.e. client credential grant and "on behalf-of").
