import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'csv-viewer.keyboard-navigation'

export const test: Test = async ({ Command, expect, FileSystem, KeyBoard, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/navigation.csv`, 'key,value\na,1\nb,2\n')
  await Main.openUri(`${tmpDir}/navigation.csv`)
  const firstCell = Locator('.TableBody .TableRow').nth(0).locator('.TableCell').nth(1)
  await expect(firstCell).toHaveText('a')
  const viewStates = (await Command.execute('Viewlet.getAllStates')) as Record<
    string,
    { readonly uid: number; readonly viewId: string }
  >
  const extensionView = Object.values(viewStates).find(({ viewId }) => viewId === 'builtin.csv-viewer')
  if (!extensionView) {
    throw new Error('Expected CSV extension view')
  }
  await Command.execute('Viewlet.executeViewletCommand', extensionView.uid, 'handleViewEvent', 'click', 'cell:0:1')
  await expect(firstCell).toBeFocused()

  await KeyBoard.press('ArrowRight')
  const rightCell = Locator('.TableBody .TableRow').nth(0).locator('.TableCell').nth(2)
  await expect(rightCell).toBeFocused()
  await KeyBoard.press('ArrowDown')
  const downCell = Locator('.TableBody .TableRow').nth(1).locator('.TableCell').nth(2)
  await expect(downCell).toBeFocused()
  await KeyBoard.press('ArrowLeft')
  const leftCell = Locator('.TableBody .TableRow').nth(1).locator('.TableCell').nth(1)
  await expect(leftCell).toBeFocused()
  await KeyBoard.press('ArrowUp')
  await expect(firstCell).toBeFocused()
  await KeyBoard.press('ArrowUp')
  await expect(firstCell).toBeFocused()
}
