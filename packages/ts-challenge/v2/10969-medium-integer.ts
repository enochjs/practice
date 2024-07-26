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

type TrimZero<T> = T extends `${infer V}0` ? TrimZero<V> : T;

type String2Number<T> = T extends `${infer V extends number}` ? number extends  V ? never : V : never
type Integer<T extends number, V=TrimZero<`${T}`>> =
  V extends `${infer F}.${infer L}`
    ? never
    : String2Number<V>
