import * as lowdb from 'lowdb'
import lodashId from 'lodash-id'
import * as FileSync from 'lowdb/adapters/FileSync'

interface Option {
  name: string
  value: any
}

const getConfig = (configPath: string): lowdb.LowdbSync<any> => {
  const adapter = new FileSync(configPath)
  const db = lowdb(adapter)
  db._.mixin(lodashId)

  if (!db.has('picBed').value()) {
    db.set('picBed', {
      current: 'weibo'
    }).write()
  }

  return db
}

const setConfig = (configPath: string, option: Option) => {
  const db = getConfig(configPath)
  return db.read().set(option.name, option.value).write()
}

export {
  getConfig,
  setConfig
}
