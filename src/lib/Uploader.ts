class Uploader {
  list: object

  register (name: string, fn: Function): void {
    if (!name) throw new TypeError('name is required!')
    if (typeof fn !== 'function') throw new TypeError('fn must be a function')
    if (this.list[name]) throw new TypeError('duplicate name!')

    this.list[name] = fn
  }

  get (name: string) {
    return this.list[name]
  }
}

export default Uploader
