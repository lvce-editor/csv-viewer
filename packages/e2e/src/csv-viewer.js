export const name = 'csv-viewer'

export const test = async ({ FileSystem, Main, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/test.csv`,
    `key, value
a,1
b,2
`,
  )

  // act
  await Main.openUri(`${tmpDir}/test.csv`)

  // assert
  const table = Locator('.Table')
  await expect(table).toBeVisible()
  await expect(Locator('.WebViewIframe')).toHaveCount(0)
  await expect(Locator('.TableHeading').nth(1)).toHaveText('key')
  await expect(Locator('.TableBody .TableRow').nth(0).locator('.TableCell').nth(1)).toHaveText('a')
}
