import request from 'superagent';
import async from 'async';
import fs from 'fs';

// To generate historical and store to JSON file
var symbols = require('./symbols');
var fromDate = new Date('August 13, 2015 00:00:00'); // 13th AUG 2015
var toDate = new Date('August 28, 2015 00:00:00'); // 28th AUG 2015
var padToFour = number => number <= 9999 ? ("000"+number).slice(-4) : number;
var toFixed = (num, precision) => (+(Math.round(+(num + 'e' + precision)) + 'e' + -precision)).toFixed(precision);
var historical = {}; // by date

// Parameters for yahoo query
// To date
// a = month, Jun is '0'
// b = number of day
// c = year
// From date
// d = month
// e = day
// f = year

// CSV format
// Date, Open, High, Low, Close, Volume, Adj Close

async.mapSeries(symbols, (s, cb) => {
  let symbol = padToFour(s);
  let url = `http://real-chart.finance.yahoo.com/table.csv?s=${ symbol }.HK&ignore=.csv`
  url += '&a=' + fromDate.getMonth();
  url += '&b=' + fromDate.getDate();
  url += '&c=' + (fromDate.getYear() + 1900);
  url += '&d=' + toDate.getMonth();
  url += '&e=' + toDate.getDate();
  url += '&f=' + (toDate.getYear() + 1900);

  request
    .get(url)
    .end((err, res) => {
      if (res.statusCode === 200) {
        console.log(symbol + '...');

        let lines = res.text.split('\n').splice(1); // Split to lines and remove first line
        let last = 0;
        let len = lines.length - 1;
        let line, i, cols, price, date, mySymbol, change;

        for (i = len; i >= 0; i--) { // DESC
          line = lines[i];

          if (!line.length) { continue; }

          cols = line.split(',');
          date = cols[0];
          price = parseFloat(cols[4]);
          change = 0;

          if (last) {
            change = ((price - last) / last) * 100;
            change = parseFloat(toFixed(change, 2));
          }

          mySymbol = { symbol, price, change };

          if (!historical.hasOwnProperty(date)) { historical[date] = []; }

          historical[date].push(mySymbol);
          last = price;
        }
      }
      cb();
    });
}, () => {
  var ret = JSON.stringify(historical, null, 4);
  fs.writeFileSync('./historical.json', ret, 'utf8');
});
