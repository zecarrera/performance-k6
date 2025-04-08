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

export function addCartToOrder(hostname, token, cartId, total) {
  const addOrderUrl = `${hostname}/order/add`;
  const addOrderPayload = JSON.stringify({
    cartId: cartId,
    total: total,
  });
  const addOrderHeaders = {
    'accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  const addOrderRes = http.post(addOrderUrl, addOrderPayload, { headers: addOrderHeaders });

  check(addOrderRes, {
    'Add cart to order status is 200': (r) => r.status === 200,
  });


  const responseBody = JSON.parse(addOrderRes.body);
  const orderId = responseBody.orderId;

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

  const { cartId, total } = addProductToCart(hostname, token, productDetails);

  const { orderId } = addCartToOrder(hostname, token, cartId, total);

  console.log(`Order ID: ${orderId}`);
}
