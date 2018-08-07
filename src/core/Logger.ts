import chalk from 'chalk'

class Logger {
  level: {}
  constructor () {
    this.level = {
      success: 'green',
      info: 'blue',
      warn: 'yellow',
      error: 'red'
    }
  }
  protected handleLog (type: string, msg: string | Error): string | Error {
    let log = chalk[this.level[type]](`[PicGo ${type.toUpperCase()}]: `)
    log += msg
    console.log(log)
    return msg
  }

  success (msg) {
    return this.handleLog('success', msg)
  }

  info (msg) {
    return this.handleLog('info', msg)
  }

  error (msg) {
    return this.handleLog('error', msg)
  }

  warn (msg) {
    return this.handleLog('warn', msg)
  }
}

export default Logger
