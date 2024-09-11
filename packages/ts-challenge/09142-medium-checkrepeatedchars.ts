// ============= Test Cases =============
import type { Equal, Expect } from './test-utils'
import { ExpectFalse, NotEqual } from './test-utils'

type cases = [
  Expect<Equal<CheckRepeatedChars<'abc'>, false>>,
  Expect<Equal<CheckRepeatedChars<'abb'>, true>>,
  Expect<Equal<CheckRepeatedChars<'cbc'>, true>>,
  Expect<Equal<CheckRepeatedChars<''>, false>>,
]


// ============= Your Code Here =============

type String2Union<T extends string, R = never> = T extends `${infer F}${infer Rest}` ? String2Union<Rest, R | F> : R 

type CheckRepeatedChars<T extends string> =
  T extends `${infer F}${infer Rest}`
    ? F extends String2Union<Rest>
      ? true
      : CheckRepeatedChars<Rest>
    : false
