import { test, expect } from '@playwright/test';

test.describe('Surplus Platform E2E', () => {
  
  test.beforeEach(async ({ page }) => {
    // Go to the landing page before each test
    await page.goto('http://localhost:3000/');
  });

  test('should navigate to login page from landing page', async ({ page }) => {
    // Click the "Log in" link
    await page.click('text=Log in');
    
    // Check if the URL changed to /login
    await expect(page).toHaveURL(/.*login/);
    
    // Verify the login page renders correctly
    await expect(page.locator('text=Welcome back')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });

  test('should toggle to sign up mode', async ({ page }) => {
    await page.goto('http://localhost:3000/login');

    // Click the toggle button to switch to signup
    await page.click('text=Don\'t have an account? Sign up');
    
    // Check if it switched successfully
    await expect(page.locator('text=Join the mission')).toBeVisible();
    await expect(page.locator('text=Create Account')).toBeVisible();
    await expect(page.locator('text=Full Name')).toBeVisible();
  });

  test('should render RBAC access denied for unauthenticated users', async ({ page }) => {
    // Attempt to access donor dashboard directly
    await page.goto('http://localhost:3000/donor');
    
    // The RBAC Guard should redirect to /login
    await expect(page).toHaveURL(/.*login/);
  });

});
