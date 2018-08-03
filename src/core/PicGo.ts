import * as fs from 'fs-extra'
import * as path from 'path'
import { EventEmitter } from 'events'
import { homedir } from 'os'
import Transformer from '../lib/Transformer'
import Uploader from '../lib/Uploader'
import Logger from './Logger'
import Lifecycle from './Lifecycle'
import PluginLoader from './PluginLoader'
import LifecyclePlugins from '../lib/LifecyclePlugins'
import uploaders from '../plugins/uploader'
import transformers from '../plugins/transformer'
import { saveConfig } from '../utils/config'

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
  baseDir: string
  lifecycle: Lifecycle
  helper: Helper
  beforeTransformPlugins: LifecyclePlugins
  beforeUploadPlugins: LifecyclePlugins
  afterUploadPlugins: LifecyclePlugins
  log: Logger
  config: Config
  output: Array<ImgInfo>
  input: Array<any>
  constructor (configPath: string = '') {
    super()
    this.configPath = configPath
    this.output = []
    this.input = []
    this.helper = {
      transformer: new Transformer(),
      uploader: new Uploader(),
      beforeTransformPlugins: new LifecyclePlugins('beforeTransformPlugins'),
      beforeUploadPlugins: new LifecyclePlugins('beforeUploadPlugins'),
      afterUploadPlugins: new LifecyclePlugins('afterUploadPlugins')
    }
    this.log = new Logger()
    this.init()
  }

  init () {
    if (this.configPath === '') {
      this.configPath = homedir() + '/.picgo/config.json'
    }
    this.baseDir = path.dirname(this.configPath)
    const exist = fs.pathExistsSync(this.configPath)
    if (!exist) {
      fs.ensureFileSync(`${this.configPath}`)
    }
    // load self plugins
    PluginLoader(this)
    uploaders(this)
    transformers(this)
    this.lifecycle = new Lifecycle(this)
  }

  getConfig () {
    return this.config
  }

  // save to db
  saveConfig (config) {
    saveConfig(this.configPath, config)
    this.setConfig(config)
  }

  // set for ctx
  setConfig (config) {
    Object.keys(config).forEach(name => {
      this.config[name] = config[name]
    })
  }

  async upload (uploadThing: any) {
    await this.lifecycle.start(uploadThing)
  }
}

export default PicGo
