import { EventEmitter } from 'events'
import { getConfig } from '../utils/config'
import PicGo from './PicGo'

interface Plugin {
  handle (ctx: PicGo): Promise<any>
}

class Lifecycle extends EventEmitter {
  beforeTransformPlugins: Array<Plugin>
  beforeUploadPlugins: Array<Plugin>
  afterUploadPlugins: Array<Plugin>
  transformer: Function
  uploader: Function
  configPath: string
  ctx: PicGo

  constructor (ctx: PicGo) {
    super()
    this.ctx = ctx
  }

  async start (input: Array<any>) {
    // init Config
    try {
      const config = getConfig(this.ctx.configPath).read().get('picBed').value()
      this.ctx.config = config
      if (!Array.isArray(input)) {
        throw new Error('Upload thing must be an array.')
      }
      this.ctx.input = input

      // lifecycle main
      await this.beforeTransform(this.ctx)
      await this.doTransform(this.ctx)
      await this.beforeUpload(this.ctx)
      await this.doUpload(this.ctx)
      await this.afterUpload(this.ctx)
      return this.ctx
    } catch (e) {
      this.ctx.emit('uploadProgress', -1)
      this.ctx.log.error(e)
      Promise.reject(e)
    }
  }
  async beforeTransform (ctx: PicGo) {
    this.ctx.emit('uploadProgress', 0)
    this.ctx.emit('beforeTransfrom', ctx)
    this.ctx.log.info('Before transform')
    this.handlePlugins(ctx.helper.beforeTransformPlugins.getList(), ctx)
    return ctx
  }
  async beforeUpload (ctx: PicGo) {
    this.ctx.emit('uploadProgress', 60)
    this.ctx.log.info('Before upload')
    this.ctx.emit('beforeUpload', ctx)
    this.handlePlugins(ctx.helper.beforeUploadPlugins.getList(), ctx)
    return ctx
  }
  async afterUpload (ctx: PicGo) {
    this.ctx.emit('afterUpload', ctx)
    this.handlePlugins(ctx.helper.afterUploadPlugins.getList(), ctx)
    this.ctx.emit('uploadProgress', 100)
    this.ctx.emit('finished', ctx.output)
    let msg = ''
    for (let i in ctx.output) {
      msg += ctx.output[i].imgUrl + '\n'
    }
    this.ctx.log.success(`\n${msg}`)
    return ctx
  }
  async doTransform (ctx: PicGo) {
    this.ctx.emit('uploadProgress', 30)
    this.ctx.log.info('Transforming...')
    let type = ctx.config.transformer || 'path'
    let transformer = this.ctx.helper.transformer.get(type)
    await transformer(ctx)
    return ctx
  }
  async doUpload (ctx: PicGo) {
    this.ctx.log.info('Uploading...')
    let type = ctx.config.uploader || ctx.config.current || 'smms'
    let uploader = this.ctx.helper.uploader.get(type)
    await uploader(ctx)
    return ctx
  }
  async handlePlugins (plugins: Array<Plugin>, ctx: PicGo) {
    for (let i in plugins) {
      await plugins[i].handle(ctx)
    }
    return ctx
  }
}

export default Lifecycle
