'use strict'

const Profile = use('App/Models/Profile')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with profiles
 */
class ProfileController {
  /**
   * Display a single profile.
   * GET profiles/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view, auth }) {
    const user = auth.user.id
    const profile = await Profile.findBy('user_id', user)

    return profile
  }

  /**
   * Update profile details.
   * PUT or PATCH profiles/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response, auth }) {
    const user = auth.user.id
    const profile = await Profile.findBy('user_id', user)
    const data = request.all()

    profile.merge(data)

    await profile.save()

    return profile
  }
}

module.exports = ProfileController
