const puppeteer = require('puppeteer');
const fs = require('fs');
const stringify = require('csv-stringify');
const { PendingXHR } = require('pending-xhr-puppeteer');

const self = {
  browser: null,
  page: null,

  getDom: async () => {
    self.browser = await puppeteer.launch({headless: false})
    self.page = await self.browser.newPage()
    const pendingXHR = new PendingXHR(self.page);
    await self.page.goto('https://hey-phones.com/categoria-produto/iphone/')
    const selectorForLoadMoreButton = '.load-on-click'
    let visible = true
    const isElementVisible = async (page = self.page, selector) => {
      await page
        .waitForSelector(selector, { visible: true, timeout: 5000 })
        .catch(() => {
          visible = false
        })
      return visible
    }
    let loadMoreVisible = await isElementVisible(page = self.page, selectorForLoadMoreButton)
    while (loadMoreVisible) {
      await pendingXHR.waitForAllXhrFinished();
      await page
        .click(selectorForLoadMoreButton)
        .catch(() => {})
      loadMoreVisible = await isElementVisible(page = self.page, selectorForLoadMoreButton)
    }
  },

  parseResults: async (products) => {
    const prods = await self.page.$$('div[class=product-info]')
    const payload = []
    for(let prod of prods){
      const title = await (await (await prod.$('h3[class=product-title] > a')).getProperty('textContent')).jsonValue()
      const oldPrice = await (await (await prod.$('span[class=price] > del')).getProperty('textContent')).jsonValue()
      const newPrice = await (await (await prod.$('span[class=price] > ins')).getProperty('textContent')).jsonValue()
      payload.push({
        title,
        oldPrice: oldPrice.replace('€', ''),
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
      fs.writeFile('./data_dump/dump2.csv', output, (err) => {
          if (err) throw err;
          console.log('dump2 saved')
      })
    })
  }
}


module.exports = self;