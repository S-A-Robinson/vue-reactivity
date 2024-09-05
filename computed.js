import { effect } from "./effect.js";
import ref from "./ref.js";

export default function computed(getter) {
  let result = ref()

  effect(() => (result.value = getter()))

  return result
}