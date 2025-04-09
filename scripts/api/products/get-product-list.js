import http from 'k6/http';
import globalThresholds from '../../../config/global-thresholds.js';
import { check, sleep } from 'k6';

export const options = {
    thresholds: {
      http_req_failed: globalThresholds.http_req_failed,
      http_req_duration: globalThresholds.http_req_duration,
    }
}

export default function () {
    const queryParams = {
        name: 'all',
        category: 'all',
        brand: 'all',
        min: 1,
        max: 2500,
        rating: 0,
        order: 0,
        page: 1,
        limit: 10,
        sortOrder:'%7B%22_id%22:-1%7D'
    };
    
    const url = `${__ENV.MY_HOSTNAME}/product/list?name=${queryParams.name}&category=${queryParams.category}&brand=${queryParams.brand}&min=${queryParams.min}&max=${queryParams.max}&rating=${queryParams.rating}&order=${queryParams.order}&page=${queryParams.page}&limit=${queryParams.limit}&sortOrder=${queryParams.sortOrder}`;

    const headers = {
        'accept': 'application/json, text/plain, */*'
    };

    const res = http.get(url, { headers });

    check(res, {
        'Get product list status is 200': (r) => r.status === 200,
    });

    sleep(1);
}
