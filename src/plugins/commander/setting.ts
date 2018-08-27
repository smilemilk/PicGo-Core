import PicGo from '../../core/PicGo'
import path from 'path'
import fs from 'fs-extra'

export default {
  handle: (ctx: PicGo) => {
    const cmd = ctx.helper.cmd
    cmd.program
      .command('set')
      .description('set config of picgo')
      .action(() => {
        // load third-party plugins
        ctx.pluginLoader.load()
        console.log(ctx.config)
      })
  }
}
