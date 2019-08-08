const puppeteer = require('puppeteer')
const fs = require('fs')
const express = require('express')


(async () => {
  const browser = await puppeteer.launch({headless: false, slowMo: 350})
  const page = await browser.newPage()
  await page.goto('https://hey-phones.com/categoria-produto/iphone/')
  const selectorForLoadMoreButton = '.load-on-click'
  let visible = true;
  const isElementVisible = async (page, selector) => {
    await page
        .waitForSelector(selector, { visible: true, timeout: 5000 })
        .catch(() => {
          visible = false;
        });
      return visible;
  }
  let loadMoreVisible = await isElementVisible(page, selectorForLoadMoreButton);
''
  while (loadMoreVisible) {
    await page
      .click(selectorForLoadMoreButton)
      .catch(() => {});
    loadMoreVisible = await isElementVisible(page, selectorForLoadMoreButton);
  }

  const arrayOfProducts = await page.evaluate(() => {
    const prods = Array.from(document.querySelectorAll('.product-info'))
    return prods.map(prod => prod.innerText)
  })



  fs.writeFile("./pics/test.html", arrayOfProducts, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
}); 
  console.log(arrayOfProducts)

  await page.screenshot({path: 'example.png', fullPage: true})

  await browser.close()
})()
