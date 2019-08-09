const puppeteer = require('puppeteer');
const fs = require('fs');
const stringify = require('csv-stringify');

const self = {
  browser: null,
  page: null,

  getDom: async () => {
    self.browser = await puppeteer.launch({headless: false})
    self.page = await self.browser.newPage()
    await self.page.goto('https://www.worten.pt/search?sortBy=relevance&hitsPerPage=999999&page=1&query=iphone')
  },

  parseResults: async () => {
    const prods = await self.page.$$('div[class=w-product__content]')
    const payload = []
    for(let prod of prods){
      const title = await (await (await prod.$('h3[class=w-product__title]')).getProperty('textContent')).jsonValue()
      let oldPrice = await  prod.$('.w-oldPrice')
      if(oldPrice !== null) {
        oldPrice = await (await (oldPrice).getProperty('textContent')).jsonValue()
      }
      const newPrice = await (await (await prod.$('.w-currentPrice')).getProperty('textContent')).jsonValue()

      payload.push({
        title,
        oldPrice: oldPrice && oldPrice.replace('€', ''),
        newPrice: newPrice.replace('€', '')
      })
      console.log(title, oldPrice, newPrice)
    }
    await self.browser.close()
    return payload
  },

  saveResultsToCsv: async (data, columns) => {
    stringify(data, { header: true, delimiter: ';', columns: columns }, (err, output) => {
      if (err) throw err;
      fs.writeFile('./data_dump/dump1.csv', output, (err) => {
          if (err) throw err;
          console.log('dump1 saved')
      })
    })
  }
}


module.exports = self;