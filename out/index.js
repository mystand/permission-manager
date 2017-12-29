'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require('./utils'),
    isFunction = _require.isFunction;

var ForbiddenError = require('./error');

var BasePermissionManager = function () {
  function BasePermissionManager(user, restrictLiteral) {
    (0, _classCallCheck3.default)(this, BasePermissionManager);

    this.user = user;
    this.abilities = new _map2.default([]);
    this.restrictLiteral = restrictLiteral;
  }

  // Override in parent class


  (0, _createClass3.default)(BasePermissionManager, [{
    key: 'getModel',
    value: function getModel() {}
  }, {
    key: 'can',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(action, target) {
        var model, abilityRules, rule;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                model = this.getModel(target);

                if (!this.abilities.has(model)) {
                  _context.next = 6;
                  break;
                }

                abilityRules = this.abilities.get(model);
                rule = abilityRules.get(abilityRules.has(action) ? action : 'manage');

                if (!rule) {
                  _context.next = 6;
                  break;
                }

                return _context.abrupt('return', rule.checkMethod(target));

              case 6:
                return _context.abrupt('return', false);

              case 7:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function can(_x, _x2) {
        return _ref.apply(this, arguments);
      }

      return can;
    }()
  }, {
    key: 'assert',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(action, target) {
        var model, abilityRules, rule, result;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                model = this.getModel(target);

                if (!this.abilities.has(model)) {
                  _context2.next = 10;
                  break;
                }

                abilityRules = this.abilities.get(model);
                rule = abilityRules.get(abilityRules.has(action) ? action : 'manage');

                if (!rule) {
                  _context2.next = 10;
                  break;
                }

                _context2.next = 7;
                return rule.checkMethod(target);

              case 7:
                result = _context2.sent;

                if (!result) {
                  _context2.next = 10;
                  break;
                }

                return _context2.abrupt('return');

              case 10:
                throw new ForbiddenError();

              case 11:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function assert(_x3, _x4) {
        return _ref2.apply(this, arguments);
      }

      return assert;
    }()
  }, {
    key: 'allow',
    value: function allow(model, action, query, checkMethod) {
      var ability = { query: query, checkMethod: checkMethod };
      if (!this.abilities.has(model)) {
        this.abilities.set(model, new _map2.default([[action, ability]]));
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
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(model, action) {
        var abilityRules, rule;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!this.abilities.has(model)) {
                  _context3.next = 8;
                  break;
                }

                abilityRules = this.abilities.get(model);


                if (!abilityRules.has(action) && abilityRules.has('manage')) {
                  action = 'manage';
                }

                rule = abilityRules.get(action);

                if (rule) {
                  _context3.next = 8;
                  break;
                }

                if (!isFunction(rule.query)) {
                  _context3.next = 7;
                  break;
                }

                return _context3.abrupt('return', rule.query());

              case 7:
                return _context3.abrupt('return', rule.query);

              case 8:
                return _context3.abrupt('return', this.restrictLiteral);

              case 9:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function accessible(_x5, _x6) {
        return _ref3.apply(this, arguments);
      }

      return accessible;
    }()
  }]);
  return BasePermissionManager;
}();

module.exports = BasePermissionManager;