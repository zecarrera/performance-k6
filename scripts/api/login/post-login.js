import http from 'k6/http';
import { check } from 'k6';
import globalThresholds from '../../../config/global-thresholds.js';

const hostname = __ENV.MY_HOSTNAME;
const email = __ENV.USER_EMAIL || 'reta_kuhic@putsbox.com';
const password = __ENV.USER_PASSWORD || '123456';

export const options = {
  thresholds: {
    http_req_failed: globalThresholds.http_req_failed,
    http_req_duration: globalThresholds.http_req_duration,
  },
};

export function login() {
  const loginUrl = `${hostname}/auth/login`;
  const loginPayload = JSON.stringify({ email: email, password: password });
  const loginHeaders = {
    'accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
  };

  const loginRes = http.post(loginUrl, loginPayload, { headers: loginHeaders });

  check(loginRes, {
    'Login status is 200': (r) => r.status === 200,
  });

  if (loginRes.status !== 200) {
    console.error(`Login failed with status: ${loginRes.status}, response: ${loginRes.body}`);
    return null;
  }

  const responseBody = JSON.parse(loginRes.body);
  const token = responseBody.token;

  return { token, hostname };
}

export default function () {
  login();
}
