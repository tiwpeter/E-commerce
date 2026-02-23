import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { errorHandler } from '@/shared/middleware/errorHandler'
import { notFound } from '@/shared/middleware/notFound'

const app = express()

// Middleware
app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

// Health check
app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'ecom-api is running' })
})

// Routes (จะ add เพิ่มใน step ถัดไป)
// app.use('/api/v1/products', productRoutes)

// Error handling (ต้องอยู่ท้ายสุดเสมอ)
app.use(notFound)
app.use(errorHandler)

export default app