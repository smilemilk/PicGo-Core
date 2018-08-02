import PicGo from './PicGo'
import * as fs from 'fs-extra'
import * as path from 'path'
import * as spawn from 'cross-spawn'
import * as resolve from 'resolve'

const resolvePlugin = (ctx: PicGo, name: string) => {
  try {
    return resolve.sync(name, { basedir: ctx.baseDir })
  } catch (err) {
    return path.join(ctx.baseDir, 'node_modules', name)
  }
}

export default async (ctx: PicGo) => {
  const packagePath = path.join(ctx.baseDir, 'package.json')
  const pluginDir = path.join(ctx.baseDir, 'node_modules/')
  try {
    if (!fs.existsSync(pluginDir)) {
      return false
    }
    if (!fs.existsSync(packagePath)) {
      spawn.sync('npm', ['init', '-y'], { stdio: 'inherit' , cwd: ctx.baseDir })
      return false
    }
    // Thanks to hexo -> https://github.com/hexojs/hexo/blob/master/lib/hexo/load_plugins.js
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
