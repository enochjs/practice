// ============= Test Cases =============
import type { Equal, Expect } from './test-utils'

type cases = [
  Expect<Equal<GreaterThan<1, 0>, true>>,
  Expect<Equal<GreaterThan<5, 4>, true>>,
  Expect<Equal<GreaterThan<4, 5>, false>>,
  Expect<Equal<GreaterThan<0, 0>, false>>,
  Expect<Equal<GreaterThan<10, 9>, true>>,
  Expect<Equal<GreaterThan<20, 20>, false>>,
  Expect<Equal<GreaterThan<10, 100>, false>>,
  Expect<Equal<GreaterThan<111, 11>, true>>,
  Expect<Equal<GreaterThan<1234567891011, 1234567891010>, true>>,
]


// ============= Your Code Here =============

type Number2String<T extends number | string> =  `${T}`
type String2Number<T extends string> = T extends `${infer V extends number}` ? V : never

type GreaterThanOne<X, Y, C extends number[] = []> =
  X extends C["length"]
    ? false
    : Y extends C["length"]
      ? true
      : GreaterThanOne<X, Y, [...C, 1]>

type LengthOfString<S extends string, C extends number[] = []> = S extends `${infer F}${infer Rest}` ? LengthOfString<Rest, [...C, 1]> : C["length"]

type GreaterThanWithEqualLength<X extends string, Y extends string> =
  X extends `${infer XF}${infer XRest}`
    ? Y extends `${infer YF}${infer YRest}`
      ? XF extends YF
        ? GreaterThanWithEqualLength<XRest, YRest>
        : GreaterThanOne<String2Number<XF>, String2Number<YF>>
      : false
    : false


type GreaterThan<T extends number, U extends number, LT extends number = LengthOfString<Number2String<T>>,  LU extends number = LengthOfString<Number2String<U>>> =
  LT extends LU
    ? GreaterThanWithEqualLength<Number2String<T>, Number2String<U>>
    : GreaterThanOne<T, U>