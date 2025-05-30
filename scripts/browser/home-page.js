import { browser } from 'k6/browser';
const hostname = __ENV.MY_BROWSER_HOSTNAME;

export const options = {
  scenarios: {
    ui: {
      executor: 'shared-iterations',
      options: {
        browser: {
          type: 'chromium',
        },
      },
    },
  },
  thresholds: {
    checks: ['rate==1.0'], // All checks succeed (100% success rate)
    browser_web_vital_lcp: ['p(90) < 3000'], //For 90% of the simulated users, the largest content element on the page loads in under 3 seconds.
  },
};

export default async function () {
  const page = await browser.newPage();

  try {
    await page.goto(hostname);
    await page.waitForSelector('h1');
    await page.screenshot({ path: 'screenshots/home-page.png' });
  } finally {
    await page.close();
  }
}