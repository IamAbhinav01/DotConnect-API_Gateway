import express from 'express'
import userRoutes from './user.routes.js'
import { verifyJWT } from '../../middleware/auth.middleware.js'
import { GenerateInternalToken } from '../../utils/jwt/jwt.utils.js'
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware'


const v1Router = express.Router()

v1Router.use('/users', userRoutes)

v1Router.use(
  '/workspace',
  verifyJWT,
  createProxyMiddleware({
    target: 'http://localhost:4000',
    changeOrigin: true,
    on: {
      proxyReq: (proxyReq, req, res) => {
        const { userId, role } = res.locals
        // Mint identity token and inject as Bearer header for Go
        const identityToken = GenerateInternalToken(userId, role)
        proxyReq.setHeader('Authorization', `Bearer ${identityToken}`)
        fixRequestBody(proxyReq, req as express.Request)
      },
    },
  })
)

export default v1Router
