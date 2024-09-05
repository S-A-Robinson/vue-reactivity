const targetMap = new WeakMap() // stores a list of dependency maps that will run effects when updated

// Keeps track of all the dependency maps in targetMap
function track(target, key) {
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
  dep.add(effect)
}

// Triggers all effects to be run in the given dependency
function trigger(target, key) {
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

function reactive(target) {
  const handler = {
    get(target, key, receiver) {
      let result = Reflect.get(target, key, receiver)
      track(target, key)
      return result
    },
    set(target, key, value, receiver) {
      let oldValue = target[key]
      let result = Reflect.set(target, key, value, receiver)
      if (result && oldValue !== value) {
        trigger(target, key)
      }
      return result
    },
  }
  return new Proxy(target, handler)
}

let product = reactive({ price: 5, quantity: 2 })
let total = 0

let effect = () => {
  total = product.price * product.quantity
}

effect()
console.log(total)

product.quantity = 3

console.log(total)