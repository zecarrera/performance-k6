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

export function addCartToOrder(hostname, token, cartId) {
    const addOrderUrl = `${hostname}/order/add`;
    const addOrderPayload = JSON.stringify({
        cartId: cartId,
        total: 999,
    });
    const headers = {
        'accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': token,
    };

    const response = http.post(addOrderUrl, addOrderPayload, { headers });

    check(response, {
        'Add cart to order status is 200': (r) => r.status === 200,
    });
    let orderId = null;
    try {
        const responseBody = JSON.parse(response.body);
        if (response.status === 200) {
            orderId = responseBody.order._id;
            console.log(`Order ID: ${orderId}`);
        } else {
            console.error(`Error adding cart to order: ${responseBody.message}`);
        }
    } catch (error) {
        console.error(`Response status: ${response.status}`);
        console.error(`Error parsing response: ${error}`);
    }

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

    addCartToOrder(hostname, token, cartId);
}
