import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'csv-viewer.workspace-transition-text-control'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main }) => {
  const textTab = Locator('.MainTab[title$="test.txt"]')
  const tmpDir = await FileSystem.getTmpDir()
  const workspaceA = `${tmpDir}/workspace-a`
  const workspaceB = `${tmpDir}/workspace-b`
  await FileSystem.mkdir(workspaceA)
  await FileSystem.mkdir(workspaceB)
  await FileSystem.writeFile(`${workspaceA}/test.txt`, 'text')

  await Command.execute('Workspace.setPath', workspaceA)
  await Main.openUri(`${workspaceA}/test.txt`)
  await expect(textTab).toBeVisible()
  await Command.execute('Workspace.setPath', workspaceB)
  await expect(textTab).toHaveCount(0)

  if ((await Command.execute('Workspace.getPath')) !== workspaceB) {
    throw new Error('Expected workspace B to become active')
  }
}
