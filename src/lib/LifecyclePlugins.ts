import PicGo from '../core/PicGo'

interface Plugin {
  handle (ctx: PicGo): Promise<any>
}

class LifecyclePlugins {
  list: {}
  name: string

  constructor (name: string) {
    this.name = name
    this.list = {}
  }

  register (name: string, plugin: Plugin): void {
    if (!name) throw new TypeError('name is required!')
    if (typeof plugin.handle !== 'function') throw new TypeError('fn must be a function!')
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

export default LifecyclePlugins
