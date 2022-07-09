import _ from 'lodash';
import express from 'express';
import jwt from 'jsonwebtoken';
import ServicesManager from '../services/index.js';
import ApiResponseService from '../shared/response.js';
import permissionsService from '../services/permissionsService/permissionsService.js';
import Users from '../components/users/component.js';

const getRequestToken = async (request, apiResponseService) => {
  const { authorization } = request.headers;
  const token = authorization && authorization.split(' ')[1];

  if (!token) {
    return apiResponseService.responseNoAccess(
      "You have'nt supplied any API token to request"
    );
  }

  await jwt.verify(token, process.env.TOKEN_SECRET, async (_err, userToken) => {
    request.expiredToken = _.isUndefined(userToken);

    const tokenOnDb = await new Users().findBy({
      fields: ['userToken'],
      where: { fieldName: 'userToken', fieldValue: token, tableName: 'users' }
    });

    request.tokenExists = _.size(tokenOnDb) > 0;

    if (request.expiredToken || !request.tokenExists) {
      return;
    }
    request.user = userToken || null;
  });
};

const functionWrapper = (
  componentName,
  publicFunctions,
  controllerFunction
) => {
  return async (request, response, next) => {
    const apiResponseService = new ApiResponseService(response);
    const requestedFunctionName = controllerFunction.name;
    const isPublicFunctionRequested = _.includes(
      publicFunctions,
      requestedFunctionName
    );

    if (!isPublicFunctionRequested) {
      await getRequestToken(request, apiResponseService);
    }

    if (request.expiredToken) {
      return apiResponseService.responseNoAccess('Your token has been expired');
    }

    if (!isPublicFunctionRequested) {
      if (!request.user) {
        return apiResponseService.responseNoAccess(
          'You dont have access to this function or component'
        );
      }

      // PERMISSIONS

      const { group } = request.user;
      request.user.permissions =
        await permissionsService.getPermissionsByGroupId(group);

      if (
        !_.includes(
          request.user.permissions?.[`${componentName}`],
          requestedFunctionName
        )
      ) {
        return apiResponseService.responseNoAccess(
          'You dont have access to this function or component'
        );
      }
    }
    await controllerFunction(request, response, (err, responseObj) => {
      request.preMadeResponse = {
        type: response.dataType || 'json',
        responseObj
      };
      next(err);
    });
  };
};

const buildRoutes = (apiRoutes) => {
  const router = express.Router();

  _.each(apiRoutes, (route) => {
    const { actions, publicFunctions, componentName } = route.controller;

    _.each(actions, async (action) => {
      const componentRoutePath = `/${componentName}/${action.name}`;

      const controllerFunction = functionWrapper(
        componentName,
        publicFunctions,
        action
      );

      router.get(componentRoutePath, controllerFunction);
      router.post(componentRoutePath, controllerFunction);
      router.delete(componentRoutePath, controllerFunction);
      router.put(componentRoutePath, controllerFunction);
    });
  });

  return router;
};

const createComponentsApiRoutes = () => {
  const components =
    ServicesManager.getServices().ComponentsDiscoveryService.getAllComponents();
  const routes = _.map(components, (controller) => {
    const { componentName } = controller;
    return {
      urlPath: `/${componentName}`,
      controller
    };
  });

  return routes;
};

export { buildRoutes, createComponentsApiRoutes };
