import type { CsvRow } from '../CsvRow/CsvRow.ts'
import type { ParsedCsv } from '../ParsedCsv/ParsedCsv.ts'

const getFocused = (cursor: any, rowIndex: number, columnIndex: number) => {
  if (!cursor) {
    return false
  }
  return cursor.rowIndex === rowIndex && cursor.columnIndex === columnIndex
}

const getCsvTableHeadDom = (rows: readonly string[], cursor: any) => {
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

const getCsvTableBodyDom = (rows: readonly CsvRow[], cursor: any) => {
  const dom: any[] = []
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const children: any[] = []
    const isFocused = getFocused(cursor, i, 0)
    const extraClass = isFocused ? 'TableCellFocused' : ''
    children.push({
      type: 'td',
      className: `TableCell TableCellInfo ${extraClass}`,
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
      const focused = getFocused(cursor, i, j + 1)
      const extraClass = focused ? 'TableCellFocused' : ''
      children.push({
        type: 'td',
        className: `TableCell ${extraClass}`,
        'data-row': i,
        'data-column': j + 1,
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

export const getCsvVirtualDom = (parsed: ParsedCsv, cursor: any): any => {
  const children: any[] = [
    {
      type: 'table',
      className: 'Table',
      children: [getCsvTableHeadDom(parsed.header, cursor), getCsvTableBodyDom(parsed.content, cursor)],
    },
  ]
  console.log({ cursor })
  if (cursor && cursor.textArea) {
    children.push({
      type: 'textarea',
      className: 'TextArea',
      style: {
        left: '100px',
        top: '100px',
      },
      children: [],
    })
    console.log('render textarea')
  }
  const dom: any = {
    type: 'div',
    className: 'Content',
    children,
  }
  return dom
}
