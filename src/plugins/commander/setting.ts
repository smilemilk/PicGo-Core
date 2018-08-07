import PicGo from '../../core/PicGo'
import path from 'path'
import fs from 'fs-extra'

export default {
  handle: (ctx: PicGo) => {
    const cmd = ctx.helper.cmd
    cmd.program
      .command('set', 'set config of picgo')
      .action(() => {
        console.log(ctx)
      })
  }
}
