import http from 'k6/http';
import { check, sleep } from 'k6';
import globalThresholds from '../../../config/global-thresholds.js';
import { login } from '../login/post-login.js';
import { addProductToCart } from '../cart/post-add-product-to-cart.js';
import { addCartToOrder } from './post-add-cart-to-order.js';

export const options = {
    scenarios: {
        smoke_test_scenario: {
          executor: 'shared-iterations',
          startTime: '10s',
          gracefulStop: '5s',
          vus: 3,
          maxDuration: '5m',
        },
      },
    thresholds: {
        http_req_failed: globalThresholds.http_req_failed,
        http_req_duration: globalThresholds.http_req_duration,
    },
};

export function getOrder(hostname, token, cartId) {
    const getOrderUrl = `${hostname}/order/${cartId}`
    const headers = {
        'accept': 'application/json, text/plain, */*',
        'Authorization': token,
    };

    const response = http.get(getOrderUrl, { headers })

    check(response, {
        'Get order status is 200': (r) => r.status === 200,
    });
    let orderTotal = null;
    try {
        const responseBody = JSON.parse(response.body);
        if (response.status == 200) {
            orderTotal = responseBody.order.total;
        } else {
            console.error(`Error retrieving order: ${responseBody.message}`);
        }
    } catch (error) {
        console.error(`Response status: ${response.status}`);
        console.error(`Error parsing response: ${error}`);
    }

    sleep(1);

    return { orderTotal };
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

    const { orderId } = addCartToOrder(hostname, token, cartId);

    const { orderTotal } = getOrder(hostname, token, orderId);

    console.log(`\nOrder Submitted:\nOrderId: ${orderId}\nTotal: ${orderTotal}`);
}
