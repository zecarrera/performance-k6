export default {
    http_req_failed: ['rate<0.01'], // 99% of requests should not fail
    http_req_duration: ['p(95)<500'], // 95% of requests should be under 500ms
};
