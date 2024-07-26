// ============= Test Cases =============
import type { Equal, Expect } from './test-utils'
import { ExpectFalse, NotEqual } from './test-utils'

type cases = [
  Expect<Equal<Transpose<[]>, []>>,
  Expect<Equal<Transpose<[[1]]>, [[1]]>>,
  Expect<Equal<Transpose<[[1, 2]]>, [[1], [2]]>>,
  Expect<Equal<Transpose<[[1, 2], [3, 4]]>, [[1, 3], [2, 4]]>>,
  Expect<Equal<Transpose<[[1, 2, 3], [4, 5, 6]]>, [[1, 4], [2, 5], [3, 6]]>>,
  Expect<Equal<Transpose<[[1, 4], [2, 5], [3, 6]]>, [[1, 2, 3], [4, 5, 6]]>>,
  Expect<Equal<Transpose<[[1, 2, 3], [4, 5, 6], [7, 8, 9]]>, [[1, 4, 7], [2, 5, 8], [3, 6, 9]]>>,
]


// ============= Your Code Here =============

type InsertArr<T extends number[][], U extends number[]> =
  U extends [infer F, ...infer Rest extends number[]]
    ? T extends [infer T1 extends number[], ...infer TRest extends number[][]]
      ? [[...T1, F], ...InsertArr<TRest, Rest>]
      : [[F], ...InsertArr<T, Rest>]
    : []

type Transpose<M extends number[][], R extends number[][] = []> =
  M extends [infer F extends number[], ...infer Rest extends number[][]]
    ? Transpose<Rest, InsertArr<R, F>>
    : R
