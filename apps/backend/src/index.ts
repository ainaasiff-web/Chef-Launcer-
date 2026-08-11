import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import { authRouter } from './routes/auth.js'
import { chefsRouter } from './routes/chefs.js'
import { menusRouter } from './routes/menus.js'
import { checkoutRouter } from './routes/checkout.js'

const app = new Hono()

app.use('*', logger())
app.use('*', cors())

app.get('/', (c) => {
  return c.json({ message: 'Welcome to Chef Launcher API' })
})

app.route('/auth', authRouter)
app.route('/chefs', chefsRouter)
app.route('/menus', menusRouter)
app.route('/checkout', checkoutRouter)

const port = 3001
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
