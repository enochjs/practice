// ============= Test Cases =============
import type { Equal, Expect, MergeInsertions } from './test-utils'

type Foo = {
  a: number
  b: string
}
type Bar = {
  b: number
  c: boolean
}

type cases = [
  Expect<Equal<Merge<Foo, Bar>, {
    a: number
    b: number
    c: boolean
  }>>,
]


// ============= Your Code Here =============
type Merge<F, S> = MergeInsertions<{
  [P in keyof S]: S[P]
} & {
  [P in keyof F as P extends keyof S ? never : P]: F[P]
}>
