import * as Koa from 'koa'
import Validator from 'validator'
import { readFileSync } from 'fs'
import { createTransport } from 'nodemailer'
import { createHmac, randomBytes, Hmac } from 'crypto'
import { User } from './models'

const { MAIL_SECRET, AUTH_SECRET, DOMAIN } = process.env

const { isEmail, isMobilePhone } = Validator

const confirmTemplate = readFileSync('./public/templates/email-confirmation.html', { encoding: 'utf-8' })

type TSignupPayload = {
  email: string;
  password: [string, string];
  firstname: string;
  lastname: string;
  phone: number;
  dob: number;
}

type TWebToken = {
  id: string;
  rank: number;
  lastname: string;
  firstname: string;
  dob: Date;
  phone: number;
  profileIcon: string | null;
  signed: number;
}

const sendConfirm = (to: string, confirm: string) => {
  const html = confirmTemplate.replace(/{link}/g, `https://${DOMAIN}/signup?confirm=${confirm}`)
  return createTransport(MAIL_SECRET).sendMail({ to, html, subject: 'Potwierdzenie rejestracji', from: 'Confirm Indorm <confirm@indorm.life>' })
}

const isValidPassword = (password: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[`~!@#$%^&*()\-=_+;:'"/?,<.>])(?=.{6,})/.test(password)

const validateSignup = async (payload: TSignupPayload) => {
  const { email, password, firstname, lastname, phone, dob } = payload

  if (![email, password, firstname, lastname, phone, dob].every((v) => v)) return new Error('Bad Request')

  if (!isEmail(email)) return new Error('Email is invalid')
  if (!Array.isArray(password) || password[0] !== password[1]) return new Error('Passwords do not match')
  if (!isValidPassword(password[0])) return new Error('Password is too weak')
  if (!isMobilePhone(`+48${phone}`, 'pl-PL', { strictMode: true })) return new Error('Phone number is invalid')
  if (!+new Date(dob) || +new Date(dob) < -220899384e4 || +new Date() - +new Date(dob) < 504576e6) return new Error('Invalid age')

  const user = await User.findOne({ where: { email } })
  if (user) return new Error('User already exists')

  return new Error()
}

const hashObject = (obj: TWebToken) => Object.values(obj).reduce((a: Hmac, c) => a.update(`${c}`), createHmac('sha256', AUTH_SECRET || '')).digest('base64')

const sign = (payload: TWebToken) => {
  const hash = hashObject(payload)
  const json = JSON.stringify({ ...payload, hash })

  return Buffer.from(json).toString('base64')
}

const verify = async (bearer: string) => {
  const string = Buffer.from(bearer, 'base64').toString()
  const { hash, ...payload }: { hash: string } & TWebToken = JSON.parse(string)
  const hmac = hashObject(payload)

  return hash === hmac
    ? Promise.resolve(payload)
    : Promise.reject(new Error('Hashes do not match'))
}

export const authorize: Koa.Middleware = (ctx, next) => {
  const { authorization }: { authorization: string } = ctx.header
  if (!authorization) return ctx.throw(400)

  const [, bearer] = authorization.split(' ')

  return verify(bearer || '').then((data: TWebToken) => {
    if (Date.now() - data.signed > 6e8) return ctx.throw(408)
    return Object.assign(ctx.state, data) && next()
  }).catch(() => ctx.throw(401))
}

export const onSignup: Koa.Middleware = async (ctx) => {
  const payload = ctx.request.body as TSignupPayload
  const { email, password, firstname, lastname, phone, dob } = payload

  const { message } = await validateSignup(payload)
  if (message) return ctx.throw(400, message)

  const hmac = createHmac('sha256', AUTH_SECRET || '').update(password[0]).digest('base64')
  const confirmation = randomBytes(48).toString('base64').replace(/\+/g, '-').replace(/\//g, '_')

  const user = await User.create({ email, hmac, confirmation })
  user.createUserInfo({ firstname, lastname, phone, dob: new Date(dob) })

  await sendConfirm(email, confirmation)

  ctx.status = 200
}

export const onConfirm: Koa.Middleware = async (ctx) => {
  const { confirmation } = ctx.request.body as { confirmation: string }
  if (!confirmation) return ctx.throw(400)

  const user = await User.findOne({ where: { confirmation } })
  if (!user) return ctx.throw(404)

  await user.update({ confirmation: null })

  ctx.status = 200
}

export const onLogin: Koa.Middleware = async (ctx) => {
  const { email, password } = ctx.request.body as { email: string; password: string }

  if (!(email && password)) return ctx.throw(400)
  const hmac = createHmac('sha256', AUTH_SECRET || '').update(password).digest('base64')

  const user = await User.findOne({ where: { email, hmac, confirmation: null } })
  if (!user) return ctx.throw(401)

  const info = await user.getUserInfo()
  const bearer = sign({ signed: Date.now(), ...info.toJSON() } as TWebToken)

  ctx.body = { bearer }
}