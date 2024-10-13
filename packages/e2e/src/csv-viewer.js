export const name = 'csv-viewer'

export const test = async ({ FileSystem, Main, Editor, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/test.csv`,
    `key, value
a,1
b,2
`,
  )

  await Main.openUri(`${tmpDir}/test.csv`)
}
