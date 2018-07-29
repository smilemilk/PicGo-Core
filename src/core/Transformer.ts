import * as sizeOf from 'image-size'
import * as path from 'path'
import * as fs from 'fs-extra'

interface ImgSize {
  width: number
  height: number
}

interface ImgInfo {
  base64Image: string
  fileName: string
  width: number
  height: number
  extname: string
}

const imgFromPath = async (imgPath: string[]): Promise<ImgInfo[]> => {
  let results: ImgInfo[] = []
  await Promise.all(imgPath.map(async item => {
    let fileName = path.basename(item)
    let buffer = await fs.readFile(item)
    let base64Image = Buffer.from(buffer).toString('base64')
    let imgSize: ImgSize = sizeOf(item)
    results.push({
      base64Image,
      fileName,
      width: imgSize.width,
      height: imgSize.height,
      extname: path.extname(item)
    })
  }))
  return results
}

const imgFromBase64 = async (imgInfo: ImgInfo): Promise<ImgInfo[]> => {
  let results = []
  results.push(imgInfo)
  return results
}

export {
  imgFromPath,
  imgFromBase64
}
