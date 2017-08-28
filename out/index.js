'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('./utils'),
    isFunction = _require.isFunction,
    wrapPromise = _require.wrapPromise;

var BasePermissionManager = function () {
  function BasePermissionManager(user, restrictLiteral) {
    _classCallCheck(this, BasePermissionManager);

    this.user = user;
    this.abilities = new Map([]);
    this.restrictLiteral = restrictLiteral;
  }

  // Override in parent class


  _createClass(BasePermissionManager, [{
    key: 'getModel',
    value: function getModel() {}
  }, {
    key: 'can',
    value: function can(action, target) {
      var model = this.getModel(target);

      if (this.abilities.has(model)) {
        var abilityRules = this.abilities.get(model);

        var rule = abilityRules.get(abilityRules.has(action) ? action : 'manage');

        if (rule) {
          var result = rule.checkMethod(target);

          return wrapPromise(result);
        }
      }

      return wrapPromise(false);
    }
  }, {
    key: 'allow',
    value: function allow(model, action, query, checkMethod) {
      var ability = { query: query, checkMethod: checkMethod };
      if (!this.abilities.has(model)) {
        this.abilities.set(model, new Map([[action, ability]]));
      } else {
        var abilityRules = this.abilities.get(model);

        if (abilityRules.has(action)) {
          throw new Error('Action "' + action + '" already defined for ability ' + model.constructor.name + '!');
        } else {
          abilityRules.set(action, ability);
        }
      }
    }
  }, {
    key: 'accessible',
    value: function accessible(model, action) {
      if (this.abilities.has(model)) {
        var abilityRules = this.abilities.get(model);

        if (!abilityRules.has(action) && abilityRules.has('manage')) {
          action = 'manage';
        }

        var rule = abilityRules.get(action);

        if (isFunction(rule.query)) {
          return wrapPromise(rule.query());
        }

        return wrapPromise(rule.query);
      }

      return wrapPromise(this.restrictLiteral);
    }
  }]);

  return BasePermissionManager;
}();

module.exports = BasePermissionManager;