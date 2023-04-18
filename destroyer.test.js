import { it, expect } from "vitest";

function destroyer(arr, ...todelete) {
  return arr.filter(n => !todelete.some(d => d === n));
}

it('should return [] with an empty array', () => {
  const result = destroyer([])

  expect(result).toStrictEqual([])
})

it('should return [1] with no parameters ([1])', () => {
  const result = destroyer([1])

  expect(result).toStrictEqual([1])
})

it('should return [] with ([1], 1)', () => {
  const result = destroyer([1], 1)

  expect(result).toStrictEqual([])
})

it('should return [1,1] with ([1, 2, 3, 1, 2, 3], 2, 3)', () => {
  const result = destroyer([1, 2, 3, 1, 2, 3], 2, 3)

  expect(result).toStrictEqual([1, 1])
})

it('should return ["hamburger"] with (["tree", "hamburger", 53], "tree", 53)', () => {
  const result = destroyer(["tree", "hamburger", 53], "tree", 53)

  expect(result).toStrictEqual(["hamburger"])
})