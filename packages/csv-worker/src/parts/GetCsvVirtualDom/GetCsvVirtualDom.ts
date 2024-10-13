import type { CsvRow } from '../CsvRow/CsvRow.ts'
import type { ParsedCsv } from '../ParsedCsv/ParsedCsv.ts'

const getCsvTableHeadDom = (rows: readonly string[]) => {
  const children: any[] = []
  children.push({
    type: 'th',
    className: 'TableHeading',
    children: [],
  })
  for (const row of rows) {
    children.push({
      type: 'th',
      className: 'TableHeading',
      children: [
        {
          type: 'text',
          value: row,
          children: [],
        },
      ],
    })
  }
  return {
    type: 'thead',
    className: 'TableHead',
    children,
  }
}

const getCsvTableBodyDom = (rows: readonly CsvRow[]) => {
  const dom: any[] = []
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const children: any[] = []
    children.push({
      type: 'td',
      className: 'TableCell',
      children: [],
    })
    for (const cell of row) {
      children.push({
        type: 'td',
        className: 'TableCell',
        children: [
          {
            type: 'text',
            value: cell,
          },
        ],
      })
    }
    dom.push({
      type: 'tr',
      className: 'TableRow',
      children,
    })
  }
  const tableBody = {
    type: 'tbody',
    className: 'TableBody',
    children: dom,
  }
  return tableBody
}

export const getCsvVirtualDom = (parsed: ParsedCsv): any => {
  const dom: any = []
  dom.push({
    type: 'div',
    className: 'Table',
    children: [getCsvTableHeadDom(parsed.header), getCsvTableBodyDom(parsed.content)],
  })
  return dom
}
