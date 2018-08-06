import PicGo from '../core/PicGo'
import program from 'commander'
import inquirer from 'inquirer'
import pkg from '../../package.json'

interface Plugin {
  handle (ctx: PicGo): any
}

class Commander {
  list: {}
  program: typeof program
  inquirer: typeof inquirer

  constructor () {
    this.list = {}
    this.program = program
    this.inquirer = inquirer
  }

  init () {
    this.program
      .version(pkg.version, '-v, --version')
      .option('-c, --config <path>', 'Set config path', (config) => {
        console.log(config)
      })
  }

  register (name: string, plugin: Plugin) {
    if (!name) throw new TypeError('name is required!')
    if (typeof plugin.handle !== 'function') throw new TypeError('plugin.handle must be a function!')
    if (this.list[name]) throw new TypeError('duplicate name!')

    this.list[name] = plugin
  }

  get (name: string) {
    return this.list[name]
  }

  getList (): Array<Plugin> {
    return Object.keys(this.list).map(item => this.list[item])
  }
}

export default Commander
