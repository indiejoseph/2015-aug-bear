var names = require('./stocklist');
var blues = require('./blue_chips');
var hList = require('./h_list');
var constituents = require('./constituents');

try {
  var data = require('./historical');
} catch(err) {
  console.error('Can not found historical.json, please run "npm run scrap" before analyze.');
  process.exit();
}
var toFixed = (num, precision) => (+(Math.round(+(num + 'e' + precision)) + 'e' + -precision)).toFixed(precision);
var top = {};
var getListByDate = (from, to, filters) => {
  let fromSecur = data[from];
  let toSecur = data[to];
  let all = {};

  for (let i  = 0, len = fromSecur.length; i < len; i++) {
    let f = fromSecur[i];

    // Apply filter
    if (filters && !filters.hasOwnProperty(f.symbol)) { continue; }
    if (f.symbol === '0136') { continue; }
    let t = toSecur.filter(a => a.symbol === f.symbol)[0];

    if (f && t) {
      let change = ((t.price - f.price) / f.price) * 100;
      all[f.symbol] = change;
    }
  }

  return all;
};

for (let [date, securities] of Object.entries(data)) {
  let sorted = securities.sort((a, b) => {
    return b.change - a.change;
  }); // sort by change
  let topFifteen = sorted.splice(0, 10);

  top[date] = topFifteen;
}

console.log('\n### 8月25和8月27兩日反彈期間升幅最大藍股');

var all = getListByDate('2015-08-24', '2015-08-27', blues);
var sortedUpKeys = Object.keys(all).sort((a, b) => all[b] - all[a]).splice(0, 10);

for (let key of sortedUpKeys) {
  console.log('-', key + '.HK', names[key], '(' + parseFloat(toFixed(all[key], 2)) + '%)');
}

console.log('\n### 8月25和8月27兩日反彈期間升幅最大恆指成份股');

var all = getListByDate('2015-08-24', '2015-08-27', constituents);
var sortedUpKeys = Object.keys(all).sort((a, b) => all[b] - all[a]).splice(0, 10);

for (let key of sortedUpKeys) {
  console.log('-', key + '.HK', names[key], '(' + parseFloat(toFixed(all[key], 2)) + '%)');
}

console.log('\n### 8月25和8月27兩日反彈期間升幅最大H股');

var all = getListByDate('2015-08-24', '2015-08-27', hList);
var sortedUpKeys = Object.keys(all).sort((a, b) => all[b] - all[a]).splice(0, 10);

for (let key of sortedUpKeys) {
  console.log('-', key + '.HK', names[key], '(' + parseFloat(toFixed(all[key], 2)) + '%)');
}

console.log('\n### 8月25和8月27兩日反彈期間升幅最大股票');

var all = getListByDate('2015-08-24', '2015-08-27');
var sortedUpKeys = Object.keys(all).sort((a, b) => all[b] - all[a]).splice(0, 10);

for (let key of sortedUpKeys) {
  console.log('-', key + '.HK', names[key], '(' + parseFloat(toFixed(all[key], 2)) + '%)');
}

console.log('\n### 8月25和8月27兩日反彈期間升幅最大股票');

var all = getListByDate('2015-08-24', '2015-08-27');
var sortedUpKeys = Object.keys(all).sort((a, b) => all[b] - all[a]).splice(0, 10);

for (let key of sortedUpKeys) {
  console.log('-', key + '.HK', names[key], '(' + parseFloat(toFixed(all[key], 2)) + '%)');
}

console.log('\n### 8月25日恆指輕微反彈期間升幅最大股票');

for (let s of top['2015-08-25']) {
  if (s.symbol === '0136') { continue; }
  console.log('-', s.symbol + '.HK', names[s.symbol], '(' + parseFloat(toFixed(s.change, 2)) + '%)');
}

console.log('\n### 8月27日恆指輕微反彈期間升幅最大股票');

for (let s of top['2015-08-27']) {
  if (s.symbol === '0136') { continue; }
  console.log('-', s.symbol + '.HK', names[s.symbol], '(' + parseFloat(toFixed(s.change, 2)) + '%)');
}

var all = getListByDate('2015-08-13', '2015-08-28');

// sort and get first 10 securities
var sortedUpKeys = Object.keys(all).sort((a, b) => all[b] - all[a]).splice(0, 10);
var sortedDownKeys = Object.keys(all).sort((a, b) => all[a] - all[b]).splice(0, 10);

console.log('\n### 8月13日至8月28日期間升幅最大');
for (let key of sortedUpKeys) {
  console.log('-', key + '.HK', names[key], '(' + parseFloat(toFixed(all[key], 2)) + '%)');
}

console.log('\n### 8月13日至8月28日期間跌幅最大');
for (let key of sortedDownKeys) {
  console.log('-', key + '.HK', names[key], '(' + parseFloat(toFixed(all[key], 2)) + '%)');
}
