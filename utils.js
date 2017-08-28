exports.isFunction = (object) => {
  return !!(object && object.constructor && object.call && object.apply)
}

exports.isPromise = (object) => {
  return !!(object && object.then && isFunction(object.then))
}

exports.wrapPromise = (object) => {
  if (isPromise(object)) {
    return object
  } else {
    return Promise.resolve(object)
  }
}

exports.isString = (obj) => {
  return (Object.prototype.toString.call(obj) === '[object String]')
}
