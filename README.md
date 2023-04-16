# Mock API Server

A simple JSON request/response based mock API server.

## Getting started

Make sure you have Node.js installed. You can confirm the same by running the command `node -v`

- Clone the repository

  `git clone git@github.com:vipinbathaw/mock-api-server.git`

- Install dependencies

  `cd mock-api-server; npm install`

- Start the server

  `node index.js`

Your Mock server is up, open any of the below URLs declared in `routes/test.json` to confirm.

- `localhost:5050/test`
- `localhost:5050/test/easy`
- `localhost:5050/test/more-options`
- `localhost:5050/test/dynamic-options`

## How it works

Every JSON file in the routes directory is considered an app which will have its name as the base path for all the routes declared in the file.

To create a route just add an object with path and res fields to your app's JSON file.

`{
  "path": "/url-path",
  "res": "I am the response! 🥳"
}`

Start the server and you can access the API on `localhost:5050/app-name/url-path`

## Visuals

Screenshots to understand because visual.cognitive.speed >>>> \*

Routes defined in test.json
![alt text](https://github.com/vipinbathaw/mock-api-server/blob/main/visuals/mock-api-server-test-routes.png?raw=true)

cURL responses
![alt text](https://github.com/vipinbathaw/mock-api-server/blob/main/visuals/mock-api-server-test-outputs.png?raw=true)
