// ============= Test Cases =============
import type { Equal, Expect } from './test-utils'

type cases = [
  Expect<Equal<MinusOne<1>, 0>>,
  Expect<Equal<MinusOne<55>, 54>>,
  Expect<Equal<MinusOne<3>, 2>>,
  Expect<Equal<MinusOne<100>, 99>>,
  Expect<Equal<MinusOne<1101>, 1100>>,
  Expect<Equal<MinusOne<0>, -1>>,
  Expect<Equal<MinusOne<9_007_199_254_740_992>, 9_007_199_254_740_991>>,
]


// ============= Your Code Here =============
type Number2String<T extends string | number> = `${T}`
type String2Number<T extends string> = T extends `${infer V extends number}` ? V : never
type ReverseString<T extends string> = T extends `${infer F}${infer Rest}` ? `${ReverseString<Rest>}${F}` : T
type MinusOneMap = {
  '1': '0',
  '2': '1',
  '3': '2',
  '4': '3',
  '5': '4',
  '6': '5',
  '7': '6',
  '8': '7',
  '9': '8',
  '0': '9',
}

type MinusReverseStringOne<T extends string> =
  T extends `${infer F}${infer Rest}`
    ? F extends '0'
      ? `9${MinusReverseStringOne<Rest>}`
      : F extends keyof MinusOneMap
        ? `${MinusOneMap[F]}${Rest}`
        : never
    : T

type OmitLastZero<T extends string> = T extends `${infer V}0` ? OmitLastZero<V> : T extends '' ? '0' : T

type MinusOne<T extends number> = T extends 0 ? -1 : String2Number<ReverseString<OmitLastZero<MinusReverseStringOne<ReverseString<Number2String<T>>>>>>
