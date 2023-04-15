const express = require('express');
const cors = require('cors');
const loadRoutes = require('./route-loader');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5050;

const corsOptions = {
  origin: '*',
};

app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.json('Bello! \u{1F436}');
});

const routes = loadRoutes();
for (let route of routes) {
  app.use(route.path, route.router);
}

app.listen(port, () => {
  console.log(`mock-api listening on port ${port}`);
});
