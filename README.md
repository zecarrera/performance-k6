# performance-k6
PDT Performance testing framework using K6 and JavaScript.  
It contains API and browser page load tests.

## Setup

Installing K6:
- macOS  
    `brew install k6`

Official documentation: [k6 installation](https://grafana.com/docs/k6/latest/set-up/install-k6/)

## Running tests 

### Locally

#### API tests

**Pre-requisites:**
- MERN-Shopping app is running - [Running mern app](https://github.com/zecarrera/mern-ecommerce/tree/mot?tab=readme-ov-file#running-locally-entire-application)
  
Smoke test:

```bash
k6 run \
  --iterations 10 \
  -e MY_HOSTNAME=http://localhost:9011/api \
  ./scripts/api/products/get-product-list.js
```

Specifying number of virtual users, iterations and duration:
```
  # Run 5 VUs, splitting 10 iterations between them.
  k6 run \
  --iterations 10 \
  --vus 5 \
  -e MY_HOSTNAME=http://localhost:9011/api \
  ./scripts/api/products/get-product-list.js

  # Run 5 VUs for 10s.
  k6 run \
  --vus 5 \
  --duration 10s \
  -e MY_HOSTNAME=http://localhost:9011/api \
  ./scripts/api/products/get-product-list.js
```

#### Generating html test report

If you desire to generate an HTML report of your local test run, you can set the following environment variables:

```
K6_WEB_DASHBOARD=true 
K6_WEB_DASHBOARD_EXPORT=html-report.html
```

Example command:
```
K6_WEB_DASHBOARD=true \ 
K6_WEB_DASHBOARD_EXPORT=html-report.html \
k6 run \
--vus 5 \
--duration 30s \
-e MY_HOSTNAME=http://localhost:9011/api \
./scripts/api/products/get-product-list.js
```

#### Browser tests

k6 also supports evaluating the front-end performance. This is examplified with 2 tests:
- all-products-page.js
- home-page.js
  
Running tests locally:
```
k6 run \
-e MY_HOSTNAME=http://localhost:3000 \
./scripts/browser/all-products-page.js
```

### Pipeline

Pipeline is configure to run both API and browser tests.  

Smoke tests are running using GitHub Actions. Workflow is set to run:  
- Daily at 7AM
- On Pull requests
- Manually triggered

Tests are running against the deployed DEV instance of MERN Shop application and results are published to grafana cloud.

![Grafana screenshot](./assets/grafana.png)

When running on pull request a comment is also added with the test results.  

**API Tests**
![PR results](./assets/test-results.png)

**Browser Tests**
![PR results browser tests](./assets/test-results-2.png)


## Application under test  
Tests are written against the [MERN-ecommerce](https://github.com/zecarrera/mern-ecommerce/tree/master)