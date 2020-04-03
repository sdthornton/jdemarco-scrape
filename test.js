const puppeteer = require('puppeteer');
const randomWords = require('random-words');
const { PendingXHR } = require('pending-xhr-puppeteer');

const ideabookName =
  randomWords({
    exactly: 1,
    formatter: word => {
      return word.slice(0,1).toUpperCase().concat(word.slice(1)) + " Inspiration";
    },
  })[0];

async function getPic() {
  const browser = await puppeteer.launch({
    headless: false,
  });

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

  const page = await browser.newPage();
  const pendingXHR = new PendingXHR(page);

  await page.setViewport({ width: 1440, height: 700, deviceScaleFactor: 2 });
  await page.setRequestInterception(true);

  /* Sign In */
  await page.goto('https://www.houzz.com/signin/');
  await page.type('input[type="email"]', "testingapps12345@gmail.com");
  await page.type('input[type="password"]', "Testing!23");
  await page.click('input[type="submit"]');
  await page.waitForNavigation();

  /* Create a new Ideabook */
  await page.goto('https://www.houzz.com/user/webuser-90314160');
  await page.waitForSelector('.hz-user-ideabooks__create-btn', { visible: true });
  await page.waitFor(2000);
  await page.click('.hz-user-ideabooks__create-btn');
  await page.waitFor(2000);
  await page.type('.hz-char-count-input__input', ideabookName);
  await page.type('.hz-edit-universal-gallery__textarea', "Some of my favorites.");
  await page.waitFor(2000);
  await page.click('.hz-edit-universal-gallery__footer-btns .btn-primary');
  await page.waitFor(2000);

  /* Visit Jerry's French Country proejct */
  await page.goto('https://www.houzz.com/hznb/projects/french-country-project-pj-vj~5777432');
  const saveButtons = await page.$$('.save-button');

  await page.evaluate(() => {
    const edgeDialog = document.querySelector('#edgeContactDialogContainer');
    if (edgeDialog) {
      edgeDialog.remove();
    }
  });

  let num = 0;
  for (saveButton of saveButtons) {
    num += 1;
    console.log(num);
    await saveButton.click();
    await pendingXHR.waitForAllXhrFinished();
    await page.waitForSelector('#save-to-universal-gallery', { visible: true });
    await page.waitForSelector('.btn-primary.hz-save-to-universal-gallery__footer-btn', { visible: true });
    await page.click('.btn.btn-primary.hz-save-to-universal-gallery__footer-btn');
    await pendingXHR.waitForAllXhrFinished();
    await page.keyboard.press('Escape');
  }

  // Close it up
  await browser.close();
}

getPic();


// Ensure modal gets closed
// try {
//   await page.waitForSelector('#save-to-universal-gallery', { visible: false });
// } catch (err) {
//   // Start by assuming it's the bookmarklet modal
//   try {
//     await page.click('.hz-extension-upsell-dialog__footer-cancel');
//   } catch (err) {
//     await page.click('[data-compid="hzj_send_share_ideabook_cancel"]');
//   }
// }
