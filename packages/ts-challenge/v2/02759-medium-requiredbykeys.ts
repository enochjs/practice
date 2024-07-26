// ============= Test Cases =============
import type { Equal, Expect, MergeInsertions } from './test-utils'

interface User {
  name?: string
  age?: number
  address?: string
}

interface UserRequiredName {
  name: string
  age?: number
  address?: string
}

interface UserRequiredNameAndAge {
  name: string
  age: number
  address?: string
}

type cases = [
  Expect<Equal<RequiredByKeys<User, 'name'>, UserRequiredName>>,
  Expect<Equal<RequiredByKeys<User, 'name' | 'age'>, UserRequiredNameAndAge>>,
  Expect<Equal<RequiredByKeys<User>, Required<User>>>,
  // @ts-expect-error
  Expect<Equal<RequiredByKeys<User, 'name' | 'unknown'>, UserRequiredName>>,
]


// ============= Your Code Here =============
type RequiredByKeys<T, K extends keyof T = keyof T> = MergeInsertions<{
  [P in keyof T as P extends K ? P : never]-?: T[P]
} & {
  [P in keyof T as P extends K ? never : P]?: T[P]
}
>