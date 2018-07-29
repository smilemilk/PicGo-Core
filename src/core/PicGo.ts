import Lifecycle from './Lifecycle'
import { homedir } from 'os'
import * as fs from 'fs-extra'

class PicGo {
  configPath: string
  lifecycle: Lifecycle
  constructor (configPath: string = '') {
    this.configPath = configPath
    this.init(this.configPath)
  }

  init (configPath: string) {
    if (configPath === '') {
      configPath = homedir() + '/.picgo/config.json'
    }
    const exist = fs.pathExistsSync(configPath)
    if (!exist) {
      fs.ensureFileSync(`${configPath}`)
    }
    this.lifecycle = new Lifecycle(configPath)
  }

  async upload (uploadThing: any) {
    await this.lifecycle.start(uploadThing)
  }

  on (lifecycleName: string, fn: (...args: any[]) => void) {
    return this.lifecycle.on(lifecycleName, fn)
  }

  off (lifecycleName: string, fn: (...args: any[]) => void) {
    return this.lifecycle.off(lifecycleName, fn)
  }
}

export default PicGo
