const { isFunction } = require('./utils')
const ForbiddenError = require('./error')

class BasePermissionManager {
  constructor(user, restrictLiteral) {
    this.user = user
    this.abilities = new Map([])
    this.restrictLiteral = restrictLiteral
  }

  // Override in parent class
  getModel() {
    throw new Error('You must implement getModel()')
  }

  getAbilityKey(model) {
    throw new Error('You must implement getAbilityKey()')
  }

  async can(action, target) {
    const abilityKey = this.getAbilityKey(this.getModel(target))

    if (this.abilities.has(abilityKey)) {
      const abilityRules = this.abilities.get(abilityKey)

      const rule = abilityRules.get(abilityRules.has(action) ? action : 'manage')

      if (rule) {
        return rule.checkMethod(target)
      }
    }

    return false
  }

  async assert(action, target) {
    if (!await this.can(action, target)) {
      throw new ForbiddenError()
    }
  }

  allow(model, action, query, checkMethod) {
    const abilityKey = this.getAbilityKey(model)
    const actions = Array.isArray(action) ? action : [action]
    const ability = { query, checkMethod }
    if (!this.abilities.has(abilityKey)) {
      this.abilities.set(abilityKey, new Map())
    }
    actions.forEach((action) => {
      this.setAbility(abilityKey, action, ability)
    })
  }

  setAbility(abilityKey, action, ability) {
    const abilityRules = this.abilities.get(abilityKey)

    if (abilityRules.has(action)) {
      throw new Error(`Action "${action}" already defined for ability ${abilityKey}!`)
    } else {
      abilityRules.set(action, ability)
    }
  }

  async accessible(model, action, args = []) {
    const abilityKey = this.getAbilityKey(model)
    if (this.abilities.has(abilityKey)) {
      const abilityRules = this.abilities.get(abilityKey)

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
