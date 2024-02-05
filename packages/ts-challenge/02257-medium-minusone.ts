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
type Number2String<T extends number> = `${T}`

type String2Number<T extends string> = T extends `${infer V extends number}` ? V : never

type ReverseString<T extends string, R extends string = ''> = T extends `${infer F}${infer Rest}` ? ReverseString<Rest, `${F}${R}`> : R;

type MinusMap = {
  '9': '8',
  '8': '7',
  '7': '6',
  '6': '5',
  '5': '4',
  '4': '3',
  '3': '2',
  '2': '1',
  '1': '0',
}

type MinusOneString<T> =
  T extends `${infer F}${infer Rest}`
    ? F extends '0'
      ? `${9}${MinusOneString<Rest>}`
      : F extends keyof MinusMap
        ? `${MinusMap[F]}${Rest}`
        : never
    : ''

type DeletePreZero<T> = T extends '0' ? '0' : T extends `0${infer V}` ? DeletePreZero<V> : T

type MinusOne<T extends number> = T extends 0 ? -1 : String2Number<DeletePreZero<ReverseString<MinusOneString<ReverseString<Number2String<T>>>>>>
