// ============= Test Cases =============
import type { Equal, Expect, MergeInsertions } from './test-utils'
type cases = [
  Expect<Equal<CountElementNumberToObject<[1, 2, 3, 4, 5]>, {
    1: 1
    2: 1
    3: 1
    4: 1
    5: 1
  }
  >>,
  Expect<Equal<CountElementNumberToObject<[1, 2, 3, 4, 5, [1, 2, 3]]>, {
    1: 2
    2: 2
    3: 2
    4: 1
    5: 1
  }>>,
  Expect<Equal<CountElementNumberToObject<[1, 2, 3, 4, 5, [1, 2, 3, [4, 4, 1, 2]]]>, {
    1: 3
    2: 3
    3: 2
    4: 3
    5: 1
  }>>,
  Expect<Equal<CountElementNumberToObject<[never, 1]>, {1:1}>>,
  Expect<Equal<CountElementNumberToObject<['1', '2', '0']>, {
    0: 1
    1: 1
    2: 1
  }>>,
  Expect<Equal<CountElementNumberToObject<['a', 'b', ['c', ['d']]]>, {
    'a': 1
    'b': 1
    'c': 1
    'd': 1
  }>>,
]


// ============= Your Code Here =============

type FlattenDeep<T> =
  T extends [infer F, ...infer Rest]
    ? [F] extends [never]
      ? FlattenDeep<Rest>
      : F extends any[]
        ? [...FlattenDeep<F>, ...FlattenDeep<Rest>]
        : [F, ...FlattenDeep<Rest>]
    : []

type CountV<T, V, I extends number[] = []> =
  T extends [infer F, ...infer Rest]
    ? F extends V
      ? CountV<Rest, V, [...I, 1]>
      : CountV<Rest, V, I>
    : I['length']

type CountElementNumberToObject<T, All=FlattenDeep<T>, R extends Record<PropertyKey, number> = {}> =
  All extends [infer F extends string | number, ...infer Rest]
    ? F extends keyof R
      ? CountElementNumberToObject<T, Rest, R>
      : CountElementNumberToObject<T, Rest, R & Record<F, CountV<All, F>>>
    : MergeInsertions<R>
type a= CountElementNumberToObject<[never, 1]>