const { isFunction, wrapPromise } = require('./utils')

class BasePermissionManager {
  constructor(user, restrictLiteral) {
    this.user = user
    this.abilities = new Map([])
    this.restrictLiteral = restrictLiteral
  }

  // Override in parent class
  getModel() {}

  can(action, target) {
    const model = this.getModel(target)

    if (this.abilities.has(model)) {
      const abilityRules = this.abilities.get(model)

      const rule = abilityRules.get(abilityRules.has(action) ? action : 'manage')

      if (rule) {
        const result = rule.checkMethod(target)

        return wrapPromise(result)
      }
    }

    return wrapPromise(false)
  }

  allow(model, action, query, checkMethod) {
    const ability = { query, checkMethod }
    if (!this.abilities.has(model)) {
      this.abilities.set(model, new Map([[action, ability]]))
    } else {
      const abilityRules = this.abilities.get(model)

      if (abilityRules.has(action)) {
        throw new Error(`Action "${action}" already defined for ability ${model.constructor.name}!`)
      } else {
        abilityRules.set(action, ability)
      }
    }
  }

  accessible(model, action) {
    if (this.abilities.has(model)) {
      const abilityRules = this.abilities.get(model)

      if (!abilityRules.has(action) && abilityRules.has('manage')) {
        action = 'manage'
      }

      const rule = abilityRules.get(action)

      if (isFunction(rule.query)) {
        return wrapPromise(rule.query())
      }

      return wrapPromise(rule.query)
    }

    return wrapPromise(this.restrictLiteral)
  }
}

module.exports = BasePermissionManager
