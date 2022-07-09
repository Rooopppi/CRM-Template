import _ from 'lodash';
import cors from 'cors';
import helmet from 'helmet';
import crypto from 'crypto';
import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import expressFingerprint from 'express-fingerprint';
import slowDown from 'express-slow-down';
import { createComponentsApiRoutes, buildRoutes } from './routes/index.js';
import ServicesManager from './services/index.js';
import { GeneralError, ApiResponseService } from './shared/index.js';

const helmetMiddleware = (request, response, next) => {
  const nonce = crypto.randomBytes(16).toString('hex');
  const contentSecurityPolicyDirectives = {
    'default-src': ["'self'"],
    'base-uri': ["'self'"],
    'block-all-mixed-content': [],
    'font-src': ["'self'", 'https:', 'data:'],
    'frame-ancestors': ["'self'"],
    'img-src': ["'self'", 'data:'],
    'object-src': ["'none'"],
    'script-src': ["'self'", "'unsafe-inline'", `'nonce-${nonce}'`],
    'script-src-attr': ["'none'"],
    'style-src': ["'self'", 'https:', "'unsafe-inline'"],
    'require-trusted-types-for': ["'script'"]
  };
  request.app.nonce = nonce;
  helmet({
    contentSecurityPolicy: { directives: contentSecurityPolicyDirectives }
  })(request, response, next);
};

const injectRequestIps = (request, _response, next) => {
  const { headers } = request;
  const { 'x-forwarded-for': xForwardedFor } = headers;
  const requestIps = _.split(xForwardedFor, ',');
  request.clientIps =
    _.size(requestIps) > 1 ? _.dropRight(requestIps) : requestIps;
  next();
};

const initServices = async (request, _response, next) => {
  console.log('Initializing services...');
  await ServicesManager.startServices();
  console.log('Initializing completed');
};

const generateApiResponses = () => {
  const router = express.Router();

  router.all('*', (request, response, next) => {
    const preMadeResponse = request.preMadeResponse || {};
    const apiResponseService = new ApiResponseService(response);
    switch (preMadeResponse.type) {
      case 'json':
        return apiResponseService.responseData(preMadeResponse.responseObj);

      default:
        return apiResponseService.responseNotFound(
          'Requested route is not found'
        );
    }
  });
  return router;
};

const provideDevelopmentApiToken = async () => {
  const { queryHelper } =
    ServicesManager.getServices().DataBaseManager.getLocalConnection();
  const [developmentAdminAccount] = await queryHelper.select(
    'users',
    ['userToken'],
    { fieldName: 'id', fieldValue: 1, tableName: 'users' }
  );
  const { userToken } = developmentAdminAccount;
  console.log(`Admin development token is ${userToken}`);
};

const initRoutes = async (request, _response, next) => {
  const app = express();
  const jsonBodyParser = bodyParser.json({ limit: '50mb' });
  const urlEncodedParser = bodyParser.urlencoded({
    extended: false,
    limit: '50mb'
  });
  const apiRoutes = await createComponentsApiRoutes();
  await provideDevelopmentApiToken();

  app.set('trust proxy', true);
  app.use(slowDown({ windowMs: 60000, delayAfter: 100, delayMs: 5000 }));
  app.use(helmetMiddleware);
  app.use(expressFingerprint());
  app.use(
    cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true
    })
  );
  app.use(injectRequestIps);
  app.use(compression({ threshold: '5kb' }));
  app.use(
    '/api',
    jsonBodyParser,
    urlEncodedParser,
    buildRoutes(apiRoutes),
    generateApiResponses()
  );

  app.use(async (error, request, response, _next) => {
    const { userId, username } = request?.auth ?? {};
    const err =
      error instanceof GeneralError
        ? error
        : new GeneralError({
            message: error?.message ?? 'Unknown error',
            stack: error.stack
          });
    const errorDetails = err.getErrorDetails();
    if (err.logError) {
      err.status = errorDetails.status;
      err.extraDetails = errorDetails.extraDetails;
      err.labels = _.merge(err.labels, { userId, username });
    }

    let responseExtraDetails = {};
    if (err.constructor.name === 'ValidationError') {
      const { validationErrors, validObjectSchema } = err.extraDetails;
      responseExtraDetails = { validationErrors, validObjectSchema };
    }

    response.status(errorDetails.status || 500).json({
      success: false,
      data: {
        message: err?.displayMessage || errorDetails?.message,
        ...responseExtraDetails
      }
    });
  });

  return app;
};

const initApp = async () => {
  await initServices();
  const app = await initRoutes();

  return app;
};

export { initApp };
