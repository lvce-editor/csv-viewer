import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'csv-viewer.keyboard-navigation'

export const test: Test = async ({ expect, FileSystem, KeyBoard, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/navigation.csv`, 'key,value\na,1\nb,2\n')
  await Main.openUri(`${tmpDir}/navigation.csv`)
  const firstCell = Locator('.TableBody .TableRow').nth(0).locator('.TableCell').nth(1)
  await expect(firstCell).toHaveText('a')
  await firstCell.dispatchEvent('click', { bubbles: true } as unknown as string)
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
