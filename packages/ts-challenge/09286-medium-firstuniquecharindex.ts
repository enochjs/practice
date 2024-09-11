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
type RepeatCharLength<T extends string, V extends string, C extends number[] = []> =
  T extends `${infer F}${infer Rest}`
    ? V extends F
      ? RepeatCharLength<Rest, V, [...C , 1]>
      : RepeatCharLength<Rest, V, C>
    : C["length"]

type FirstUniqueCharIndex<T extends string, O extends string = T, Index extends number[] = []> =
  T extends `${infer F}${infer Rest}`
    ? RepeatCharLength<O, F> extends 1
      ? Index['length']
      : FirstUniqueCharIndex<Rest, O, [...Index, 1]>
    : -1
