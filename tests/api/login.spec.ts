import { test, expect } from '@playwright/test';
import { API_BASE_URL } from '../../src/config/env';
import { validUser } from '../../src/data/credentials';

test('Login via raw api call succeeds', async({request})=>{
    const loginPageresposnse = await request.get(`${API_BASE_URL}/web/index.php/auth/login`);
    const html = await loginPageresposnse.text();
    
    const tokenMatch = (await html).match(/:token="&quot;([^&]+)&quot;"/);
    expect (tokenMatch).not.toBeNull();
    const token = tokenMatch![1];

    const loginResponse = await request.post(`${API_BASE_URL}/web/index.php/auth/validate`,{form:{
        _token :token,
        username :validUser.username,
        password :validUser.password
    },
    maxRedirects : 0,
})
 expect(loginResponse.status()).toBe(302);
  expect(loginResponse.headers()['location']).toContain('dashboard');
})