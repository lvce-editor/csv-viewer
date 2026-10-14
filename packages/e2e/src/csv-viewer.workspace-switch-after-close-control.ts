import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'csv-viewer.workspace-switch-after-close-control'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main }) => {
  const table = Locator('.Table')
  const tmpDir = await FileSystem.getTmpDir()
  const workspaceA = `${tmpDir}/workspace-a`
  const workspaceB = `${tmpDir}/workspace-b`
  await FileSystem.mkdir(workspaceA)
  await FileSystem.mkdir(workspaceB)
  await FileSystem.writeFile(`${workspaceA}/test.csv`, 'key,value\na,1\n')

  await Command.execute('Workspace.setPath', workspaceA)
  await Main.openUri(`${workspaceA}/test.csv`)
  await expect(table).toBeVisible()
  await Command.execute('Main.closeAllEditorsAndSave')
  await expect(table).toHaveCount(0)
  await Command.execute('Workspace.setPath', workspaceB)

  if ((await Command.execute('Workspace.getPath')) !== workspaceB) {
    throw new Error('Expected workspace B to become active')
  }
}
