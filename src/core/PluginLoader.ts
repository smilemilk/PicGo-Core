import PicGo from './PicGo'
import fs from 'fs-extra'
import path from 'path'
import resolve from 'resolve'

const resolvePlugin = (ctx: PicGo, name: string) => {
  try {
    return resolve.sync(name, { basedir: ctx.baseDir })
  } catch (err) {
    return path.join(ctx.baseDir, 'node_modules', name)
  }
}

export default async (ctx: PicGo) => {
  const packagePath = path.join(this.ctx.baseDir, 'package.json')
  try {
    // Thanks to hexo -> https://github.com/hexojs/hexo/blob/master/lib/hexo/load_plugins.js
    const pluginDir = path.join(this.ctx.baseDir, 'node_modules/')
    if (!fs.existsSync(pluginDir)) {
      return false
    }
    const content = await fs.readFile(packagePath, 'utf-8')
    const json = JSON.parse(content)
    const deps = Object.keys(json.dependencies || {})
    const devDeps = Object.keys(json.devDependencies || {})
    const modules = deps.concat(devDeps).filter(name => {
      if (!/^picgo-plugin-|^@[^/]+\/picgo-plugin-/.test(name)) return false
      const path = resolvePlugin(ctx, name)
      return fs.existsSync(path)
    })
    for (let i in modules) {
      require(modules[i])(ctx)
    }
  } catch (e) {
    throw new Error(e)
  }
}
