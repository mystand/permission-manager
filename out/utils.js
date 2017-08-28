'use strict';

var isFunction = function isFunction(object) {
  return !!(object && object.constructor && object.call && object.apply);
};

var isPromise = function isPromise(object) {
  return !!(object && object.then && isFunction(object.then));
};

var wrapPromise = function wrapPromise(object) {
  if (isPromise(object)) {
    return object;
  } else {
    return Promise.resolve(object);
  }
};

var isString = function isString(obj) {
  return Object.prototype.toString.call(obj) === '[object String]';
};

exports.isFunction = isFunction;
exports.isPromise = isPromise;
exports.wrapPromise = wrapPromise;
exports.isString = isString;