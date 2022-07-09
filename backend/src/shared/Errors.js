/* eslint-disable no-use-before-define */
/* eslint-disable max-classes-per-file */
class GeneralError extends Error {
  constructor({
    message,
    displayMessage = '',
    labels = {},
    extraDetails = {},
    request = {},
    stack = null,
    logError = true
  } = {}) {
    super(message);
    const { externalUser, userId, username } = request?.auth || {};
    this.externalUser = externalUser;
    this.userId = userId;
    this.logError = logError;
    this.username = username || 'system';
    this.devMessage = message;
    this.displayMessage = displayMessage;
    this.labels = { origin: 'Backend', ...labels };
    this.extraDetails = extraDetails;
    this.stack = stack ?? this.stack;
  }

  getErrorDetails() {
    const ErrorName = this.constructor.name;

    switch (ErrorName) {
      case 'BadRequest':
        return {
          status: 400,
          message: this.message,
          extraDetails: this.extraDetails
        };
      case 'NotFound':
        return {
          status: 404,
          message: this.message,
          extraDetails: this.extraDetails
        };
      case 'Forbidden':
        return {
          status: 403,
          message: this.message,
          extraDetails: this.extraDetails
        };
      case 'Unauthorized':
        return {
          status: 401,
          message:
            'The access token provided in the request is invalid or expired.',
          extraDetails: this.extraDetails
        };
      case 'ValidationError':
        return {
          status: 400,
          message: 'Your request failed on validation.',
          extraDetails: this.extraDetails
        };
      case 'AccessGrantedError':
        return {
          status: 403,
          message: this.message,
          extraDetails: this.extraDetails
        };
      case 'AuthError':
        return {
          status: 401,
          message: 'Auth process general error.',
          extraDetails: this.extraDetails
        };
      case 'DBInsertError':
        return {
          status: 400,
          message: this.displayMessage || 'Failed to insert to db.',
          extraDetails: this.extraDetails
        };
      case 'DBUpdateError':
        return {
          status: 400,
          message: this.displayMessage || 'Failed to update db.',
          extraDetails: this.extraDetails
        };
      case 'DBDeleteError':
        return {
          status: 400,
          message: this.displayMessage || 'Failed to remove from db.',
          extraDetails: this.extraDetails
        };
      case 'DBSearchError':
        return {
          status: 400,
          message: this.displayMessage || 'Failed to search in db.',
          extraDetails: this.extraDetails
        };
      case 'DBSearchAverageSumCountError':
        return {
          status: 400,
          message:
            this.displayMessage ||
            'Failed to average sum or count search in db.',
          extraDetails: this.extraDetails
        };
      case 'DBExecuteError':
        return {
          status: 400,
          message: this.displayMessage || 'Failed to execute query.',
          extraDetails: this.extraDetails
        };
      case 'IncorrectPasswordError':
        return {
          status: 400,
          message: this.message,
          extraDetails: this.extraDetails
        };
      case 'IpWhitelistingError':
        return {
          status: 500,
          message: this.message,
          extraDetails: this.extraDetails
        };
      case 'EntityCreationError':
        return {
          status: 500,
          message: 'Failed to perform action, please contact dev team.',
          extraDetails: this.extraDetails
        };
      case 'PermissionsViolationError':
        return {
          status: 403,
          message: this.message,
          extraDetails: this.extraDetails
        };
      case 'NotImplementedError':
        return {
          status: 500,
          message: this.message || 'This feature is not implemented yet.',
          extraDetails: this.extraDetails
        };
      case 'MTBError':
        return {
          status: 500,
          message: this.message || 'MTB Error',
          extraDetails: this.extraDetails
        };
      case 'MTBCommandError':
        return {
          status: 500,
          message: this.message || 'MTBCommandError Error',
          extraDetails: this.extraDetails
        };
      case 'DiscordError':
        return {
          status: 500,
          message: this.message || 'DiscordError Error',
          extraDetails: this.extraDetails
        };
      case 'PluginsManagerError':
        return {
          status: 500,
          message: this.message || 'PluginsManager Error',
          extraDetails: this.extraDetails
        };
      case 'RetriesError':
        return {
          status: 500,
          message: this.message || 'Retries Failed',
          extraDetails: this.extraDetails
        };
      default:
        return {
          status: 500,
          message: 'Unrecognized error.',
          extraDetails: this.extraDetails
        };
    }
  }
}

class BadRequest extends GeneralError {}
class NotFound extends GeneralError {}
class Unauthorized extends GeneralError {}
class Forbidden extends GeneralError {}
class ValidationError extends GeneralError {}
class AccessGrantedError extends GeneralError {}
class DBInsertError extends GeneralError {}
class DBUpdateError extends GeneralError {}
class DBDeleteError extends GeneralError {}
class DBSearchError extends GeneralError {}
class DBSearchAverageSumCountError extends GeneralError {}
class DBCreateTableError extends GeneralError {}
class DBExecuteError extends GeneralError {}
class AuthError extends GeneralError {}
class InitServicesError extends GeneralError {}
class IpWhitelistingError extends GeneralError {}
class EntityCreationError extends GeneralError {}
class PermissionsViolationError extends GeneralError {}
class IncorrectPasswordError extends GeneralError {}
class NotImplementedError extends GeneralError {}
class CouchBaseError extends GeneralError {}
class MTBError extends GeneralError {}
class DiscordError extends GeneralError {}
class MTBCommandError extends GeneralError {}
class WSHApiError extends GeneralError {}
class TradingHoursError extends GeneralError {}
class PluginsManagerError extends GeneralError {}
class RetriesError extends GeneralError {}
class SMError extends GeneralError {}

export default {
  GeneralError,
  BadRequest,
  NotFound,
  Unauthorized,
  Forbidden,
  ValidationError,
  AccessGrantedError,
  InitServicesError,
  DBInsertError,
  DBUpdateError,
  DBDeleteError,
  DBSearchError,
  DBCreateTableError,
  DBExecuteError,
  DBSearchAverageSumCountError,
  AuthError,
  IpWhitelistingError,
  EntityCreationError,
  PermissionsViolationError,
  IncorrectPasswordError,
  NotImplementedError,
  CouchBaseError,
  MTBError,
  MTBCommandError,
  TradingHoursError,
  WSHApiError,
  PluginsManagerError,
  RetriesError,
  SMError,
  DiscordError
};
