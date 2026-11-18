import { expect, test } from '@playwright/test';
import { cardOf, checkOf, habitNamed, HABITS, openApp, setDay, TODAY } from '../../../support/app.ts';

test.describe('Ticket front-4: Edit opens the form and nothing else', () => {
  test('opening the form of a habit that is not done does not mark it', async ({ page, request }) => {
    await setDay(request, HABITS.stretch.id, TODAY, false);
    await openApp(page);

    await page.getByRole('button', { name: `Edit ${HABITS.stretch.name}` }).click();
    await expect(page.getByRole('form', { name: `Edit ${HABITS.stretch.name}` })).toBeVisible();
    await page.getByRole('button', { name: 'Cancel' }).click();

    await expect(checkOf(page, HABITS.stretch)).toHaveAttribute('aria-pressed', 'false');
    expect((await habitNamed(request, HABITS.stretch.name)).days, 'the days of the habit in the API').not.toContain(TODAY);
  });

  test('opening the form of a habit that is done does not unmark it', async ({ page, request }) => {
    await setDay(request, HABITS.water.id, TODAY, true);
    await openApp(page);

    await page.getByRole('button', { name: `Edit ${HABITS.water.name}` }).click();
    await expect(page.getByRole('form', { name: `Edit ${HABITS.water.name}` })).toBeVisible();
    await page.getByRole('button', { name: 'Cancel' }).click();

    await expect(checkOf(page, HABITS.water)).toHaveAttribute('aria-pressed', 'true');
    expect((await habitNamed(request, HABITS.water.name)).days, 'the days of the habit in the API').toContain(TODAY);
  });

  test('saving a new name changes the name only', async ({ page, request }) => {
    await setDay(request, HABITS.friend.id, TODAY, false);
    await openApp(page);

    await page.getByRole('button', { name: `Edit ${HABITS.friend.name}` }).click();
    const form = page.getByRole('form', { name: `Edit ${HABITS.friend.name}` });
    await form.getByLabel('Name').fill('Call a friend or a cousin');
    await form.getByRole('button', { name: 'Save' }).click();

    await expect(cardOf(page, HABITS.friend.id).getByRole('heading', { level: 3 })).toHaveText('Call a friend or a cousin');
    expect((await habitNamed(request, 'Call a friend or a cousin')).days).not.toContain(TODAY);
  });

  test('a click on the card still marks the habit', async ({ page, request }) => {
    await setDay(request, HABITS.sugar.id, TODAY, false);
    await openApp(page);

    await cardOf(page, HABITS.sugar.id).getByRole('heading', { level: 3 }).click();

    await expect(checkOf(page, HABITS.sugar)).toHaveAttribute('aria-pressed', 'true');
    await expect.poll(async () => (await habitNamed(request, HABITS.sugar.name)).days).toContain(TODAY);
  });
});
