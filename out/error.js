"use strict";

var _create = require("babel-runtime/core-js/object/create");

var _create2 = _interopRequireDefault(_create);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ForbiddenError(property) {
  Error.call(this, property);
  this.name = "ForbiddenError";
  this.message = "Access denied";
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, ForbiddenError);
  } else {
    this.stack = new Error().stack;
  }
}

ForbiddenError.prototype = (0, _create2.default)(Error.prototype);

module.exports = ForbiddenError;