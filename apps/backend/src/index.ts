import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import { authRouter } from './routes/auth.js'
import { chefsRouter } from './routes/chefs.js'
import { menusRouter } from './routes/menus.js'
import { menuItemsRouter } from './routes/menuItems.js'
import { checkoutRouter } from './routes/checkout.js'
import { subscriptionsRouter } from './routes/subscriptions.js'
import { ordersRouter } from './routes/orders.js'

const app = new Hono()

app.use('*', logger())
app.use('*', cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))

app.get('/', (c) => {
  return c.json({ message: 'Welcome to Chef Launcher API' })
})

app.route('/auth', authRouter)
app.route('/api/auth', authRouter)
app.route('/chefs', chefsRouter)
app.route('/api/chefs', chefsRouter)
app.route('/menus', menusRouter)
app.route('/api/menus', menusRouter)
app.route('/menu-items', menuItemsRouter)
app.route('/api/menu-items', menuItemsRouter)
app.route('/checkout', checkoutRouter)
app.route('/api/checkout', checkoutRouter)
app.route('/subscriptions', subscriptionsRouter)
app.route('/api/subscriptions', subscriptionsRouter)
app.route('/orders', ordersRouter)
app.route('/api/orders', ordersRouter)



app.onError((err, c) => {
  console.error('[Hono Error]:', err)
  const status = (err as any).status || 500
  return c.json(
    {
      success: false,
      error: err.message || 'Internal Server Error',
    },
    status
  )
})

app.notFound((c) => {
  return c.json(
    {
      success: false,
      error: 'Route not found',
    },
    404
  )
})

const port = 3001
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port,
})
