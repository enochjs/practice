// ============= Test Cases =============
import type { Equal, Expect } from './test-utils'
import { ExpectFalse, NotEqual } from './test-utils'

let x = 1
let y = 1 as const

type cases1 = [
  Expect<Equal<Integer<1>, 1>>,
  Expect<Equal<Integer<1.1>, never>>,
  Expect<Equal<Integer<1.0>, 1>>,
  Expect<Equal<Integer<1.000000000>, 1>>,
  Expect<Equal<Integer<0.5>, never>>,
  Expect<Equal<Integer<28.00>, 28>>,
  Expect<Equal<Integer<28.101>, never>>,
  Expect<Equal<Integer<typeof x>, never>>,
  Expect<Equal<Integer<typeof y>, 1>>,
]


// ============= Your Code Here =============
type IsZero<T extends string> = T extends `${infer V}0` ? IsZero<V> : T extends '' ? true : false

type Integer<T extends number> =
  number extends T
    ? never
    : `${T}` extends `${infer F extends number}.${infer V}`
      ? IsZero<V> extends true
        ? F
        : never
    : T
