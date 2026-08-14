/**
 * src/pages/faq.page.ts
 *
 * Models the Dealty FAQ page at /faq.
 * Tests the accordion-style Q&A without navigating away.
 */

import { type Page, type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import type { SiteConfig } from '@site-types/site-config.types';

export class FaqPage extends BasePage {
  readonly faqPath = '/faq';

  readonly heading: Locator;

  // FAQ question triggers — accordions are typically <button>, <summary>, or a clickable heading
  readonly questionTriggers: Locator;

  // FAQ answer panels — the content revealed after expanding a question
  readonly answerPanels: Locator;

  // The first question trigger for single-item interaction tests
  readonly firstQuestion: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);

    this.heading = page.locator('h1, h2').first();

    // Accordion triggers — covers details/summary HTML and ARIA-based patterns
    this.questionTriggers = page.locator(
      'details summary, ' +
      '[aria-expanded], ' +
      '[class*="accordion"] button, ' +
      '[class*="faq"] button, ' +
      '[class*="question"]'
    );

    // Answer panels — the hidden/revealed content
    this.answerPanels = page.locator(
      'details > *:not(summary), ' +
      '[class*="answer"], ' +
      '[class*="panel"], ' +
      '[class*="content"][aria-hidden]'
    );

    this.firstQuestion = this.questionTriggers.first();
  }

  async navigateToFaq(): Promise<void> {
    const faqUrl = this.url.replace(/\/$/, '') + this.faqPath;
    await this.page.goto(faqUrl, { waitUntil: 'domcontentloaded' });
  }

  async getHeadingText(): Promise<string> {
    return (await this.heading.textContent()) ?? '';
  }

  async getQuestionCount(): Promise<number> {
    return this.questionTriggers.count();
  }

  async hasQuestions(): Promise<boolean> {
    return (await this.questionTriggers.count()) > 0;
  }

  /** Click the first FAQ question to expand it. */
  async expandFirstQuestion(): Promise<void> {
    await this.firstQuestion.click();
  }

  /** Read the text of the first question trigger. */
  async getFirstQuestionText(): Promise<string> {
    return (await this.firstQuestion.textContent()) ?? '';
  }

  /** Return true if the page body contains FAQ-related content keywords. */
  async hasFaqContent(): Promise<boolean> {
    const bodyText = await this.page.evaluate<string>(() => document.body.innerText);
    return /frequently asked|faq|question|answer/i.test(bodyText);
  }
}
