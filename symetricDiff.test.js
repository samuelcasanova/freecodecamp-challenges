import { expect, it } from 'vitest'

function diffArray(arr1, arr2) {
  const match1 = arr1.filter(n => !arr2.some(m => m === n))
  const match2 = arr2.filter(n => !arr1.some(m => m === n))
  return [...match1, ...match2]
}


it('should return [] with ([], [])', () => {
  const result = diffArray([], [])

  expect(result).toStrictEqual([])
})

it('should return [1] with ([], [1])', () => {
  const result = diffArray([], [1])

  expect(result).toStrictEqual([1])
})

it('should return [2] with ([1,2], [1])', () => {
  const result = diffArray([1, 2], [1])

  expect(result).toStrictEqual([2])
})

it('should return [2] with ([1,2,3], [1,3])', () => {
  const result = diffArray([1, 2, 3], [1, 3])

  expect(result).instanceOf(Array)
})

it('should return ["diorite", "pink wool"] with ["andesite", "grass", "dirt", "pink wool", "dead shrub"], ["diorite", "andesite", "grass", "dirt", "dead shrub"]', () => {
  const result = diffArray(["andesite", "grass", "dirt", "pink wool", "dead shrub"], ["diorite", "andesite", "grass", "dirt", "dead shrub"])
  
  expect(result).toStrictEqual(["pink wool", "diorite"])
})