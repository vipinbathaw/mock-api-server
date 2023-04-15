const fs = require('fs');
const path = require('path');
const express = require('express');

const urlRegex = /^\/[a-zA-Z0-9\-._~%!$&'()*+,;=:@/]*$/;
const supportedReqMethods = ['get'];
const responseTypes = ['static'];

const loadRoutes = () => {
  let error;
  let files = [];
  let routes = [];

  const routeDir = path.join(__dirname, process.env.ROUTES_DIR || 'routes');
  try {
    files = fs.readdirSync(routeDir);
  } catch (e) {
    error = e;
  }

  for (let file of files) {
    let appName = file;

    try {
      let parts = appName.split('.');
      appName = parts.slice(0, parts.length - 1).join('');
    } catch (e) {
      console.error(`Failed to clean app name ${file}`);
      continue;
    }

    if (!urlRegex.test('/' + appName)) {
      console.error(
        `Invalid app name ${appName}. Should be a valid URL Path and being with /`
      );
      continue;
    }

    let router = loadAppRoutes(path.join(routeDir, file));
    routes.push({ path: '/' + appName, router });
  }

  if (error) {
    console.error(`Error reading routes dir (${routeDir}): ${error.message}`);
  }

  return routes;
};

const loadAppRoutes = (defPath) => {
  let error;
  let content;

  try {
    content = fs.readFileSync(defPath);
  } catch (e) {
    error = e;
  }

  if (!error) {
    try {
      content = JSON.parse(content);
    } catch (e) {
      error = e;
    }
  }

  if (!Array.isArray(content)) {
    error = new Error(
      `Invalid api-def json, should have array as root element.`
    );
  }

  let router = express.Router();

  for (let route of content) {
    router = generateHandler(route, router);
  }

  if (error) {
    console.error(`Error loading app route (${defPath}): ${error.message}`);
  }

  return router;
};

const generateHandler = (route, router) => {
  let error;
  let method;
  let resType;
  let resp;

  const path = route.path;
  if (!path || !urlRegex.test(path)) {
    error = new Error(
      `Invalid path field, missing or not a valid URL path, should begin with a /`
    );
  }

  if (!error) {
    method = getMethod(route);
    resType = getResponseType(route);
    resp = generateResponse(resType, route);
  }

  if (!error) {
    const handler = (req, res) => {
      res.json(resp);
    };

    if (method === 'get') {
      router.get(path, handler);
    }
  }

  if (error) {
    console.error(`Error in handler generator: ${error.message}`);
  }

  return router;
};

const getMethod = (route) => {
  let method = 'get';

  if (route.req && route.req.method) {
    const m = route.req.method;
    if (!supportedReqMethods.includes(m.toLowerCase())) {
      console.error(
        `Unsupported request method ${m}. Currently support ${supportedReqMethods.join(
          ', '
        )}`
      );
    } else {
      method = route.req.method.toLowerCase();
    }
  } else {
    console.info(`Using default method '${method}' for ${route.path}`);
  }

  return method;
};

const getResponseType = (route) => {
  let resType = 'static';

  if (route.res && route.res.type) {
    const t = route.res.type;
    if (!responseTypes.includes(t)) {
      console.error(
        `Unsupported response type ${t}. Valid options are ${responseTypes.join(
          ', '
        )}`
      );
    } else {
      resType = route.res.type;
    }
  } else {
    console.info(`Using default response type 'static' for ${route.path}`);
  }

  return resType;
};

const generateResponse = (resType, route) => {
  let resp;

  if (resType == 'static') {
    try {
      if (route.res.body) {
        resp = route.res.body;
      } else {
        resp = route.res;
      }
    } catch (e) {
      resp = 'Kanpai! 🙌';
      console.info(`Using default body '${resp}' for ${route.path}`);
    }
  }

  if (typeof resp !== 'object') {
    resp = {
      message: resp,
    };
  }

  return resp;
};

module.exports = loadRoutes;
