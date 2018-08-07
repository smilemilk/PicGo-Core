import PicGo from '../../core/PicGo'
import path from 'path'
import fs from 'fs-extra'

export default {
  handle: (ctx: PicGo) => {
    const cmd = ctx.helper.cmd
    cmd.program
      .command('upload')
      .description('upload, go go go')
      .arguments('<input...>')
      .alias('u')
      .action(async (input: string[]) => {
        const inputList = input
          .map(item => path.resolve(item))
          .filter(item => {
            return fs.existsSync(item)
          })
        await ctx.upload(inputList)
      })
  }
}
