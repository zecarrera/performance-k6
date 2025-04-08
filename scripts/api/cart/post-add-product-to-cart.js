import http from 'k6/http';
import { check, sleep } from 'k6';
import globalThresholds from '../../../config/global-thresholds.js';
import { login } from '../login/post-login.js';

export const options = {
  thresholds: {
    http_req_failed: globalThresholds.http_req_failed,
    http_req_duration: globalThresholds.http_req_duration,
  },
};

export function addProductToCart(hostname, token, productDetails) {
  const addToCartUrl = `${hostname}/cart/add`;
  const addToCartPayload = JSON.stringify({
    products: [productDetails],
  });
  const addToCartHeaders = {
    'accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  const addToCartRes = http.post(addToCartUrl, addToCartPayload, { headers: addToCartHeaders });

  check(addToCartRes, {
    'Add to cart status is 200': (r) => r.status === 200,
  });

  const responseBody = JSON.parse(addToCartRes.body);
  const cartId = responseBody.cartId;
  const total = responseBody.total;

  sleep(1);

  return { cartId, total };
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

  const { cartId, total } = addProductToCart(hostname, token, productDetails);

  console.log(`Cart ID: ${cartId}, Total: ${total}`);
}
