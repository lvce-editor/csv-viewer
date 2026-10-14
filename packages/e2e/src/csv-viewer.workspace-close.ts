import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'csv-viewer.workspace-close'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main }) => {
  const table = Locator('.Table')
  const iframes = Locator('.WebViewIframe')
  const tmpDir = await FileSystem.getTmpDir()
  const workspace = `${tmpDir}/workspace`
  await FileSystem.mkdir(workspace)
  await FileSystem.writeFile(`${workspace}/test.csv`, 'key,value\na,1\n')

  await Command.execute('Workspace.setPath', workspace)
  await Main.openUri(`${workspace}/test.csv`)
  await expect(table).toBeVisible()
  await Command.execute('Workspace.close')

  if ((await Command.execute('Workspace.getPath')) !== '') {
    throw new Error('Expected Close Workspace to clear the workspace path')
  }
  await expect(table).toHaveCount(0)
  await expect(iframes).toHaveCount(0)
}
