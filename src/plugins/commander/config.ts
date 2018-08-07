import PicGo from '../../core/PicGo'
import path from 'path'
import fs from 'fs-extra'

export default {
  handle: (ctx: PicGo) => {
    const cmd = ctx.helper.cmd
    cmd.program
      .option('-c, --config <path>', 'set config path', async (configPath: string) => {
        if (!fs.pathExistsSync(configPath)) {
          throw new Error('Config path doesn\'t exist!')
        }
        ctx.configPath = configPath
        ctx.baseDir = path.dirname(configPath)
      })
  }
}
