import type { CsvRow } from '../CsvRow/CsvRow.ts'
import type { ParsedCsv } from '../ParsedCsv/ParsedCsv.ts'

const getCsvTableHeadDom = (rows: readonly string[]) => {
  const children: any[] = []
  children.push({
    type: 'th',
    className: 'TableHeading TableCellInfo',
    children: [],
  })
  for (const row of rows) {
    children.push({
      type: 'th',
      className: 'TableHeading TableCell',
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
    children: [
      {
        type: 'tr',
        className: 'TableRow',
        children,
      },
    ],
  }
}

const getCsvTableBodyDom = (rows: readonly CsvRow[]) => {
  const dom: any[] = []
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const children: any[] = []
    children.push({
      type: 'td',
      className: 'TableCell TableCellInfo',
      'data-row': i,
      'data-column': 0,
      children: [
        {
          type: 'text',
          value: `${i + 1}`,
        },
      ],
    })
    for (let j = 0; j < row.length; j++) {
      const cell = row[j]
      children.push({
        type: 'td',
        className: 'TableCell',
        'data-row': i,
        'data-column': j,
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
  const dom: any = {
    type: 'div',
    className: 'Content',
    children: [
      {
        type: 'table',
        className: 'Table',
        children: [getCsvTableHeadDom(parsed.header), getCsvTableBodyDom(parsed.content)],
      },
    ],
  }
  return dom
}
