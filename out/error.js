"use strict";

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

ForbiddenError.prototype = Object.create(Error.prototype);

module.exports = ForbiddenError;