#!/usr/bin/env bun

// Simple deployment script for standard Cloudflare Workers
console.log('🚀 Starting deployment...');

// Step 1: Build the project
console.log('📦 Building project...');
const buildResult = Bun.spawn(['bun', 'run', 'build'], {
  stdio: ['inherit', 'inherit', 'inherit'],
});

const buildExitCode = await buildResult.exited;
if (buildExitCode !== 0) {
  console.error('❌ Build failed');
  process.exit(1);
}

console.log('✅ Build completed');

// Step 2: Deploy to Cloudflare Workers
console.log('🌐 Deploying to Cloudflare Workers...');
const deployResult = Bun.spawn(['wrangler', 'deploy'], {
  stdio: ['inherit', 'inherit', 'inherit'],
});

const deployExitCode = await deployResult.exited;
if (deployExitCode !== 0) {
  console.error('❌ Deployment failed');
  process.exit(1);
}

console.log('✅ Deployment completed successfully!');
console.log('🎉 Your application is now live on Cloudflare Workers!');