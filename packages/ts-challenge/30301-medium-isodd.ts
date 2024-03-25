// ============= Test Cases =============
import type { Equal, Expect } from './test-utils'

type cases = [
  Expect<Equal<IsOdd<2023>, true>>,
  Expect<Equal<IsOdd<1453>, true>>,
  Expect<Equal<IsOdd<1926>, false>>,
  Expect<Equal<IsOdd<number>, false>>,
]


// ============= Your Code Here =============
type GetLast<T> = T extends `${infer _}${infer R}` ? R extends '' ? T : GetLast<R> : never
type Number2String<T extends number> = `${T}`
type LastIsOdd<T extends string> = T extends '1' | '3' | '5' | '7' | '9' ? true : false
type IsOdd<T extends number> = LastIsOdd<GetLast<Number2String<T>>>
