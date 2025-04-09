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
  const headers = {
    'accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'Authorization': token,
  };

  const response = http.post(addToCartUrl, addToCartPayload, { headers });

  check(response, {
    'Add to cart status is 200': (r) => r.status === 200,
  });

  let cartId = null;
  try {
    const responseBody = JSON.parse(response.body);
    if (response.status === 200) {
      cartId = responseBody.cartId;
      console.log(`Cart ID: ${cartId}`);
    } else {
      console.error(`Error adding product to cart: ${responseBody.message}`);
    }
  }
  catch (error) {
    console.error(`Response status: ${response.status}`);
    console.error(`Error parsing response: ${error}`);
  }

  sleep(1);

  return { cartId };
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

  addProductToCart(hostname, token, productDetails);
}
