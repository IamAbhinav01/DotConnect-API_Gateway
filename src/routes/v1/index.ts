import express, { type Request, type Response } from 'express'
import userRoutes from './user.routes.js'
import { verifyJWT } from '../../middleware/auth.middleware.js'
import { GenerateInternalToken } from '../../utils/jwt/jwt.utils.js'
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware'
import { ResolveEmailUser } from '../../middleware/workspace.middleware.js'
import { IdempotencyMiddleware } from '../../middleware/idempotency.middleware.js'

const v1Router = express.Router()

v1Router.use('/users', userRoutes)

// Invite & direct routes — only need JWT auth, no email resolution
const inviteProxy = createProxyMiddleware({
  target: 'http://localhost:4000',
  changeOrigin: true,
  on: {
    proxyReq: (proxyReq, req: Request, res: Response) => {
      const { userId, role } = res.locals
      const identityToken = GenerateInternalToken(userId, role)
      proxyReq.setHeader('Authorization', `Bearer ${identityToken}`)
      const body = (req as express.Request).body
      if (body && Object.keys(body).length > 0) {
        fixRequestBody(proxyReq, req as express.Request)
      }
    },
  },
})

// Routes that need email→userId resolution (member add/promote/demote/remove)
const memberResolutionProxy = createProxyMiddleware({
  target: 'http://localhost:4000',
  changeOrigin: true,
  on: {
    proxyReq: (proxyReq, req: Request, res: Response) => {
      const { userId, role } = res.locals
      const identityToken = GenerateInternalToken(userId, role)
      proxyReq.setHeader('Authorization', `Bearer ${identityToken}`)
      fixRequestBody(proxyReq, req as express.Request) // Sends the new { userId, role } body
    },
  },
})

v1Router.post(
  [
    '/workspace/:slug/members',
    '/workspace/:slug/addMember',
    '/workspace/:slug/members/promote',
    '/workspace/:slug/members/demote',
    '/workspace/:slug/removeMember',
  ],
  verifyJWT,
  ResolveEmailUser,
  memberResolutionProxy
)

v1Router.delete(
  '/workspace/:slug/removeMember',
  verifyJWT,
  ResolveEmailUser,
  memberResolutionProxy
)

v1Router.delete('/workspace/:slug/removeWorkspace', verifyJWT, inviteProxy)
v1Router.post('/workspace/:slug/removeWorkspace', verifyJWT, inviteProxy)
v1Router.post('/workspace/:slug/update', verifyJWT, inviteProxy)

v1Router.post('/workspace/:slug/invites', verifyJWT, inviteProxy)
v1Router.get('/workspace/:slug/invites', verifyJWT, inviteProxy)
v1Router.post('/workspace/:slug/join-requests', verifyJWT, inviteProxy)
v1Router.get('/workspace/:slug/join-requests', verifyJWT, inviteProxy)
v1Router.post(
  '/workspace/:slug/join-requests/:requestId/approve',
  verifyJWT,
  inviteProxy
)
v1Router.post(
  '/workspace/:slug/join-requests/:requestId/reject',
  verifyJWT,
  inviteProxy
)
v1Router.post(
  '/workspace/:slug/request/:requestId/approve',
  verifyJWT,
  inviteProxy
)
v1Router.post(
  '/workspace/:slug/request/:requestId/reject',
  verifyJWT,
  inviteProxy
)
v1Router.post(
  '/workspace/:slug/channels',
  verifyJWT,
  IdempotencyMiddleware,
  inviteProxy
)
v1Router.get('/workspace/invite/:code', verifyJWT, inviteProxy)
v1Router.get('/workspace/invites/:code', verifyJWT, inviteProxy)
v1Router.post('/workspace/invite/:code/request', verifyJWT, inviteProxy)
v1Router.post('/workspace/invites/:code/request', verifyJWT, inviteProxy)
v1Router.get('/workspace/:slug/request', verifyJWT, inviteProxy)

v1Router.use(
  '/workspace',
  verifyJWT,
  createProxyMiddleware({
    target: 'http://localhost:4000',
    changeOrigin: true,
    on: {
      proxyReq: (proxyReq, req: Request, res: Response) => {
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
