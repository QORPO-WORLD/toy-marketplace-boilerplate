# marketplace-boilerplate

## Setup

Set up a white-label marketplace in builder https://docs.sequence.xyz/solutions/marketplaces/white-label-marketplace

Add an `.env` file to the root of the project with the following variables:

```sh
# Url of to the marketplace you created in builder
NEXT_PUBLIC_DOMAIN="https://{SUBDOMAIN}.sequence.market"
# API key from builder (settings > API keys)
NEXT_PUBLIC_SEQUENCE_ACCESS_KEY="XXXXXX"
# Project ID from builder, found in the URL of the project sequence.build/project/{PROJECT_ID}
NEXT_PUBLIC_SEQUENCE_PROJECT_ID="XXXXXX"
# Environment, need to be set to "next" for now
NEXT_PUBLIC_ENV: "next"

```

## Install

```sh
pnpm install
```

## Development

```sh
pnpm dev
```

## Build

```sh
pnpm build
```
