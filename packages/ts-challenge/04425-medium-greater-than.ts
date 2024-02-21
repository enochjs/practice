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

enum CompareResult{
  Large = 1,
  Equal = 0,
  Lower = -1,
}

type CompareLength<X extends string, Y extends string> =
  X extends `${infer X1}${infer XRest}`
    ? Y extends `${infer Y1}${infer YRest}`
      ? CompareLength<XRest, YRest>
      : CompareResult.Large
    : Y extends `${infer Y1}${infer YRest}`
      ? CompareResult.Lower
      : CompareResult.Equal

type CompareByDigit<X extends number, Y extends number, I extends number[] = []> =
   X extends I['length']
    ? Y extends I['length']
      ? CompareResult.Equal
      : CompareResult.Lower
    : Y extends I['length']
      ? CompareResult.Large
      : CompareByDigit<X, Y, [...I, 1]>

type Number2String<T extends number> = `${T}`

type String2Number<T extends string | number> = `${T}` extends `${infer R extends number}` ? R : never

type CompareByEqualLength<X extends string, Y extends string> =
  X extends `${infer X1}${infer XRest}`
    ? Y extends `${infer Y1}${infer YRest}`
      ? X1 extends Y1
        ? CompareByEqualLength<XRest, YRest>
        : CompareByDigit<String2Number<X1>, String2Number<Y1>> extends CompareResult.Large
          ? true
          : false
      : false
    : false


type GreaterThan<T extends number, U extends number, R = CompareLength<Number2String<T>, Number2String<U>>> =
  R extends CompareResult.Equal
    ? CompareByEqualLength<Number2String<T>, Number2String<U>>
    : R extends CompareResult.Large
      ? true
      : false
      
