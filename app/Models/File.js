'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Env = use('Env')

class File extends Model {
  static get computed () {
    return ['url']
  }

  getUrl ({ file }) {
    return `${Env.get('APP_URL')}/images/${file}`
  }
}

module.exports = File
