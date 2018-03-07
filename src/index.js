const { isFunction } = require('./utils')
const ForbiddenError = require('./error')

class BasePermissionManager {
  constructor(user, restrictLiteral) {
    this.user = user
    this.abilities = new Map([])
    this.restrictLiteral = restrictLiteral
  }

  // Override in parent class
  getModel() {}

  async can(action, target) {
    const model = this.getModel(target)

    if (this.abilities.has(model)) {
      const abilityRules = this.abilities.get(model)

      const rule = abilityRules.get(abilityRules.has(action) ? action : 'manage')

      if (rule) {
        return rule.checkMethod(target)
      }
    }

    return false
  }

  async assert(action, target) {
    const model = this.getModel(target)

    if (this.abilities.has(model)) {
      const abilityRules = this.abilities.get(model)

      const rule = abilityRules.get(abilityRules.has(action) ? action : 'manage')

      if (rule) {
        const result = await rule.checkMethod(target)
        if (result) {
          return          
        }
      }
    }

    throw new ForbiddenError()
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

  async accessible(model, action, args = []) {
    if (this.abilities.has(model)) {
      const abilityRules = this.abilities.get(model)

      if (!abilityRules.has(action) && abilityRules.has('manage')) {
        action = 'manage'
      }

      const rule = abilityRules.get(action)
      
      if (rule) {
        if (isFunction(rule.query)) {
          return rule.query.call(null, ...args)
        }
  
        return rule.query
      }
    }

    return this.restrictLiteral
  }
}

module.exports = BasePermissionManager
