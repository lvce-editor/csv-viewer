import { expect, test } from '@jest/globals'
import { toFileUri } from '../src/parts/ToFileUri/ToFileUri.ts'

test('converts an absolute posix path', () => {
  expect(toFileUri('/test/file.csv')).toBe('file:///test/file.csv')
})

test('converts an absolute windows path', () => {
  expect(toFileUri('C:\\test\\file.csv')).toBe('file:///C:/test/file.csv')
})

test('preserves an existing uri', () => {
  expect(toFileUri('file:///test/file.csv')).toBe('file:///test/file.csv')
})
