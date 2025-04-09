import http from 'k6/http';
import { check } from 'k6';
import globalThresholds from '../../../config/global-thresholds.js';

const hostname = __ENV.MY_HOSTNAME;
const email = __ENV.TEST_USER_EMAIL;
const password = __ENV.TEST_USER_PASSWORD;

export const options = {
  thresholds: {
    http_req_failed: globalThresholds.http_req_failed,
    http_req_duration: globalThresholds.http_req_duration,
  },
};

export function login() {
  if (!email) {
    throw new Error('Env variable: TEST_USER_EMAIL is not set');
  }
  if (!password) {
    throw new Error('Env variable: TEST_USER_PASSWORD is not set');
  }

  const loginUrl = `${hostname}/auth/login`;
  const loginPayload = JSON.stringify({ email, password });
  const headers = {
    'accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
  };

  const response = http.post(loginUrl, loginPayload, { headers });

  check(response, {
    'Login status is 200': (r) => r.status === 200,
  });

  if (response.status !== 200) {
    console.error(`Login failed with status: ${response.status}, response: ${response.body}`);
    return null;
  }

  const responseBody = JSON.parse(response.body);
  const token = responseBody.token;

  return { token, hostname };
}

export default function () {
  login();
}
