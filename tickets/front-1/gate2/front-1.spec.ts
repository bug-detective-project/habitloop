import { expect, test } from '@playwright/test';
import { boxOf, cardOf, checkOf, HABITS, inside, openApp } from '../../../support/app.ts';

const SIZES = [
  ['a phone', 375, 800],
  ['a tablet', 768, 1000],
  ['a desktop', 1280, 900],
] as const;

test.describe('Ticket front-1: a long habit name stays inside its card', () => {
  for (const [device, width, height] of SIZES) {
    test(`on ${device}, the buttons of the long-named habit stay inside the card`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await openApp(page);
      const card = cardOf(page, HABITS.journal.id);
      await expect(card).toBeVisible();

      const cardBox = await boxOf(card, 'the card');
      const editBox = await boxOf(card.getByRole('button', { name: `Edit ${HABITS.journal.name}` }), 'the Edit button');
      const checkBox = await boxOf(checkOf(page, HABITS.journal), 'the done button');
      const nameBox = await boxOf(card.getByRole('heading', { level: 3 }), 'the name');

      expect(inside(editBox, cardBox), 'the Edit button must stay inside the card').toBe(true);
      expect(inside(checkBox, cardBox), 'the done button must stay inside the card').toBe(true);
      expect(inside(nameBox, cardBox), 'the name must stay inside the card').toBe(true);
    });
  }

  test('the page does not scroll sideways on a phone', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await openApp(page);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, 'pixels the page is wider than the window').toBeLessThanOrEqual(1);
  });

  test('every card has the same width, and a short name is shown whole', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await openApp(page);

    const widths = await page
      .getByRole('list', { name: 'Habits' })
      .getByRole('listitem')
      .evaluateAll((items) => items.map((item) => Math.round(item.getBoundingClientRect().width)));
    expect(new Set(widths).size, `card widths: ${widths.join(', ')}`).toBe(1);
    await expect(cardOf(page, HABITS.walk.id).getByRole('heading', { level: 3 })).toHaveText(HABITS.walk.name);
  });
});
