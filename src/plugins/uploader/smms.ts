import PicGo from '../../core/PicGo'
import * as request from 'request-promise-native'

const postOptions = (fileName: string, imgBase64: string) => {
  return {
    method: 'POST',
    url: `https://sm.ms/api/upload`,
    headers: {
      contentType: 'multipart/form-data',
      'User-Agent': 'PicGo'
    },
    formData: {
      smfile: {
        value: Buffer.from(imgBase64, 'base64'),
        options: {
          filename: fileName
        }
      },
      ssl: 'true'
    }
  }
}

const handle = async (ctx: PicGo) => {
  try {
    ctx.emit('uploadProgress', 0)
    const imgList = ctx.output
    ctx.emit('uploadProgress', 30)
    for (let i in imgList) {
      const postConfig = postOptions(imgList[i].fileName, imgList[i].base64Image)
      let body = await request(postConfig)
      body = JSON.parse(body)
      if (body.code === 'success') {
        delete imgList[i].base64Image
        imgList[i]['imgUrl'] = body.data.url
        console.log(imgList[i])
      } else {
        ctx.emit('uploadProgress', -1)
        return new Error()
      }
    }
    ctx.emit('uploadProgress', 100)
    return ctx
  } catch (err) {
    ctx.emit('uploadProgress', -1)
    throw new Error(err)
  }
}

export default handle
