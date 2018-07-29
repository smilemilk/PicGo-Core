import Lifecycle from './Lifecycle'
import { EventEmitter } from 'events'
import { homedir } from 'os'
import * as fs from 'fs-extra'
import Transformer from '../lib/Transformer'
import Uploader from '../lib/Uploader'
import LifecyclePlugins from '../lib/LifecyclePlugins'
import uploaders from '../plugins/uploader'
import transformers from '../plugins/transformer'

interface Helper {
  transformer: Transformer
  uploader: Uploader
  beforeTransformPlugins: LifecyclePlugins
  beforeUploadPlugins: LifecyclePlugins
  afterUploadPlugins: LifecyclePlugins
}

interface ImgInfo {
  base64Image?: string
  fileName?: string
  width?: number
  height?: number
  extname?: string
  [propName: string]: any
}

interface Config {
  [propName: string]: any
}

class PicGo extends EventEmitter {
  configPath: string
  lifecycle: Lifecycle
  helper: Helper
  transformer: Transformer
  uploader: Uploader
  beforeTransformPlugins: LifecyclePlugins
  beforeUploadPlugins: LifecyclePlugins
  afterUploadPlugins: LifecyclePlugins
  config: Config
  output: Array<ImgInfo>
  input: Array<any>
  constructor (configPath: string = '') {
    super()
    this.configPath = configPath
    this.helper = {
      transformer: new Transformer(),
      uploader: new Uploader(),
      beforeTransformPlugins: new LifecyclePlugins('beforeTransformPlugins'),
      beforeUploadPlugins: new LifecyclePlugins('beforeUploadPlugins'),
      afterUploadPlugins: new LifecyclePlugins('afterUploadPlugins')
    }
    this.init()
  }

  init () {
    if (this.configPath === '') {
      this.configPath = homedir() + '/.picgo/config.json'
    }
    const exist = fs.pathExistsSync(this.configPath)
    if (!exist) {
      fs.ensureFileSync(`${this.configPath}`)
    }
    // load self plugins
    uploaders(this)
    transformers(this)
    this.lifecycle = new Lifecycle(this)
  }

  async upload (uploadThing: any) {
    await this.lifecycle.start(uploadThing)
  }
}

export default PicGo
