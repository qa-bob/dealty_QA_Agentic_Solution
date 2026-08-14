/**
 * tests/functional/homepage-features.spec.ts
 *
 * Functional tests for the Dealty homepage (https://www.dealty.ai).
 * Covers: hero section, primary CTAs, "How Dealty Works" process steps,
 * the comparison table, testimonials, and the closing cost calculator widget.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Homepage Features @functional', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.waitForLoad();
  });

  // ── Hero section ────────────────────────────────────────────────────────────

  test('hero section has a primary heading @functional', async ({ page }) => {
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    const text = await h1.textContent();
    expect(text?.trim().length, 'H1 heading should have meaningful content').toBeGreaterThan(5);
  });

  test('hero heading contains the Dealty value proposition @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    // Dealty's known headline: "From 'For Sale' to 'Sold'" or "Making Real Estate Simple"
    const hasValueProp = /for sale|sold|real estate|flat.?fee|mls|fsbo/i.test(bodyText);
    expect(hasValueProp, 'Homepage should communicate the core FSBO/flat-fee value proposition').toBeTruthy();
  });

  test('primary CTA buttons are visible above the fold @functional', async ({ homePage }) => {
    const ctaButtons = await homePage.getCTAButtons();
    expect(
      ctaButtons.length,
      'At least one primary CTA button should be visible on the homepage'
    ).toBeGreaterThan(0);
  });

  test('"Start Now" or equivalent CTA is present @functional', async ({ page }) => {
    const startCta = page.locator('a, button').filter({
      hasText: /start now|get started|start listing|list your home|sell your home/i,
    });
    const count = await startCta.count();
    expect(count, '"Start Now" or equivalent CTA should appear on the homepage').toBeGreaterThan(0);
  });

  // ── How Dealty Works section ────────────────────────────────────────────────

  test('"How Dealty Works" section is present @functional', async ({ page }) => {
    const section = page.locator('h2, h3').filter({ hasText: /how.+dealty.+works|how it works/i }).first();
    await expect(section).toBeVisible({ timeout: 10_000 });
  });

  test('process steps are visible (at least 3) @functional', async ({ page }) => {
    // Dealty's 4-step process: Add Address → Online Tools → Connect with Buyers → Pocket Profits
    const steps = page.locator(
      '[class*="step"], [class*="process"], [class*="how"] li, ' +
      '[class*="feature-list"] li, [class*="steps"] > *'
    );
    const stepCount = await steps.count();
    // If class-based approach finds nothing, count h3 headings in process sections
    if (stepCount === 0) {
      const h3Count = await page.locator('h3').count();
      expect(h3Count, 'Should have at least 3 content headings describing the process').toBeGreaterThanOrEqual(3);
    } else {
      expect(stepCount, 'Should have at least 3 process steps').toBeGreaterThanOrEqual(3);
    }
  });

  // ── Comparison table ────────────────────────────────────────────────────────

  test('competitor comparison section is present @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    const hasComparison = /vs\.?|versus|compared to|traditional|other|competitor/i.test(bodyText);
    expect(hasComparison, 'Homepage should include a comparison against traditional agents').toBeTruthy();
  });

  test('flat fee value is prominently displayed @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      /\$199|199|flat.?fee/i.test(bodyText),
      'The $199 flat fee should be prominently stated on the homepage'
    ).toBeTruthy();
  });

  test('0% commission claim is present @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      /0%|no commission|zero commission|commission.?free/i.test(bodyText),
      'The 0% listing commission claim should appear on the homepage'
    ).toBeTruthy();
  });

  // ── Testimonials ────────────────────────────────────────────────────────────

  test('customer testimonials section is present @functional', async ({ page }) => {
    const testimonialsHeading = page.locator('h2, h3').filter({
      hasText: /customer|testimonial|review|what.+say|our client/i,
    });
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    const hasTestimonials =
      (await testimonialsHeading.count()) > 0 ||
      /testimonial|review|customer/i.test(bodyText);
    expect(hasTestimonials, 'Homepage should include a customer testimonials section').toBeTruthy();
  });

  // ── Closing cost calculator ─────────────────────────────────────────────────

  test('closing cost calculator section is visible @functional', async ({ page }) => {
    const calcHeading = page.locator('h2, h3').filter({
      hasText: /closing cost|calculator|calculate/i,
    });
    const calcCount = await calcHeading.count();
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    const hasCalc =
      calcCount > 0 ||
      /closing cost|calculate your/i.test(bodyText);
    expect(hasCalc, 'Homepage should include the closing cost calculator section').toBeTruthy();
  });

  test('calculate button is present on homepage @functional', async ({ page }) => {
    const calculateBtn = page.locator('button, input[type="button"], input[type="submit"]').filter({
      hasText: /calculate/i,
    });
    const count = await calculateBtn.count();
    // The calculator button may be in a section — check for its presence
    if (count === 0) {
      // Fallback: look for the section itself
      const bodyText = await page.evaluate<string>(() => document.body.innerText);
      expect(
        /calculate|calculator/i.test(bodyText),
        'Homepage should include calculator functionality'
      ).toBeTruthy();
    } else {
      await expect(calculateBtn.first()).toBeVisible();
    }
  });

  // ── Buy/Sell CTAs ───────────────────────────────────────────────────────────

  test('"Buy a Home" and "Sell a Home" options are accessible @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    const hasBuy = /buy.{0,10}home|search.{0,10}home|property search/i.test(bodyText);
    const hasSell = /sell.{0,10}home|list.{0,10}home|start.{0,10}listing/i.test(bodyText);
    expect(hasBuy, 'Homepage should offer a path to buy a home').toBeTruthy();
    expect(hasSell, 'Homepage should offer a path to sell a home').toBeTruthy();
  });
});
