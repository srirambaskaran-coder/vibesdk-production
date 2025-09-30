import { createLogger } from './logger';
import { SmartCodeGeneratorAgent } from './agents/core/smartGeneratorAgent';
import { createApp } from './app';
// import * as Sentry from '@sentry/cloudflare';
// import { sentryOptions } from './observability/sentry';
import { DORateLimitStore as BaseDORateLimitStore } from './services/rate-limit/DORateLimitStore';

// Durable Object exports
// export const CodeGeneratorAgent = Sentry.instrumentDurableObjectWithSentry(sentryOptions, SmartCodeGeneratorAgent);
// export const DORateLimitStore = Sentry.instrumentDurableObjectWithSentry(sentryOptions, BaseDORateLimitStore);
export const CodeGeneratorAgent = SmartCodeGeneratorAgent;
export const DORateLimitStore = BaseDORateLimitStore;

// Logger for the main application and handlers
const logger = createLogger('App');

/**
 * Main Worker fetch handler with robust, secure routing.
 */
const worker = {
	async fetch(request: any, env: Env, ctx: any): Promise<any> {
		const url = new URL(request.url);
		const { hostname, pathname } = url;

		// Security: Immediately reject any requests made via an IP address.
		const ipRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
		if (ipRegex.test(hostname)) {
			return new Response('Access denied. Please use the assigned domain name.', { status: 403 });
		}

		// Serve static assets for all non-API routes from the ASSETS binding.
		if (!pathname.startsWith('/api/')) {
			return env.ASSETS.fetch(request);
		}
		
		// Handle all API requests with the main Hono application.
		logger.info(`Handling API request for: ${url}`);
		const app = createApp(env);
		return app.fetch(request, env, ctx);
	},
};

export default worker;

// Wrap the entire worker with Sentry for comprehensive error monitoring.
// export default Sentry.withSentry(sentryOptions, worker);
