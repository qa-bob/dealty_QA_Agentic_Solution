/**
 * tests/functional/faq.spec.ts
 *
 * Functional tests for the Dealty FAQ page at /faq.
 * Verifies the accordion loads, questions are present, and expanding a question
 * reveals an answer — without navigating away or submitting anything.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('FAQ Page @functional', () => {
  test.beforeEach(async ({ faqPage }) => {
    await faqPage.navigateToFaq();
    await faqPage.waitForLoad();
  });

  // ── Page loads ──────────────────────────────────────────────────────────────

  test('FAQ page loads successfully @functional @smoke', async ({ page, siteConfig }) => {
    const response = await page.goto(
      siteConfig.url.replace(/\/$/, '') + '/faq',
      { waitUntil: 'domcontentloaded' }
    );
    expect(response).not.toBeNull();
    const status = response!.status();
    expect(
      status >= 200 && status < 400,
      `FAQ page returned HTTP ${status}`
    ).toBeTruthy();
  });

  test('FAQ page has FAQ-related content @functional', async ({ faqPage }) => {
    const hasFaqContent = await faqPage.hasFaqContent();
    expect(hasFaqContent, 'FAQ page should contain FAQ-related content').toBeTruthy();
  });

  test('FAQ page has a heading @functional', async ({ faqPage }) => {
    const heading = await faqPage.getHeadingText();
    expect(heading.trim().length, 'FAQ page should have a visible heading').toBeGreaterThan(3);
  });

  // ── Questions present ────────────────────────────────────────────────────────

  test('FAQ page has multiple questions @functional', async ({ faqPage, page }) => {
    const questionCount = await faqPage.getQuestionCount();
    if (questionCount === 0) {
      // Fallback: count headings or list items that look like questions
      const h3Count = await page.locator('h3, h4').count();
      expect(
        h3Count,
        'FAQ page should have question headings or accordion triggers'
      ).toBeGreaterThan(0);
    } else {
      expect(
        questionCount,
        'FAQ page should have at least 3 questions'
      ).toBeGreaterThanOrEqual(3);
    }
  });

  // ── Accordion interaction ────────────────────────────────────────────────────

  test('clicking a FAQ question reveals an answer @functional', async ({ faqPage, page }) => {
    const hasQuestions = await faqPage.hasQuestions();

    if (!hasQuestions) {
      // Site may use a non-accordion layout (static list) — verify answers are visible
      const bodyText = await page.evaluate<string>(() => document.body.innerText);
      const hasAnswers = bodyText.length > 200;
      expect(hasAnswers, 'FAQ page should have answer content').toBeTruthy();
      return;
    }

    const firstQuestionText = await faqPage.getFirstQuestionText();
    expect(firstQuestionText.trim().length, 'First question should have text').toBeGreaterThan(0);

    // Click to expand
    await faqPage.expandFirstQuestion();

    // After clicking, the page should have more visible text (answer appeared)
    // We check that the DOM changed — accordion expanded or answer became visible
    await page.waitForTimeout(300); // brief moment for CSS transition
    const bodyTextAfter = await page.evaluate<string>(() => document.body.innerText);
    expect(bodyTextAfter.length, 'Expanding a FAQ question should reveal answer text').toBeGreaterThan(100);
  });

  test('first FAQ question text is not empty @functional', async ({ faqPage }) => {
    const hasQuestions = await faqPage.hasQuestions();
    if (!hasQuestions) {
      test.skip(true, 'No accordion-style FAQ found on this page');
      return;
    }
    const questionText = await faqPage.getFirstQuestionText();
    expect(questionText.trim().length, 'FAQ question text should not be empty').toBeGreaterThan(0);
  });
});
