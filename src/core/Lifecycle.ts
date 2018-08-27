import { EventEmitter } from 'events'
import PicGo from './PicGo'

interface Plugin {
  handle (ctx: PicGo): Promise<any>
}

class Lifecycle extends EventEmitter {
  configPath: string
  ctx: PicGo

  constructor (ctx: PicGo) {
    super()
    this.ctx = ctx
  }

  async start (input: Array<any>) {
    try {
      // input
      if (!Array.isArray(input)) {
        throw new Error('Input must be an array.')
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
      if (this.ctx.config.debug) {
        Promise.reject(e)
      }
    }
  }
  async beforeTransform (ctx: PicGo) {
    this.ctx.emit('uploadProgress', 0)
    this.ctx.emit('beforeTransfrom', ctx)
    this.ctx.log.info('Before transform')
    this.handlePlugins(ctx.helper.beforeTransformPlugins.getList(), ctx)
    return ctx
  }
  async doTransform (ctx: PicGo) {
    this.ctx.emit('uploadProgress', 30)
    this.ctx.log.info('Transforming...')
    let type = ctx.config.transformer || 'path'
    let transformer = this.ctx.helper.transformer.get(type)
    await transformer.handle(ctx)
    return ctx
  }
  async beforeUpload (ctx: PicGo) {
    this.ctx.emit('uploadProgress', 60)
    this.ctx.log.info('Before upload')
    this.ctx.emit('beforeUpload', ctx)
    this.handlePlugins(ctx.helper.beforeUploadPlugins.getList(), ctx)
    return ctx
  }
  async doUpload (ctx: PicGo) {
    this.ctx.log.info('Uploading...')
    let type = ctx.config.uploader || ctx.config.current || 'smms'
    let uploader = this.ctx.helper.uploader.get(type)
    await uploader.handle(ctx)
    return ctx
  }
  async afterUpload (ctx: PicGo) {
    this.ctx.emit('afterUpload', ctx)
    this.ctx.emit('uploadProgress', 100)
    this.handlePlugins(ctx.helper.afterUploadPlugins.getList(), ctx)
    this.ctx.emit('finished', ctx.output)
    let msg = ''
    for (let i in ctx.output) {
      msg += ctx.output[i].imgUrl + '\n'
    }
    this.ctx.log.success(`\n${msg}`)
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
