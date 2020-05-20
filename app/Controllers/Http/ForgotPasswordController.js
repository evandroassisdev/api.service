'use strict'

const moment = require('moment')
const crypto = require('crypto')
const User = use('App/Models/User')
const Kue = use('Kue')
const Job = use('App/Jobs/NewPasswordMail')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with forgotpasswords
 */
class ForgotPasswordController {
  /**
   * Show a list of all forgotpasswords.
   * GET forgotpasswords
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
  }

  /**
   * Create/save a new forgotpassword.
   * POST forgotpasswords
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    try {
      const email = request.input('email')
      const user = await User.findByOrFail('email', email)

      user.token = crypto.randomBytes(10).toString('hex')
      user.token_created_at = new Date()

      await user.save()

      const link = `${request.input('redirect_url')}?token=${user.token}`

      Kue.dispatch(Job.key, { email, user, link }, { attempts: 3 })
    } catch (err) {
      return response
      .status(err.status)
      .send({ message: 'Erro ao tentar lembrar senha.', success: false })
    }
  }

  /**
   * Display a single forgotpassword.
   * GET forgotpasswords/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Update forgotpassword details.
   * PUT or PATCH forgotpasswords/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    try {
      const { token, password } = request.all()

      const user = await User.findByOrFail('token', token)

      const tokenExpired = moment()
        .subtract('2', 'days')
        .isAfter(user.token_created_at)

      if (tokenExpired) {
        return response
          .status(401)
          .send({ message: 'O token de recuperação está expirado.', success: false })
      }

      user.token = null
      user.token_created_at = null
      user.password = password

      await user.save()
    } catch (err) {
      return response
        .status(err.status)
        .send({ message: 'Não foi possivel mudar a senha.', success: false })
    }
  }

  /**
   * Delete a forgotpassword with id.
   * DELETE forgotpasswords/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = ForgotPasswordController
