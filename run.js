const scrapper = require('./test');
const fs = require('fs');
const stringify = require('csv-stringify');

(async () => {



  await scrapper.getDom()
  

  const results = await scrapper.parseResults()

  let columns = {
  title: 'title',
  oldPrice: 'Old Price',
  newPrice: 'New Price'
  }

  stringify(results, { header: true, delimiter: ';', columns: columns }, (err, output) => {
    if (err) throw err;
    fs.writeFile('comparison.csv', output, (err) => {
        if (err) throw err;
        console.log('csv saved.');
    });
  }); 
})()