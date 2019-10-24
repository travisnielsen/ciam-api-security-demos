# Introduction

This is a demo repository for B2C and OIDC / OAuth testing. It includes the following components.

## Azure API Management as Token Issuer

Includes proof-of-concept / experimental code and configuration ([link](apim/apim-policy.md)) for securing back-end APIs with Azure API Management as a token issuer.

## Sample B2C client (SPA)

This is a basic single-page JavaScript application for demonstrating authentication against Azure AD B2C (AAD B2C) and calling an API that performs authorization against the same B2C teanant.

## Sample B2C client (React JS)

This is a React JS appliction intended to showcase AAD B2C features.

## API 1: Hello

Sample API that uses JWT tokens issued by the AAD B2C tenant. It also hosts URIs to support OIDC metadata for the APIM token issuer.

## API 2: Health

Sample back-end API that uses JWT tokens issued by the custom APIM code.