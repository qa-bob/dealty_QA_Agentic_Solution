/**
 * tests/functional/pricing.spec.ts
 *
 * Functional tests for the Dealty pricing plans page at /pricing-plans.
 * Verifies that the $199 flat-fee offer is displayed, plan options are visible,
 * and CTAs exist — without actually starting a purchase flow.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Pricing Plans @functional', () => {
  test.beforeEach(async ({ pricingPage }) => {
    await pricingPage.navigateToPricing();
    await pricingPage.waitForLoad();
  });

  // ── Page loads ──────────────────────────────────────────────────────────────

  test('pricing page loads successfully @functional @smoke', async ({ page, siteConfig }) => {
    const response = await page.goto(
      siteConfig.url.replace(/\/$/, '') + '/pricing-plans',
      { waitUntil: 'domcontentloaded' }
    );
    expect(response).not.toBeNull();
    const status = response!.status();
    expect(
      status >= 200 && status < 400,
      `Pricing page returned HTTP ${status}`
    ).toBeTruthy();
  });

  test('pricing page has a heading @functional', async ({ pricingPage }) => {
    const heading = await pricingPage.getHeadingText();
    expect(heading.trim().length, 'Pricing page should have a non-empty heading').toBeGreaterThan(3);
  });

  // ── Flat fee content ─────────────────────────────────────────────────────────

  test('$199 flat fee is displayed on pricing page @functional', async ({ pricingPage }) => {
    const hasFlatFee = await pricingPage.hasFlatFeeText();
    expect(hasFlatFee, 'Pricing page should prominently display the $199 flat fee').toBeTruthy();
  });

  test('no commission claim is present on pricing page @functional', async ({ pricingPage }) => {
    const hasNoCommission = await pricingPage.hasNoCommissionText();
    expect(hasNoCommission, 'Pricing page should state 0% listing commission').toBeTruthy();
  });

  // ── Plan options ─────────────────────────────────────────────────────────────

  test('at least one pricing plan or package is displayed @functional', async ({ pricingPage, page }) => {
    const planCount = await pricingPage.getPlanCount();
    if (planCount === 0) {
      // Fallback: check for price-related elements by text content
      const priceVisible = await pricingPage.isPriceVisible();
      const bodyText = await page.evaluate<string>(() => document.body.innerText);
      const hasPricingContent = /plan|package|tier|\$199/i.test(bodyText);
      expect(priceVisible || hasPricingContent, 'Pricing page should display at least one plan').toBeTruthy();
    } else {
      expect(planCount, 'Should have at least one pricing plan card').toBeGreaterThanOrEqual(1);
    }
  });

  test('pricing page has CTA buttons @functional', async ({ pricingPage }) => {
    const ctaCount = await pricingPage.getCtaCount();
    expect(ctaCount, 'Pricing page should have at least one CTA button').toBeGreaterThan(0);
  });

  // ── Value propositions ───────────────────────────────────────────────────────

  test('pricing page mentions MLS listing @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      /mls|multiple listing|listed on/i.test(bodyText),
      'Pricing page should mention MLS listing service'
    ).toBeTruthy();
  });

  test('pricing page mentions no hidden fees @functional', async ({ page }) => {
    const bodyText = await page.evaluate<string>(() => document.body.innerText);
    expect(
      /no hidden|transparent|flat.?fee|no surprise/i.test(bodyText),
      'Pricing page should reinforce the no-hidden-fees value proposition'
    ).toBeTruthy();
  });
});
