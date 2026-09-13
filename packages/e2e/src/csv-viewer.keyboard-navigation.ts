import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'csv-viewer.keyboard-navigation'

export const test: Test = async ({ FileSystem, Main, Locator, KeyBoard, expect }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/navigation.csv`, 'key,value\na,1\nb,2\n')
  await Main.openUri(`${tmpDir}/navigation.csv`)
  const firstCell = Locator('[name="cell:0:1"]')
  await expect(firstCell).toHaveText('a')
  await firstCell.click()
  await expect(firstCell).toBeFocused()

  await KeyBoard.press('ArrowRight')
  await expect(Locator('[name="cell:0:2"]')).toBeFocused()
  await KeyBoard.press('ArrowDown')
  await expect(Locator('[name="cell:1:2"]')).toBeFocused()
  await KeyBoard.press('ArrowLeft')
  await expect(Locator('[name="cell:1:1"]')).toBeFocused()
  await KeyBoard.press('ArrowUp')
  await expect(firstCell).toBeFocused()
  await KeyBoard.press('ArrowUp')
  await expect(firstCell).toBeFocused()
}
