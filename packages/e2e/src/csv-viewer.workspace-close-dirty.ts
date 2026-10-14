import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'csv-viewer.workspace-close-dirty'

export const test: Test = async ({ Command, Dialog, expect, FileSystem, KeyBoard, Locator, Main }) => {
  const table = Locator('.Table')
  const dirtyTabs = Locator('.MainTab.MainTabModified')
  const tmpDir = await FileSystem.getTmpDir()
  const workspace = `${tmpDir}/workspace`
  const uri = `${workspace}/test.csv`
  const original = 'key,value\na,1\n'
  await FileSystem.mkdir(workspace)
  await FileSystem.writeFile(uri, original)
  await Command.execute('Workspace.setPath', workspace)
  await Main.openUri(uri)
  const cell = Locator('[id="cell:0:1"]')
  const edit = async (): Promise<void> => {
    await expect(cell).toHaveText('a')
    const viewStates = (await Command.execute('Viewlet.getAllStates')) as Record<
      string,
      { readonly uid: number; readonly viewId: string }
    >
    const extensionView = Object.values(viewStates).find(({ viewId }) => viewId === 'builtin.csv-viewer')
    if (!extensionView) throw new Error('Expected CSV extension view')
    await Command.execute(
      'Viewlet.executeViewletCommand',
      extensionView.uid,
      'handleViewCommand',
      'handleDoubleClick',
      'cell:0:1',
    )
    const editor = Locator('[name="cellEditor"]')
    await expect(editor).toBeFocused()
    await Command.execute('Viewlet.executeViewletCommand', extensionView.uid, 'handleInput', 'cellEditor', 'edited')
    await KeyBoard.press('Enter')
    await expect(dirtyTabs).toBeVisible()
  }
  await edit()
  await Dialog.mockConfirm(() => false)
  await Command.execute('Workspace.close')
  if ((await Command.execute('Workspace.getPath')) !== workspace) throw new Error('Cancel must keep the workspace open')
  await expect(cell).toHaveText('edited')
  if ((await FileSystem.readFile(uri)) !== original) throw new Error('Cancel must not write CSV edits')

  await Dialog.mockConfirm(() => true)
  await Command.execute('Workspace.close')
  if ((await Command.execute('Workspace.getPath')) !== '') throw new Error('Save must close the workspace')
  if ((await FileSystem.readFile(uri)) !== original.replace('a,1', 'edited,1')) throw new Error('Save must persist CSV edits')
  await expect(table).toHaveCount(0)

  await FileSystem.writeFile(uri, original)
  await Command.execute('Workspace.setPath', workspace)
  await Main.openUri(uri)
  await edit()
  await Dialog.mockConfirm((message: string) => message.startsWith('Discard'))
  await Command.execute('Workspace.close')
  if ((await Command.execute('Workspace.getPath')) !== '') throw new Error('Discard must close the workspace')
  if ((await FileSystem.readFile(uri)) !== original) throw new Error('Discard must not write CSV edits')
  await expect(table).toHaveCount(0)
}
