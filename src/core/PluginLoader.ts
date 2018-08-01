import PicGo from './PicGo'
import * as fs from 'fs-extra'
import * as path from 'path'
import * as spawn from 'cross-spawn'

export default (ctx: PicGo) => {
  const packagePath = path.join(ctx.baseDir, 'package.json')
  const pluginDir = path.join(ctx.baseDir, 'node_modules/')
  if (!fs.existsSync(packagePath)) {
    spawn.sync('npm', ['init', '-y'], { stdio: 'inherit' , cwd: ctx.baseDir })
  }
  if (!fs.existsSync(pluginDir)) {
    return false
  }
}
