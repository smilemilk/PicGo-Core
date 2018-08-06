import PicGo from '../../core/PicGo'
import pluginHandler from './pluginHandler'

export default (ctx: PicGo) => {
  ctx.helper.cmd.register('pluginHandler', pluginHandler)
}
