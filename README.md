# performance-k6
PDT Performance testing framework using K6 and JavaScript

## Summary
This repo contains an example ...

## Setup

Installing K6:
- macOS
    `brew install k6`

Official documentation: [k6 installation](https://grafana.com/docs/k6/latest/set-up/install-k6/)

## Running tests 

### Locally
Smoke test:

```bash
k6 run \
  --iterations 10 \
  -e MY_HOSTNAME=http://localhost:9011/api \
  ./scripts/api/products/get-product-list.js
```

### Pipeline


## Application under test  
Tests are written against the [MERN-ecommerce](https://github.com/zecarrera/mern-ecommerce/tree/master)