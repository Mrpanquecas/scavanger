const puppeteer = require('puppeteer')
const fs = require('fs')
const axios = require('axios')
const express = require('express')
const cors = require('cors')

const app = express()
const port = 3000

// const download = (uri, filename, callback) => {
//   request.head(uri, function (err, res, body) {
//       // console.log('content-type:', res.headers['content-type'])
//       // console.log('content-length:', res.headers['content-length'])
//       request(uri).pipe(fs.createWriteStream(filename)).on('close', callback)
//   })
// }
const download = (uri, filename, callback) => {
  axios({url: uri, responseType: 'stream'})
  .then(response =>
    new Promise((resolve, reject) => {
      response.data
        .pipe(fs.createWriteStream(filename))
        .on('finish', () => resolve())
        .on('error', e => reject(e))
    })  
  )
}

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

app.get('/', (req, res) => res.send('res'))

(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://www.worten.pt/')
  let imageLinks = await page.evaluate(() => {
    const images = document.querySelectorAll('img')
    const arr = []
    images.forEach(img => {
      if(img.src.length === 0) return
      const type = img.src.split('.')
      const obj = {
        src: img.src,
        title: img.title.trim(),
        fileType: type[type.length-1].length > 5 ? 'webp' : type[type.length-1]
      }
      arr.push(obj)
    })
    return arr
  })
  console.log(imageLinks)

  await imageLinks.forEach((image, i) => {
    download(image.src, `./pics/${image.title}-${i}.${image.fileType}`, function () {
    })
  })
  // await page.screenshot({path: 'example.png', fullPage: true})

  await browser.close()
})()