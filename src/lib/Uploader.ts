const Uploader = async (ctx) => {
  let config = ctx.getConfig()
  let currentUploader = ctx.getUploader(config.picBed.current)
  return currentUploader(ctx)
}

export default Uploader
