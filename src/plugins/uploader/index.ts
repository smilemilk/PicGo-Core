import PicGo from '../../core/PicGo'
import SMMSUploader from './smms'

export default (ctx: PicGo) => {
  ctx.helper.uploader.register('smms', SMMSUploader)
}
