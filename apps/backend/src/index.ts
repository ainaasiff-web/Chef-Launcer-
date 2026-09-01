import { sendOtpHandler, verifyOtpHandler } from './routes/auth'

export interface Env {
  RESEND_API_KEY?: string
  JWT_SECRET?: string
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept',
  'Cross-Origin-Resource-Policy': 'cross-origin',
  'X-Content-Type-Options': 'nosniff',
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
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
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
      // POST /auth/send-otp, POST /auth/login, POST /auth/signup
      if ((path === '/auth/send-otp' || path === '/auth/login' || path === '/auth/signup') && request.method === 'POST') {
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

      // GET & POST /subscriptions
      if (path === '/subscriptions') {
        if (request.method === 'POST') {
          const body = await request.json().catch(() => ({}))
          const subId = 'sub-' + Date.now()
          return jsonResponse({
            success: true,
            subscription: {
              id: subId,
              status: 'active',
              ...body,
              createdAt: new Date().toISOString(),
            },
          })
        }
        return jsonResponse({
          success: true,
          data: [],
        })
      }

      // GET & POST /orders
      if (path === '/orders' || path === '/orders/me') {
        if (request.method === 'POST') {
          const body = await request.json().catch(() => ({}))
          const orderId = 'ord-' + Date.now()
          const orderNumber = `ORD-${Math.floor(10000 + Math.random() * 90000)}`
          return jsonResponse({
            success: true,
            order: {
              id: orderId,
              orderNumber,
              ...body,
              createdAt: new Date().toISOString(),
            },
          })
        }
        return jsonResponse({
          success: true,
          data: [],
        })
      }

      // GET /chefs, /chefs/:id, /chefs/:id/weekly-schedule, /chefs/:id/a-la-carte
      if (path === '/chefs' || path.startsWith('/chefs/')) {
        const demoChefsList = [
          { id: 'demo-1', name: 'Marco Rossi', bio: 'Award-winning Italian chef with 15 years of experience in Michelin-starred restaurants.', cuisineType: 'Italian', rating: '4.9', reviews: 142, profileImage: 'https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=800&auto=format&fit=crop', user: { id: 'u1', email: 'marco@cheflaunch.com' } },
          { id: 'demo-2', name: 'Kenji Tanaka', bio: 'Passionate sushi master trained in Tokyo for over a decade.', cuisineType: 'Japanese', rating: '5.0', reviews: 98, profileImage: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=800&auto=format&fit=crop', user: { id: 'u2', email: 'kenji@cheflaunch.com' } },
          { id: 'demo-3', name: 'Sophie Dubois', bio: 'Farm-to-table French cuisine. Trained at Le Cordon Bleu Paris.', cuisineType: 'French', rating: '4.8', reviews: 76, profileImage: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800&auto=format&fit=crop', user: { id: 'u3', email: 'sophie@cheflaunch.com' } },
          { id: 'demo-4', name: 'Carlos Mendez', bio: 'Authentic Mexican street food elevated to fine dining.', cuisineType: 'Mexican', rating: '4.7', reviews: 203, profileImage: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop', user: { id: 'u4', email: 'carlos@cheflaunch.com' } },
          { id: 'demo-5', name: 'Priya Sharma', bio: 'Modern Indian cuisine blending aromatic spices.', cuisineType: 'Indian', rating: '4.9', reviews: 118, profileImage: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&auto=format&fit=crop', user: { id: 'u5', email: 'priya@cheflaunch.com' } },
          { id: 'demo-6', name: 'Alex Papadopoulos', bio: 'Mediterranean fusion expert.', cuisineType: 'Mediterranean', rating: '4.6', reviews: 89, profileImage: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&auto=format&fit=crop', user: { id: 'u6', email: 'alex@cheflaunch.com' } }
        ]

        if (path === '/chefs' || path === '/chefs/') {
          return jsonResponse({ success: true, data: demoChefsList })
        }

        const chefId = path.split('/')[2]
        const matchedChef = demoChefsList.find(c => c.id === chefId) || demoChefsList[0]

        if (path.endsWith('/weekly-schedule')) {
          return jsonResponse({ success: true, data: [] })
        }

        if (path.endsWith('/a-la-carte')) {
          return jsonResponse({ success: true, data: [] })
        }

        return jsonResponse({ success: true, data: matchedChef })
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
