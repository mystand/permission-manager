"use strict";

var isFunction = function isFunction(object) {
  return !!(object && object.constructor && object.call && object.apply);
};

exports.isFunction = isFunction;