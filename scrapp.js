const scrapper = require('./domManipulator');

(async () => {

  const columns = {
    title: 'title',
    oldPrice: 'Old Price',
    newPrice: 'New Price'
  }


  await scrapper.getDom()

  const results = await scrapper.parseResults()

  await scrapper.saveResultsToCsv(results, columns)
})()