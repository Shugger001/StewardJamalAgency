import { expect, test } from "@playwright/test";

test.describe("public interaction smoke tests", () => {
  test("site nav links update hash targets", async ({ page }) => {
    await page.goto("/site");

    await page.getByRole("link", { name: "Pricing" }).click();
    await expect(page).toHaveURL(/\/site#pricing$/);

    await page.getByRole("link", { name: "Proposal" }).click();
    await expect(page).toHaveURL(/\/site#proposal$/);
  });

  test("pricing tier buttons toggle URL query", async ({ page }) => {
    await page.goto("/site#pricing");
    await page.waitForLoadState("domcontentloaded");

    await page.getByRole("button", { name: "Priority" }).last().click();
    await expect(page).toHaveURL(/\/site\?tier=priority#pricing$/);

    await page.getByRole("button", { name: "Standard" }).last().click();
    await expect(page).toHaveURL(/\/site#pricing$/);
  });

  test("payment method buttons are selectable", async ({ page }) => {
    await page.goto("/site#services");

    const checkoutCard = page.locator("article", { hasText: "Payments-ready checkout" });
    await checkoutCard.scrollIntoViewIfNeeded();

    const cardButton = checkoutCard.getByRole("button", {
      name: "Card Payment (Visa, Mastercard)",
    });
    const momoButton = checkoutCard.getByRole("button", {
      name: "Mobile Money (MTN, Telecel, AT)",
    });

    await cardButton.click();
    await expect(cardButton).toHaveClass(/text-white/);

    await momoButton.click();
    await expect(momoButton).toHaveClass(/text-white/);
  });
});

test.describe("auth entry point smoke tests", () => {
  test("login page routes to sign up and home", async ({ page }) => {
    await page.goto("/login");

    await page.locator('a[href="/signup"]').first().click();
    await expect(page).toHaveURL(/\/signup$/);

    await page.locator('a[href="/"]').first().click();
    await expect(page).toHaveURL(/\/$/);
  });
});
