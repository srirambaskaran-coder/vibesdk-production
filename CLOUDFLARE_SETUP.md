# Cloudflare Workers Setup Guide

This guide will help you deploy your VibeSDK to Cloudflare Workers without Enterprise features.

## Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **Wrangler CLI**: Install with `npm install -g wrangler`
3. **API Token**: Create one at [Cloudflare Dashboard → My Profile → API Tokens](https://dash.cloudflare.com/profile/api-tokens)

## Step 1: Authentication

```bash
wrangler auth login
```

Or set your API token:
```bash
export CLOUDFLARE_API_TOKEN=your_token_here
```

## Step 2: Create Required Resources

### Create D1 Database
```bash
wrangler d1 create vibesdk-db
```
Copy the database_id from the output and update it in `wrangler.jsonc`.

### Create R2 Bucket
```bash
wrangler r2 bucket create vibesdk-templates
```

### Create KV Namespace
```bash
wrangler kv:namespace create VibecoderStore
```
Copy the id from the output and update it in `wrangler.jsonc`.

## Step 3: Run Database Migrations

```bash
# Run migrations
npm run db:migrate:remote

# Optional: Set up initial data
npm run db:setup
```

## Step 4: Build and Deploy

```bash
# Build the project
npm run build

# Deploy to Cloudflare Workers
wrangler deploy
```

## Step 5: Set Environment Variables

Add your API keys as secrets (optional but recommended):

```bash
# AI Provider API Keys (choose what you need)
wrangler secret put OPENAI_API_KEY
wrangler secret put ANTHROPIC_API_KEY
wrangler secret put GOOGLE_AI_STUDIO_API_KEY

# GitHub Integration (optional)
wrangler secret put GITHUB_CLIENT_ID
wrangler secret put GITHUB_CLIENT_SECRET

# JWT Secret for authentication
wrangler secret put JWT_SECRET
```

## Configuration Notes

The simplified configuration removes Enterprise-only features:
- ❌ Dispatch Namespaces (Workers for Platforms)
- ❌ Containers (Sandbox Service)
- ❌ Custom Domain Routing
- ✅ Basic Workers functionality
- ✅ Durable Objects
- ✅ D1 Database
- ✅ R2 Storage
- ✅ KV Storage
- ✅ AI Bindings

## Troubleshooting

### Build Errors
- Ensure TypeScript compilation succeeds: `npm run build`
- Check for missing dependencies: `npm install`

### Deployment Errors
- Verify your API token has sufficient permissions
- Check that resource IDs in `wrangler.jsonc` are correct
- Ensure resources exist in your Cloudflare account

### Runtime Errors
- Check Worker logs: `wrangler tail`
- Verify environment variables are set
- Check D1 database connection

## Development

For local development:
```bash
# Start local development server
npm run dev:worker

# Or use Wrangler dev directly
wrangler dev --local
```

## Additional Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [D1 Database Documentation](https://developers.cloudflare.com/d1/)
- [R2 Storage Documentation](https://developers.cloudflare.com/r2/)