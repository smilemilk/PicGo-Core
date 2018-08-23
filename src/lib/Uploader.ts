class Uploader {
  list: {}

  constructor () {
    this.list = {}
  }

  register (name: string, fn: Function): void {
    if (!name) throw new TypeError('name is required!')
    if (typeof fn !== 'function') throw new TypeError('fn must be a function!')
    if (this.list[name]) throw new TypeError('duplicate name!')

    this.list[name] = fn
  }

  get (name: string) {
    if (this.list[name]) {
      return this.list[name]
    } else {
      throw new Error(`Can't find uploader - ${name}`)
    }
  }
}

export default Uploader
