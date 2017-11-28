'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('./utils'),
    isFunction = _require.isFunction;

var ForbiddenError = require('./error');

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
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(action, target) {
        var model, abilityRules, rule;
        return regeneratorRuntime.wrap(function _callee$(_context) {
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
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(action, target) {
        var model, abilityRules, rule;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                model = this.getModel(target);

                if (!this.abilities.has(model)) {
                  _context2.next = 11;
                  break;
                }

                abilityRules = this.abilities.get(model);
                rule = abilityRules.get(abilityRules.has(action) ? action : 'manage');
                _context2.t0 = rule;

                if (!_context2.t0) {
                  _context2.next = 9;
                  break;
                }

                _context2.next = 8;
                return rule.checkMethod(target);

              case 8:
                _context2.t0 = _context2.sent;

              case 9:
                if (!_context2.t0) {
                  _context2.next = 11;
                  break;
                }

                return _context2.abrupt('return');

              case 11:
                return _context2.abrupt('return', new ForbiddenError());

              case 12:
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
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(model, action) {
        var abilityRules, rule;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!this.abilities.has(model)) {
                  _context3.next = 7;
                  break;
                }

                abilityRules = this.abilities.get(model);


                if (!abilityRules.has(action) && abilityRules.has('manage')) {
                  action = 'manage';
                }

                rule = abilityRules.get(action);

                if (!isFunction(rule.query)) {
                  _context3.next = 6;
                  break;
                }

                return _context3.abrupt('return', rule.query());

              case 6:
                return _context3.abrupt('return', rule.query);

              case 7:
                return _context3.abrupt('return', this.restrictLiteral);

              case 8:
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