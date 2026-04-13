import { test as base } from '@playwright/test';
import type { Route } from '@playwright/test';
import dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config({ path: resolve(__dirname, '../../../.env') });

const apiUrl = process.env.API_BASE_URL;

// define what properties the mock can take
export type MockOptions = {
  status?: number;
  contentType?: string;
  headers?: Record<string, string>;
};

// define a type for the intercepted and for the mocked requests
type InterceptFixtures = {
  // take a url as a parameter and returns the type of the response OR unknown
  /**
   * Captures the response from an API call
   * @param urlPattern - URL pattern to intercept (supports wildcards)
   * @returns Promise that resolves with the parsed JSON response
   *
   * @example
   * const products = await apiInterceptor.captureResponse<Product[]>('products')
   */

  captureResponse: <T = unknown>(urlPattern: string) => Promise<T>;
  // takes a url, some data and eventually some optional extra mockOptions params for making a fake request
  /**
   * Mocks an API response with custom data
   * @param urlPattern - URL pattern to intercept
   * @param data - Mock data to return
   * @param options - Optional status code, headers, etc.
   *
   * @example
   * await apiInterceptor.mockResponse('/products', mockProducts, { status: 200 });
   * await apiInterceptor.mockResponse('/login', { error: 'Unauthorized' }, { status: 401 });
   */
  mockResponse: <T = unknown>(urlPattern: string, data: T, options?: MockOptions) => Promise<void>;
};

export const test = base.extend<InterceptFixtures>({
  captureResponse: async ({ page }, use) => {
    await use(async <T = unknown>(urlPattern: string): Promise<T> => {
      return new Promise((resolve, reject) => {
        page.route(apiUrl + urlPattern, async (route: Route) => {
          try {
            const response = await route.fetch();
            const data = await response.json();
            await route.continue();
            resolve(data as T);
          } catch (error) {
            await route.continue();
            reject(error);
          }
        });
      });
    });
  },
});

export { expect } from '@playwright/test';
