# marketplace-boilerplate

## Setup

Set up a white-label marketplace in builder https://docs.sequence.xyz/solutions/marketplaces/white-label-marketplace

Add an `.env` file to the root of the project with the following variables:

You can run

```sh
pnpm env-file
```

To create sample file from `.env.example`

File:

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

For now we hardcoded port for app at `4420`

## Start

If you want to build app and just explore, run these commands

```sh
pnpm install
pnpm build
pnpm start
```

Then you should be able to access the page on [http://localhost:4420](http://localhost:4420)

## Install

Install dependencies

```sh
pnpm install
```

## Development

Run in development mode, watches changes in code and rebuild on the fly

```sh
pnpm dev
```

## Build

Build server

```sh
pnpm build
```
