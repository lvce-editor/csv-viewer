import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'csv-viewer.workspace-switch'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main }) => {
  const table = Locator('.Table')
  const iframes = Locator('.WebViewIframe')
  const tabs = Locator('.MainTab')
  const freshCell = Locator('[id="cell:0:1"]')
  const tmpDir = await FileSystem.getTmpDir()
  const workspaceA = `${tmpDir}/workspace-a`
  const workspaceB = `${tmpDir}/workspace-b`
  await FileSystem.mkdir(workspaceA)
  await FileSystem.mkdir(workspaceB)
  await FileSystem.writeFile(`${workspaceA}/test.csv`, 'key,value\na,1\n')

  await Command.execute('Workspace.setPath', workspaceA)
  await Main.openUri(`${workspaceA}/test.csv`)
  await expect(table).toBeVisible()
  await Command.execute('Workspace.setPath', workspaceB)

  if ((await Command.execute('Workspace.getPath')) !== workspaceB) {
    throw new Error('Expected workspace B to become active')
  }
  await expect(table).toHaveCount(0)
  await expect(iframes).toHaveCount(0)
  await FileSystem.writeFile(`${workspaceB}/fresh.csv`, 'key,value\nb,2\n')
  await Main.openUri(`${workspaceB}/fresh.csv`)
  await expect(freshCell).toHaveText('b')
  await Command.execute('Main.closeAllEditorsAndSave')

  await Command.execute('Workspace.setPath', workspaceA)
  await FileSystem.writeFile(`${workspaceA}/test.txt`, 'text control')
  await Main.openUri(`${workspaceA}/test.txt`)
  await Main.openUri(`${workspaceA}/test.csv`)
  await expect(table).toBeVisible()
  await Command.execute('Workspace.setPath', workspaceB)
  if ((await Command.execute('Workspace.getPath')) !== workspaceB) {
    throw new Error('Expected workspace B with mixed CSV and text tabs')
  }
  await expect(tabs).toHaveCount(0)
  await expect(table).toHaveCount(0)
  await expect(iframes).toHaveCount(0)
}
