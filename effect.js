let activeEffect = null
const targetMap = new WeakMap() // stores a list of dependency maps that will run effects when updated

export function effect(eff) {
  activeEffect = eff
  activeEffect()
  activeEffect = null
}

// Keeps track of all the dependency maps in targetMap
export function track(target, key) {
  if (activeEffect) {
    // Check this dependency map is being tracked
    let depsMap = targetMap.get(target)
    if (!depsMap) {
      // If we didn't find a dependency map then we create one
      targetMap.set(target, (depsMap = new Map()))
    }

    // Check the dependency map has the dependency
    let dep = depsMap.get(key)
    if (!dep) {
      // If it doesn't then create one
      depsMap.set(key, (dep = new Set()))
    }
    // Add the effect to the dependency
    dep.add(activeEffect)
  }
}

// Triggers all effects to be run in the given dependency
export function trigger(target, key) {
  // Check the dependency map actually exists, return if we didn't find one
  const depsMap = targetMap.get(target)
  if (!depsMap) {
    return
  }
  // Get the dependency from the map
  let dep = depsMap.get(key)

  if (dep) {
    // If it exists then we run all the effects within it
    dep.forEach(effect => {
      effect()
    })
  }
}