import _ from 'lodash';
import ServicesManager from '../services/index.js';

class BasicComponent {
  constructor(entity) {
    this.id = entity?.id;
    this.changeLog = entity?.changeLog;
    this.controller = entity?.controller;
    this.queryHelper = null;
  }

  #transformWhereFields = (fields, _tableName) => {
    const [whereField] = _.transform(
      fields,
      (result, value, key) => {
        (result || (result = [])).push({
          tableName: _tableName,
          fieldName: key,
          fieldValue: value
        });
      },
      []
    );
    return whereField;
  };

  #prepareQueryHelper = () => {
    if (this.queryHelper) {
      return;
    }
    const { queryHelper } =
      ServicesManager.getServices().DataBaseManager.getLocalConnection();
    this.queryHelper = queryHelper;
  };

  create = async (fields, tableName) => {
    this.#prepareQueryHelper();
    const createResult = await this.queryHelper.insert(tableName, fields);
    return createResult;
  };

  update = async (fields, tableName) => {
    this.#prepareQueryHelper();
    const { id } = fields;
    const where = this.#transformWhereFields({ id }, tableName);
    delete fields.id;
    const updateResult = await this.queryHelper.update(
      tableName,
      fields,
      where
    );
    return updateResult;
  };

  remove = async (fields, tableName) => {
    this.#prepareQueryHelper();
    const remove = this.#transformWhereFields(fields, tableName);
    const removeResult = await this.queryHelper.delete(tableName, remove);
    return removeResult;
  };

  generatedValues = (values) => values;
}

const generateBasicFunctions = (controllerClass) => {
  const { queryHelper } =
    ServicesManager.getServices().DataBaseManager.getLocalConnection();

  const getRequestedClassComponent = () => {
    const { component } =
      ServicesManager.getServices().ComponentsDiscoveryService.getAllComponents()[
        _.camelCase(controllerClass.name)
      ];

    // eslint-disable-next-line new-cap
    return new component();
  };

  const controllerClassName = _.camelCase(controllerClass.name);

  const search = async (request, response, next) => {
    const { fields, where, order, limit, join } = request.body;
    const searchResult = await queryHelper.select(
      controllerClassName,
      fields,
      where,
      order,
      limit,
      join
    );
    next(null, searchResult);
  };

  const create = async (request, response, next) => {
    const classComponent = getRequestedClassComponent();
    const packedFields = classComponent.generatedValues(request.body);
    const createResult = classComponent.create(
      packedFields,
      controllerClassName
    );
    next(null, createResult);
  };

  const remove = async (request, response, next) => {
    const classComponent = getRequestedClassComponent();
    const removeResult = classComponent.remove(
      request.body,
      controllerClassName
    );
    next(null, removeResult);
  };

  const update = async (request, response, next) => {
    const classComponent = getRequestedClassComponent();
    const updateResult = classComponent.update(
      request.body,
      controllerClassName
    );
    next(null, updateResult);
  };
  return {
    remove,
    update,
    search,
    create
  };
};

export { generateBasicFunctions, BasicComponent };
