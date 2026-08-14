/**
 * src/pages/pricing.page.ts
 *
 * Models the Dealty pricing plans page at /pricing-plans.
 * Dealty offers a flat $199 fee MLS listing service with no commission.
 */

import { type Page, type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import type { SiteConfig } from '@site-types/site-config.types';

export class PricingPage extends BasePage {
  readonly pricingPath = '/pricing-plans';

  // Primary page heading
  readonly heading: Locator;

  // Price display elements — the $199 flat fee
  readonly priceAmount: Locator;

  // Plan cards / pricing tiers
  readonly planCards: Locator;

  // CTA buttons on pricing cards (e.g., "Get Started", "Start Now")
  readonly ctaButtons: Locator;

  // Feature list items within plan cards
  readonly featureItems: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);

    this.heading = page.locator('h1, h2').first();

    // Dealty's flat fee — look for $199 anywhere on the page
    this.priceAmount = page.locator('text=$199').first();

    // Plan cards — common patterns used by pricing pages
    this.planCards = page.locator(
      '[class*="plan"], [class*="pricing"], [class*="card"], [class*="package"], [class*="tier"]'
    );

    // CTA buttons with purchase/start language
    this.ctaButtons = page.locator('a, button').filter({
      hasText: /get started|start now|choose|select|buy|purchase|sign up/i,
    });

    // Feature list items
    this.featureItems = page.locator(
      'ul li, [class*="feature"], [class*="benefit"]'
    );
  }

  async navigateToPricing(): Promise<void> {
    const pricingUrl = this.url.replace(/\/$/, '') + this.pricingPath;
    await this.page.goto(pricingUrl, { waitUntil: 'domcontentloaded' });
  }

  async getHeadingText(): Promise<string> {
    return (await this.heading.textContent()) ?? '';
  }

  async isPriceVisible(): Promise<boolean> {
    return this.priceAmount.isVisible();
  }

  async getPlanCount(): Promise<number> {
    return this.planCards.count();
  }

  async getCtaCount(): Promise<number> {
    return this.ctaButtons.count();
  }

  async hasFlatFeeText(): Promise<boolean> {
    const bodyText = await this.page.evaluate<string>(() => document.body.innerText);
    return /\$199|\$\s*199|flat.?fee|199/i.test(bodyText);
  }

  async hasNoCommissionText(): Promise<boolean> {
    const bodyText = await this.page.evaluate<string>(() => document.body.innerText);
    return /0%|no commission|commission.?free/i.test(bodyText);
  }
}
