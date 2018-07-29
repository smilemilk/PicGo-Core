import * as lowdb from 'lowdb'
import lodashId from 'lodash-id'
import * as FileSync from 'lowdb/adapters/FileSync'

const getConfig = (configPath: string): lowdb.LowdbSync<any> => {
  const adapter = new FileSync(configPath)
  const db = lowdb(adapter)
  db._.mixin(lodashId)

  if (!db.has('picBed').value()) {
    db.set('picBed', {
      current: 'smms'
    }).write()
  }

  return db
}

const saveConfig = (configPath: string, config) => {
  const db = getConfig(configPath)
  Object.keys(config).forEach(name => {
    db.read().set(name, config[name]).write()
  })
}

export {
  getConfig,
  saveConfig
}
