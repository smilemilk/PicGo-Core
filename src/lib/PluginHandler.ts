import PicGo from '../core/PicGo'

class PluginHandler {
  ctx: PicGo
  constructor (ctx: PicGo) {
    this.ctx = ctx
  }
  install (plugins: string[]) {
    console.log(plugins)
  }
  uninstall (plugins: string[]) {
    console.log(plugins)
  }
}

export default PluginHandler
