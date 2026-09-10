import {test, expect} from '../../src/fixtures/auth.fixture'
import { API_BASE_URL } from '../../src/config/env';

test ('Dashbord API test',async ({loggedIn,page})=>{
    const response = await page.context().request.get(`${API_BASE_URL}/web/index.php/api/v2/dashboard/shortcuts`,{headers:{
        'Accept':'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
 });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('data');
    expect(body.data['leave.apply_leave']).toBe(true);
})
