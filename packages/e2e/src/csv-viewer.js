export const name = 'csv-viewer'

export const test = async ({ Command, FileSystem, Main, Locator, QuickPick, expect }) => {
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
  const reopenPromise = Command.execute('Main.reopenEditorWith')
  await expect(Locator('.QuickPick')).toBeVisible()
  await QuickPick.selectItem('CSV Viewer')
  await reopenPromise

  // assert
  const webView = Locator('.WebViewIframe')
  await expect(webView).toBeVisible()
}
