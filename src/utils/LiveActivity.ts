import { Page } from '@playwright/test';

const OVERLAY_ID = 'playwright-live-activity';

/**
 * Displays the current business-level test action
 * directly inside the application browser.
 */
export async function showAction(
  page: Page,
  message: string
): Promise<void> {

  try {

    await page.evaluate((message) => {

      const createOverlay = (): HTMLDivElement => {

        let overlay = document.getElementById(
          'playwright-live-activity'
        ) as HTMLDivElement | null;

        if (!overlay) {

          overlay = document.createElement('div');

          overlay.id = 'playwright-live-activity';

          Object.assign(overlay.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',

            zIndex: '2147483647',

            backgroundColor: '#1f2937',
            color: '#ffffff',

            padding: '15px 20px',

            borderRadius: '8px',

            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            fontWeight: 'bold',

            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',

            minWidth: '300px',
            maxWidth: '500px',

            pointerEvents: 'none',

            display: 'block',
            visibility: 'visible',
            opacity: '1'
          });

          document.body.appendChild(overlay);
        }

        return overlay;
      };

      const overlay = createOverlay();

      overlay.textContent = `▶ ${message}`;

    }, message);

  } catch (error) {

    const errorMessage =
      error instanceof Error
        ? error.message
        : String(error);

    console.log(
      `[LiveActivity] ${errorMessage}`
    );
  }
}