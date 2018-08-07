import PicGo from '../../core/PicGo'
// import PluginHandler from '../../lib/PluginHandler'

export default {
  handle: (ctx: PicGo) => {
    // const pluginHandler = new PluginHandler(ctx)
    const cmd = ctx.helper.cmd
    cmd.program
      .command('install <plugins...>')
      .description('install picgo plugin')
      .alias('i')
      .action((plugins) => {
        console.log(plugins)
      })
  }
}
