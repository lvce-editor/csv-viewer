const windowsAbsolutePathPattern = /^[a-z]:[\\/]/i

export const toFileUri = (uri: string): string => {
  if (uri.startsWith('/')) {
    return `file://${uri}`
  }
  if (windowsAbsolutePathPattern.test(uri)) {
    return `file:///${uri.replaceAll('\\', '/')}`
  }
  return uri
}
