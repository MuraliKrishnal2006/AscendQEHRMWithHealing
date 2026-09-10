/**
 * Shared base URL for API-level tests.
 *
 * UI tests get their host from playwright.config.ts's `baseURL` and
 * navigate with relative paths. API tests use the `request` fixture
 * directly (no baseURL applied automatically), so they need an
 * explicit host — this constant keeps that host in one place instead
 * of being hardcoded per spec file.
 *
 * AscendHRM is a self-hosted OrangeHRM deployment (same DB schema,
 * same API contract), so API and UI tests target the same origin.
 */
export const API_BASE_URL = 'https://ascendqe.org';
