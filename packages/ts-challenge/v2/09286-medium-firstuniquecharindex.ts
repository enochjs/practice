// ============= Test Cases =============
import type { Equal, Expect } from './test-utils'

type cases = [
  Expect<Equal<FirstUniqueCharIndex<'leetcode'>, 0>>,
  Expect<Equal<FirstUniqueCharIndex<'loveleetcode'>, 2>>,
  Expect<Equal<FirstUniqueCharIndex<'aabb'>, -1>>,
  Expect<Equal<FirstUniqueCharIndex<''>, -1>>,
  Expect<Equal<FirstUniqueCharIndex<'aaa'>, -1>>,
]


// ============= Your Code Here =============
type CountV<S, V, C extends number[]=[]> =
  S extends `${infer F}${infer Rest}`
    ? F extends V
      ? CountV<Rest, V, [...C, 1]>
      : CountV<Rest, V, C>
    : C['length']

type FirstUniqueCharIndex<T extends string, U = T, I extends number[] = []> =
  T extends `${infer F}${infer Rest}`
    ? CountV<U, F> extends 1
      ? I['length']
      : FirstUniqueCharIndex<Rest, U, [...I, 1]>
    : -1
