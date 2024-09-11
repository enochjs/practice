// ============= Test Cases =============
import type { Equal, Expect } from './test-utils'

type ModifierKeys = ['cmd', 'ctrl', 'opt', 'fn']
type CaseTypeOne = 'cmd ctrl' | 'cmd opt' | 'cmd fn' | 'ctrl opt' | 'ctrl fn' | 'opt fn'

type cases = [
  Expect<Equal<Combs<ModifierKeys>, CaseTypeOne>>,
]


// ============= Your Code Here =============

type CombsOne<F extends string, Rest extends any[], R = never> = 
  Rest extends [infer A extends string, ...infer ARest]
    ? CombsOne<F, ARest, R | `${F} ${A}`>
    : R
// 实现 Combs
type Combs<T extends string[]> =
  T extends [infer F extends string, ...infer Rest extends string[]]
    ? CombsOne<F, Rest> | Combs<Rest>
    : never
