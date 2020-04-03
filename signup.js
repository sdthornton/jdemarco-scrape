const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin())

const zips = ["06082", "23693", "20746", "19464", "55379", "46530", "40356", "48071", "74403", "53095", "19438", "93555", "32084", "14127", "44012", "60621", "10512", "38106", "50613", "57401", "58501", "85718", "07055", "06074", "07032", "53151", "27502", "34639", "29456", "71730", "34761", "27028", "24073", "37849", "01020", "48103", "20747", "27587", "60402", "78213", "18015", "26101", "07726", "55033", "10701", "85302", "10952", "12866", "33604", "22030"];
const names = [
  // "Junayd Bradford",
  //***** */ "Brenna Xiong",
  // "Stacy Mueller",
  // "Farhana Rodgers",
  // "Mayur Daniel",

  "Imani Povey",
  "Ieuan Mcintyre",
  "Alister Melia",
  "Antonina Houston",
  "Whitney Potter",

  "Murtaza Vance",
  "Krista Mcdougall",
  "Summer Rodrigues",
  "Taslima Carey",
  "Phyllis Whitfield",

  "Liyah Davison",
  "Esa Mullen",
  "Henri Landry",
  "Esmae Blair",
  "Mitchell Paul",

  "Kristen Guevara",
  "Radhika Moon",
  "Franciszek Oliver",
  "Helin Nicholls",
  "Gianluca Pearce",

  "Ed Giles",
  "Luke Solis",
  "Amie Zavala",
  "Shayan Pritchard",
  "Ksawery Lucero",

  "Ryley Reese",
  "Stefanie Velasquez",
  "Geraldine Hagan",
];

const blockedResourceTypes = [
  'image',
  'media',
  'font',
  'texttrack',
  'object',
  'beacon',
  'csp_report',
  'imageset',
];

const skippedResources = [
  'tracking.houzz',
  'linkedin',
  'adsymptotic',
  'qualtrics',
  'quantserve',
  'adzerk',
  'doubleclick',
  'adition',
  'exelator',
  'sharethrough',
  'cdn.api.twitter',
  'google-analytics',
  'googletagmanager',
  'googleads',
  'fontawesome',
  'facebook',
  'analytics',
  'optimizely',
  'clicktale',
  'mixpanel',
  'zedo',
  'clicksor',
  'tiqcdn',
];

puppeteer.launch({ headless: false }).then(async browser => {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 700, deviceScaleFactor: 2 });
  await page.setRequestInterception(true);
  await page.setDefaultNavigationTimeout(0);

  page.on('request', request => {
    const requestUrl = request._url.split('?')[0].split('#')[0];
    if (
      blockedResourceTypes.indexOf(request.resourceType()) >= 0 ||
      skippedResources.some(resource => requestUrl.indexOf(resource) >= 0)
    ) {
      return request.abort();
    }

    return request.continue();
  });

  for (let i = 0, len = names.length; i < len; i++) {
    let name = names[i];
    let email = name.replace(/\s/, '').toLowerCase() + "@gmail.com";
    let firstName = name.split(/\s/)[0];
    let lastName = name.split(/\s/)[1];
    let zip = zips[Math.floor(Math.random() * names.length)];
    let ageVal = [1,2,3,4,5,6][Math.floor(Math.random() * 6)];

    await page.goto('https://www.houzz.com/signup/');
    await page.type('input[type="email"]', email);
    await page.type('input[type="password"]', "Testing!23");
    await page.waitForNavigation();

    await page.waitForNavigation();

    await page.type('input#firstName', firstName);
    await page.type('input#lastName', lastName);
    await page.type('input#zipCode', zip);
    await page.select('input[name="ageRange"]', ageVal);

    await page.waitForNavigation();
    await page.waitForNavigation();
  }

  await browser.close();
});
