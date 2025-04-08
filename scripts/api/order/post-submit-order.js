import http from 'k6/http';
import { check, sleep } from 'k6';
import globalThresholds from '../../../config/global-thresholds.js';
import { login } from '../login/post-login.js';
import { addProductToCart } from '../cart/post-add-product-to-cart.js';

export const options = {
  thresholds: {
    http_req_failed: globalThresholds.http_req_failed,
    http_req_duration: globalThresholds.http_req_duration,
  },
};
export function submitOrder(hostname, token, cartId) {
  const submitOrderUrl = `${hostname}/order/${cartId}`
  const submitOrderHeaders = {
    'accept': 'application/json, text/plain, */*',
    'Authorization': `Bearer ${token}`,
  };

  const submitOrderRes = http.post(submitOrderUrl, null, { headers: submitOrderHeaders })

  check(submitOrderRes, {
    'Submit order status is 200': (r) => r.status === 200,
  });

  const responseBody = JSON.parse(submitOrderRes.body);
  const orderId = responseBody.orderId

  sleep(1);

  return { orderId };
}

export function setup() {
    const { token, hostname } = login();

    if (!token) {
      throw new Error('Login failed during setup');
    }
  
    return { token, hostname };
}

export default function (data) {
  const { token, hostname } = data;

  const productDetails = {
    quantity: 1,
    price: 312,
    taxable: false,
    product: '67aa25a7fd92fdf1b564824f',
  };

  const { cartId } = addProductToCart(hostname, token, productDetails);

  const { orderId } = submitOrder(hostname, token, cartId);

  console.log(`Order ID: ${orderId}`);
}
