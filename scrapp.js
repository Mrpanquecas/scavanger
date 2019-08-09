const scrapper = require('./domManipulator');
const scrapper2 = require('./domManipulator2');
const scrapper3 = require('./domManipulator3');

(async () => {
  const columns = {
    title: 'Title',
    oldPrice: 'Old Price',
    newPrice: 'New Price'
  }

  await scrapper2.getDom()
  const results2 = await scrapper2.parseResults()
  await scrapper2.saveResultsToCsv(results2, columns)


  await scrapper.getDom()
  const results = await scrapper.parseResults()
  await scrapper.saveResultsToCsv(results, columns)

  await scrapper3.getDom()
  const results3 = await scrapper3.parseResults()
  await scrapper3.saveResultsToCsv(results3, columns)
})()