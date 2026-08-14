/**
 * tests/functional/fsbo-listing.spec.ts
 *
 * Functional tests for Dealty's FSBO (For Sale By Owner) listing pages.
 * Covers: Arizona FSBO (/arizona-fsbo), Washington FSBO (/washington-fsbo),
 * location pages (/location), and property search (/buy).
 *
 * No sign-up or listing creation is attempted — these tests verify the
 * pages load and present the correct informational content.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

const FSBO_PAGES = [
  { path: '/arizona-fsbo', name: 'Arizona FSBO' },
  { path: '/washington-fsbo', name: 'Washington FSBO' },
] as const;

test.describe('FSBO Listing Pages @functional', () => {
  // ── FSBO state pages ─────────────────────────────────────────────────────────

  for (const { path, name } of FSBO_PAGES) {
    test(`${name} page loads successfully @functional`, async ({ page, siteConfig }) => {
      const response = await page.goto(
        siteConfig.url.replace(/\/$/, '') + path,
        { waitUntil: 'domcontentloaded', timeout: 15_000 }
      );
      expect(response).not.toBeNull();
      const status = response!.status();
      expect(
        status >= 200 && status < 400,
        `${name} page returned HTTP ${status}`
      ).toBeTruthy();
    });

    test(`${name} page has a heading @functional`, async ({ page, siteConfig }) => {
      await page.goto(siteConfig.url.replace(/\/$/, '') + path, {
        waitUntil: 'domcontentloaded',
        timeout: 15_000,
      });
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible({ timeout: 10_000 });
      const text = await heading.textContent();
      expect(text?.trim().length, `${name} page heading should have content`).toBeGreaterThan(3);
    });

    test(`${name} page mentions FSBO or MLS content @functional`, async ({ page, siteConfig }) => {
      await page.goto(siteConfig.url.replace(/\/$/, '') + path, {
        waitUntil: 'domcontentloaded',
        timeout: 15_000,
      });
      const bodyText = await page.evaluate<string>(() => document.body.innerText);
      const hasFsboContent = /fsbo|for sale by owner|mls|listing|flat.?fee|\$199/i.test(bodyText);
      expect(
        hasFsboContent,
        `${name} page should contain FSBO or MLS-related content`
      ).toBeTruthy();
    });
  }

  // ── Property search (/buy) ───────────────────────────────────────────────────

  test('property search page loads @functional @smoke', async ({ page, siteConfig }) => {
    const response = await page.goto(
      siteConfig.url.replace(/\/$/, '') + '/buy',
      { waitUntil: 'domcontentloaded', timeout: 15_000 }
    );
    expect(response).not.toBeNull();
    const status = response!.status();
    expect(
      status >= 200 && status < 400,
      `Property search page returned HTTP ${status}`
    ).toBeTruthy();
  });

  test('property search page has a heading or search interface @functional', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url.replace(/\/$/, '') + '/buy', {
      waitUntil: 'domcontentloaded',
      timeout: 15_000,
    });
    const heading = page.locator('h1, h2').first();
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i], input[placeholder*="address" i], input[placeholder*="city" i]').first();

    const hasHeading = (await heading.count()) > 0;
    const hasSearch = (await searchInput.count()) > 0;

    expect(
      hasHeading || hasSearch,
      'Property search page should have a heading or search input'
    ).toBeTruthy();
  });

  test('property search page mentions buying a home @functional', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url.replace(/\/$/, '') + '/buy', {
      waitUntil: 'domcontentloaded',
      timeout: 15_000,
    });
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    const hasBuyContent = /buy|search|propert|listing|home|house/i.test(bodyText);
    expect(hasBuyContent, 'Property search page should contain buying-related content').toBeTruthy();
  });

  // ── About page ───────────────────────────────────────────────────────────────

  test('About Us page loads @functional @smoke', async ({ page, siteConfig }) => {
    const response = await page.goto(
      siteConfig.url.replace(/\/$/, '') + '/about-dealty',
      { waitUntil: 'domcontentloaded', timeout: 15_000 }
    );
    expect(response).not.toBeNull();
    const status = response!.status();
    expect(
      status >= 200 && status < 400,
      `About Us page returned HTTP ${status}`
    ).toBeTruthy();
  });

  test('About Us page has company information @functional', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url.replace(/\/$/, '') + '/about-dealty', {
      waitUntil: 'domcontentloaded',
      timeout: 15_000,
    });
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      /dealty|real estate|mission|team|about/i.test(bodyText),
      'About page should contain company information'
    ).toBeTruthy();
  });
});
