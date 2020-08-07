import * as Koa from 'koa'
import * as send from 'koa-send'
import * as cors from '@koa/cors'
import * as serve from 'koa-static'
import * as Router from 'koa-router'
import * as bodyParser from 'koa-bodyparser'
import { Domain } from './koa-domain'
import {
  onSignup, onConfirm, onLogin, authorize, isAdmin, isManager,
  onGetUser, onGetRooms, onPostRoomReq, onGetRoomReq, onPutRoomReq, onPostResidents,
  onPostRecover, onPutRecover, onGetRecover
} from './service'

const { DOMAIN } = process.env

const main = new Router()
  .use(serve('./public'))
  .get('*', (ctx) => send(ctx, 'public/index.html'))

const api = new Router()
  .use(cors())
  .use(bodyParser())
  .post('/signup', onSignup)
  .post('/confirm', onConfirm)
  .post('/login', onLogin)

  .post('/recover', onPostRecover)
  .put('/recover', onPutRecover)
  .get('/recover/:token', onGetRecover)

  .get('/user', authorize, onGetUser)
  .get('/rooms/:floor', authorize, onGetRooms)
  .post('/roomReq', authorize, onPostRoomReq)

  .get('/roomReq', authorize, isAdmin, onGetRoomReq)
  .put('/roomReq', authorize, isAdmin, onPutRoomReq)

  .post('/residents', authorize, isManager, onPostResidents)

  .all('*', (ctx) => ctx.throw(405))

const domain = new Domain()
  .use('', main.routes())
  .use('api', api.routes())

export const Web = new Koa()
  .use(domain.routes())
  .use((ctx) => ctx.redirect(`https://${DOMAIN}`))
