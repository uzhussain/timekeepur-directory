import { expect, test } from '@playwright/test'

test.describe('Guestbook moderation flow', () => {
  test.skip(
    !process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD,
    'Requires ADMIN_EMAIL and ADMIN_PASSWORD environment variables'
  )

  test('user submits and admin approves message', async ({ page }) => {
    const unique = Date.now()
    const name = `E2E User ${unique}`
    const message = `E2E moderation message ${unique}`

    await page.goto('/guestbook')
    await page.getByRole('button', { name: 'Post Message' }).click()
    await page.getByLabel('Name').fill(name)
    await page.getByLabel('Message').fill(message)
    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(
      page.getByText('Your message has been submitted and is awaiting admin approval!')
    ).toBeVisible()

    await page.goto('/admin/login')
    await page.getByLabel('Email').fill(process.env.ADMIN_EMAIL!)
    await page.getByLabel('Password').fill(process.env.ADMIN_PASSWORD!)
    await page.getByRole('button', { name: 'Sign In' }).click()

    await expect(page.getByRole('heading', { name: 'Admin' })).toBeVisible()

    const pendingMessageRow = page.locator('article').filter({ hasText: message }).first()
    await expect(pendingMessageRow).toBeVisible()
    await pendingMessageRow.getByRole('button', { name: 'Approve' }).click()

    await page.goto('/guestbook')
    await expect(page.getByText(message)).toBeVisible()
  })
})
