const puppeteer = require('puppeteer');
const fs = require('fs');
const stringify = require('csv-stringify');

const self = {
  browser: null,
  page: null,

  getDom: async () => {
    self.browser = await puppeteer.launch({headless: false})
    self.page = await self.browser.newPage()
    await self.page.goto('https://iswitch.pt/146-comprar-iphone?order=product.position.asc&resultsPerPage=999')
  },

  parseResults: async () => {
    const prods = await self.page.$$('div[class=product-description]')
    const payload = []
    for(let prod of prods){
      const title = await (await (await prod.$('.product-title > a')).getProperty('textContent')).jsonValue()
      let oldPrice = await  prod.$('.regular-price')
      if(oldPrice !== null) {
        oldPrice = await (await (oldPrice).getProperty('textContent')).jsonValue()
      }
      const newPrice = await (await (await prod.$('.product-price')).getProperty('textContent')).jsonValue()

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
      fs.writeFile('./data_dump/dump3.csv', output, (err) => {
          if (err) throw err;
          console.log('dump3 saved')
      })
    })
  }
}


module.exports = self;