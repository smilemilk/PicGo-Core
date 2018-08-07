import PicGo from '../../core/PicGo'
import pluginHandler from './pluginHandler'
import config from './config'
import upload from './upload'
import setting from './setting'

export default (ctx: PicGo) => {
  ctx.helper.cmd.register('pluginHandler', pluginHandler)
  ctx.helper.cmd.register('config', config)
  ctx.helper.cmd.register('setting', setting)
  ctx.helper.cmd.register('upload', upload)
}
