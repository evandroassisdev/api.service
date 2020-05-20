'use strict'

const Mail = use('Mail')

class NewPasswordMail {
  // If this getter isn't provided, it will default to 1.
  // Increase this number to increase processing concurrency.
  static get concurrency () {
    return 1
  }

  // This is required. This is a unique key used to identify this job.
  static get key () {
    return 'NewPasswordMail-job'
  }

  // This is where the work is done.
  async handle ({ email, user, link }) {
    console.log(`Job: ${NewPasswordMail.key}`)

    await Mail.send(
      ['emails.forgot_password'],
      { email, token: user.token, link },
      message => {
        message
          .to(user.email)
          .from('suporte@apiservice.com.br', ' Suporte | Api Service')
          .subject('Recuperação de Senha')
      }
    )
  }
}

module.exports = NewPasswordMail

