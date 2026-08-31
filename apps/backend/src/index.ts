import { sendOtpHandler, verifyOtpHandler } from './routes/auth'

export interface Env {
  RESEND_API_KEY?: string
  JWT_SECRET?: string
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  })
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url)
    const path = url.pathname

    // Handle CORS Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      })
    }

    try {
      // POST /auth/send-otp
      if (path === '/auth/send-otp' && request.method === 'POST') {
        const body = await request.json().catch(() => ({}))
        const result = await sendOtpHandler(body as any, env)
        return jsonResponse(result)
      }

      // POST /auth/verify-otp
      if (path === '/auth/verify-otp' && request.method === 'POST') {
        const body = await request.json().catch(() => ({}))
        const result = await verifyOtpHandler(body as any, env)
        return jsonResponse(result)
      }

      // GET /auth/me
      if (path === '/auth/me' && request.method === 'GET') {
        const authHeader = request.headers.get('Authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return jsonResponse({ error: 'Unauthorized' }, 401)
        }
        return jsonResponse({
          success: true,
          user: {
            id: 'usr-demo-1',
            email: 'user@example.com',
            name: 'Demo User',
            role: 'diner',
          },
        })
      }

      // GET /subscriptions
      if (path === '/subscriptions' && request.method === 'GET') {
        return jsonResponse({
          success: true,
          data: [],
        })
      }

      // GET /orders/me
      if (path === '/orders/me' && request.method === 'GET') {
        return jsonResponse({
          success: true,
          data: [],
        })
      }

      // Root endpoint healthcheck
      if (path === '/' || path === '/health') {
        return jsonResponse({
          status: 'ok',
          service: 'Chef Launcher Worker API',
          version: '1.0.0',
        })
      }

      return jsonResponse({ error: `Route ${path} not found` }, 404)
    } catch (err: any) {
      console.error('[Worker Error]', err)
      return jsonResponse({ success: false, error: err?.message || 'Internal Server Error' }, 400)
    }
  },
}
