import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'csv-viewer.virtual-scroll-million-rows'

export const test: Test = async ({ expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const rows = ['value', ...Array(1_000_000).fill('value')].join('\n')
  await FileSystem.writeFile(`${tmpDir}/million-rows.csv`, rows)
  await Main.openUri(`${tmpDir}/million-rows.csv`)

  const firstCell = Locator('[id="cell:0:1"]')
  await expect(firstCell).toHaveText('value')
  const scrollContainer = Locator('.ScrollContainer')
  const tableBody = Locator('.TableBody')
  await expect(tableBody).toHaveCSS('height', '2e+07px')
  await expect(scrollContainer).toHaveJSProperty('scrollHeight', 20_000_020)
}
