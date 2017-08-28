const isFunction = (object) => {
  return !!(object && object.constructor && object.call && object.apply)
}

const isPromise = (object) => {
  return !!(object && object.then && isFunction(object.then))
}

const wrapPromise = (object) => {
  if (isPromise(object)) {
    return object
  } else {
    return Promise.resolve(object)
  }
}

const isString = (obj) => {
  return (Object.prototype.toString.call(obj) === '[object String]')
}

exports.isFunction = isFunction
exports.isPromise = isPromise
exports.wrapPromise = wrapPromise
exports.isString = isString
