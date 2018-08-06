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
  protected handleLog (type: string, msg: string | Error) {
    let log = chalk[this.level[type]](`[PicGo ${type.toUpperCase()}]: `)
    log += msg
    console.log(log)
  }

  success (msg) {
    this.handleLog('success', msg)
  }

  info (msg) {
    this.handleLog('info', msg)
  }

  error (msg) {
    this.handleLog('error', msg)
  }

  warn (msg) {
    this.handleLog('warn', msg)
  }
}

export default Logger
