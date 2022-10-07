import { Context } from 'koa'
import Joi from 'joi'
import User from '../../models/user'

type UserRequestBody = {
  username: string
  password: string
}

export const register = async (ctx: Context) => {
  const schema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(20).required(),
    password: Joi.string().required()
  })
  const result = schema.validate(ctx.request.body)
  if (result.error) {
    ctx.status = 400
    ctx.body = result.error
    return
  }

  const { username, password } = ctx.request.body as UserRequestBody
  try {
    const exists = await User.findByUsername(username)
    if (exists) {
      ctx.status = 409
      return
    }
    const user = new User({
      username
    })
    await user.setPassword(password)
    await user.save()
    ctx.body = user.serialize()
  } catch (e) {
    ctx.throw(500, `${e}`)
  }
}

export const login = async (ctx: Context) => {}

export const check = async (ctx: Context) => {}

export const logout = async (ctx: Context) => {}
