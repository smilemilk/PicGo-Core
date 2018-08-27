import PicGo from '../core/PicGo'
import fs from 'fs-extra'
import path from 'path'
import resolve from 'resolve'

class PluginLoader {

  ctx: PicGo
  list: Array<string>
  constructor (ctx) {
    this.ctx = ctx
    this.list = []
  }

  resolvePlugin (ctx: PicGo, name: string) {
    try {
      return resolve.sync(name, { basedir: ctx.baseDir })
    } catch (err) {
      return path.join(ctx.baseDir, 'node_modules', name)
    }
  }

  async load () {
    const packagePath = path.join(this.ctx.baseDir, 'package.json')
    const pluginDir = path.join(this.ctx.baseDir, 'node_modules/')
    try {
      // Thanks to hexo -> https://github.com/hexojs/hexo/blob/master/lib/hexo/load_plugins.js
      if (!fs.existsSync(pluginDir)) {
        return false
      }
      const content = await fs.readFile(packagePath, 'utf-8')
      const json = JSON.parse(content)
      const deps = Object.keys(json.dependencies || {})
      const devDeps = Object.keys(json.devDependencies || {})
      const modules = deps.concat(devDeps).filter(name => {
        if (!/^picgo-plugin-|^@[^/]+\/picgo-plugin-/.test(name)) return false
        const path = this.resolvePlugin(this.ctx, name)
        return fs.existsSync(path)
      })
      for (let i in modules) {
        this.list.push(modules[i])
        if (this.ctx.config.plugins[modules[i]] || this.ctx.config.plugins[modules[i]] === undefined) {
          require(pluginDir + modules[i])(this.ctx)
          const plugin = `plugins[${modules[i]}]`
          this.ctx.saveConfig(
            {
              [plugin]: true
            }
          )
        }
      }
    } catch (e) {
      throw new Error(e)
    }
  }

  getList (): Array<string> {
    return Object.keys(this.list).map(item => this.list[item])
  }
}
export default PluginLoader
