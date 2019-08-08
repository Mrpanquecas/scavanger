const puppeteer = require('puppeteer');

const self = {
  browser: null,
  page: null,

  getDom: async () => {
    self.browser = await puppeteer.launch({headless: false, slowMo: 350})
    self.page = await self.browser.newPage()
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
      const title = await prod.$eval(('h3[class=product-title] > a'), node => node.innerText)
      const oldPrice = await prod.$eval(('span[class=price] > del'), node => node.innerText)
      const newPrice = await prod.$eval(('span[class=price] > ins'), node => node.innerText)
      payload.push({
        title,
        oldPrice,
        newPrice
      })
    }
    await self.browser.close()
    return payload
  }
}


module.exports = self;