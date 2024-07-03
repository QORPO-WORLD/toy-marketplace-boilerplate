# marketplace-boilerplate

## Setup

Set up a white-label marketplace in builder https://docs.sequence.xyz/solutions/marketplaces/white-label-marketplace

Add an `.env` file to the root of the project with the following variables:

```sh
# Url of the marketplace you created in Builder
NEXT_PUBLIC_DOMAIN="https://{SUBDOMAIN}.sequence.market"

# Environment, must be set to "next" for now
NEXT_PUBLIC_ENV="next"

# API key from Builder > Settings > API keys. e.g. https://sequence.build/project/{PROJECT_ID}/settings/apikeys
NEXT_PUBLIC_SEQUENCE_ACCESS_KEY="XXXXXX"
# Project ID from Builder, found in the URL of the project, e.g. https://sequence.build/project/{PROJECT_ID}
NEXT_PUBLIC_SEQUENCE_PROJECT_ID="XXXXXX"
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
