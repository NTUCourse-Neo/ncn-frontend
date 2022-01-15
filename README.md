# ncn-frontend
The frontend of NTUCourse Neo.


[![GitHub branches](https://badgen.net/github/branches/NTUCourse-Neo/ncn-frontend)](https://github.com/NTUCourse-Neo/ncn-backend)
[![GitHub branches](https://badgen.net/github/merged-prs/NTUCourse-Neo/ncn-frontend)](https://github.com/NTUCourse-Neo/ncn-backend)
[![GitHub branches](https://badgen.net/github/commits/NTUCourse-Neo/ncn-frontend)](https://github.com/NTUCourse-Neo/ncn-backend)
[![GitHub branches](https://badgen.net/github/last-commit/NTUCourse-Neo/ncn-frontend)](https://github.com/NTUCourse-Neo/ncn-backend)

[![GitHub branches](https://github.com/NTUCourse-Neo/ncn-frontend/actions/workflows/azure-static-web-apps-gray-river-017c6bf1e.yml/badge.svg)](https://github.com/NTUCourse-Neo/ncn-frontend/actions/workflows/azure-static-web-apps-gray-river-017c6bf1e.yml)
[![Better Uptime Badge](https://betteruptime.com/status-badges/v1/monitor/bqbv.svg)](https://betteruptime.com/?utm_source=status_badge)

## 🛠 Deployment

### 🐋 Docker (Recommended)

1. Clone the repository
    ```bash
    git clone https://github.com/NTUCourse-Neo/ncn-frontend.git
    cd ncn-frontend
    ```
2. Prepare your `.env` file
    
    Run command below to create a `.env` file
    ```bash
    cp .env.defaults .env
    ```
    Then paste your keys into the file. Please refer to the guide below.    
    | KEY                            | Description                                       | Default Value              |
    | ------------------------------ | ------------------------------------------------- | -------------------------- |
    | REACT_APP_API_ENDPOINT         | Backend API Endpoint URL                          | http://localhost:5000/api/ |
    | REACT_APP_API_VERSION          | Backend API Endpoint Version                      | v1                         |
    | REACT_APP_AUTH0_DOMAIN         | Auth0 Domain                                      | N/A                        |
    | REACT_APP_AUTH0_CLIENT_ID      | Auth0 Single Page Application Client ID           | N/A                        |
    | REACT_APP_SELF_API_AUDIENCE    | NTUCourse-Neo API Identifier                      | N/A                        |
    | REACT_APP_RECAPTCHA_CLIENT_KEY | reCAPTCHA Service Client Key                      | N/A                        |
    | REACT_APP_GA_TRACKING_ID       | Google Analytics Tracking ID (Started with `UA-`) | N/A                        |

  
1. Install Docker on your device.
   
   Please refer to this [guide](https://docs.docker.com/engine/install/).

2. Build docker image
    ```bash
    docker build -f Dockerfile -t ncn-frontend .
    ```

3. Run the built image in container
    ```bash
    docker run -d --env-file .env -p 3000:3000 ncn-frontend
    ```

5. Open the browser and go to `http://localhost:3000/`
   
  and you should see the website running.
6. Have fun! 🎉
### 💻 Run in local
1. Clone the repository
    ```bash
    git clone https://github.com/NTUCourse-Neo/ncn-frontend.git
    cd ncn-frontend
    ```
2. Prepare your `.env` file
    
    Run command below to create a `.env` file
    ```bash
    cp .env.defaults .env
    ```
    Then paste your keys into the file. Please refer to the guide below.    
    | KEY                            | Description                                       | Default Value              |
    | ------------------------------ | ------------------------------------------------- | -------------------------- |
    | REACT_APP_API_ENDPOINT         | Backend API Endpoint URL                          | http://localhost:5000/api/ |
    | REACT_APP_API_VERSION          | Backend API Endpoint Version                      | v1                         |
    | REACT_APP_AUTH0_DOMAIN         | Auth0 Domain                                      |                            |
    | REACT_APP_AUTH0_CLIENT_ID      | Auth0 Single Page Application Client ID           |                            |
    | REACT_APP_SELF_API_AUDIENCE    | NTUCourse-Neo API Identifier                      |                            |
    | REACT_APP_RECAPTCHA_CLIENT_KEY | reCAPTCHA Service Client Key                      |                            |
    | REACT_APP_GA_TRACKING_ID       | Google Analytics Tracking ID (Started with `UA-`) |                            |

  
3. Install required dependencies
    ```bash
    yarn
    ```

4. Run the server
    ```bash
    yarn start
    ```
5. Open the browser and go to `http://localhost:3000/`
   
   and you should see the website running.
6. Have fun! 🎉



## 📦 Packages
- babel
- dotenv-defaults
- chakra-ui/react
- react-icons
- react-router-dom
- Redux
- axios
- react-ga
- array-move
- react-sortable-hoc
- auth0-react
- react-spinners
- react-table-drag-select
- react-scroll
- react-focus-lock
- react-google-recaptcha
- react-countdown-hook
- color-hash
- randomcolor
