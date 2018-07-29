import { EventEmitter } from 'events'
import { getConfig } from '../utils/config'

interface Plugin {
  handle (ctx): Promise<any>
}

interface Context {
  picBed: object
  uploadThing: any
  [propName: string]: any
}

class Lifecycle extends EventEmitter {
  beforeTransformPlugins: Array<Plugin>
  beforeUploadPlugins: Array<Plugin>
  afterUploadPlugins: Array<Plugin>
  transformer: Plugin
  uploader: Plugin
  configPath: string

  constructor (configPath: string) {
    super()
    this.configPath = configPath
  }
  async start (uploadThing: any) {
    const config = getConfig(this.configPath).read().get('picBed').value()
    config.uploadThing = uploadThing
    const ctx = config
    try {
      await this.beforeTransform(ctx)
      await this.doTransform(ctx)
      await this.beforeUpload(ctx)
      await this.doUpload(ctx)
      await this.afterUpload(ctx)
      return ctx
    } catch (e) {
      return Promise.reject(e)
    }
  }
  async beforeTransform (ctx: Context) {
    this.emit('beforeTransfrom', ctx)
    this.handlePlugins(this.beforeTransformPlugins, ctx)
    return ctx
  }
  async beforeUpload (ctx: Context) {
    this.emit('beforeUpload', ctx)
    this.handlePlugins(this.beforeUploadPlugins, ctx)
    return ctx
  }
  async afterUpload (ctx: Context) {
    this.emit('afterUpload', ctx)
    this.handlePlugins(this.afterUploadPlugins, ctx)
    this.emit('finished', ctx)
    return ctx
  }
  async doTransform (ctx: Context) {
    await this.transformer.handle(ctx)
    return ctx
  }
  async doUpload (ctx: Context) {
    await this.uploader.handle(ctx)
    return ctx
  }
  async handlePlugins (plugins: Array<Plugin>, ctx: Context) {
    for (let i in plugins) {
      await plugins[i].handle(ctx)
    }
    return ctx
  }
}

export default Lifecycle
