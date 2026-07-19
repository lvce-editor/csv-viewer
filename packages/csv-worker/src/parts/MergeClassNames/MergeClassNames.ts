export const mergeClassNames = (...classNames: readonly string[]): string => {
  return classNames.filter(Boolean).join(' ')
}
