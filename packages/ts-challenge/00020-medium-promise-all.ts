// ============= Test Cases =============
import type { Equal, Expect } from './test-utils'

const promiseAllTest1 = PromiseAll([1, 2, 3] as const)
const promiseAllTest2 = PromiseAll([1, 2, Promise.resolve(3)] as const)
const promiseAllTest3 = PromiseAll([1, 2, Promise.resolve(3)])
const promiseAllTest4 = PromiseAll<Array<number | Promise<number>>>([1, 2, 3])

type cases = [
  Expect<Equal<typeof promiseAllTest1, Promise<[1, 2, 3]>>>,
  Expect<Equal<typeof promiseAllTest2, Promise<[1, 2, number]>>>,
  Expect<Equal<typeof promiseAllTest3, Promise<[number, number, number]>>>,
  Expect<Equal<typeof promiseAllTest4, Promise<number[]>>>,
]


// ============= Your Code Here =============

type PromiseResult<T extends any[], R extends any[] = []> =
  T extends [infer Pre, ...infer Rest]
    ? [Awaited<Pre>, ...PromiseResult<Rest>]
    : T extends []
      ? []
      : T extends (infer V)[]
        ? Awaited<V>[]
        : []

declare function PromiseAll<T extends any[]>(values: [...T]): Promise<PromiseResult<T>>
