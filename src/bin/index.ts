import PicGo = require('../index')

export = () => {
  const picgo = new PicGo()
  picgo.helper.cmd.program.parse(process.argv)
}
