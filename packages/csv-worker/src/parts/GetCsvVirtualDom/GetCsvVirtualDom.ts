import type { ParsedCsv } from '../ParsedCsv/ParsedCsv.ts'
import type { Row } from '../WebView/WebView.ts'
import * as GetTextAreaPosition from '../GetTextAreaPosition/GetTextAreaPosition.ts'

const getFocused = (cursor: any, rowIndex: number, columnIndex: number) => {
  if (!cursor) {
    return false
  }
  if (cursor.textArea) {
    return false
  }
  return cursor.rowIndex === rowIndex && cursor.columnIndex === columnIndex
}

const getCsvTableHeadDom = (rows: readonly string[], cursor: any) => {
  const children: any[] = [ {
    children: [],
    className: 'TableHeading TableCellInfo',
    type: 'th',
  }]
  for (const row of rows) {
    children.push({
      children: [
        {
          children: [],
          type: 'text',
          value: row,
        },
      ],
      className: 'TableHeading TableCell',
      type: 'th',
    })
  }
  return {
    children: [
      {
        children,
        className: 'TableRow',
        type: 'tr',
      },
    ],
    className: 'TableHead',
    type: 'thead',
  }
}

const getCsvTableBodyDom = (rows: readonly Row[], cursor: any) => {
  const dom: any[] = []
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const children: any[] = []
    const isFocused = getFocused(cursor, i, 0)
    const extraClass = isFocused ? 'TableCellFocused' : ''
    children.push({
      children: [
        {
          type: 'text',
          value: `${i + 1}`,
        },
      ],
      className: `TableCell TableCellInfo ${extraClass}`,
      'data-column': 0,
      'data-row': i,
      type: 'td',
    })
    for (let j = 0; j < row.length; j++) {
      const cell = row[j]
      const focused = getFocused(cursor, i, j + 1)
      const extraClass = focused ? 'TableCellFocused' : ''
      children.push({
        children: [
          {
            type: 'text',
            value: cell,
          },
        ],
        className: `TableCell ${extraClass}`,
        'data-column': j + 1,
        'data-row': i,
        type: 'td',
      })
    }
    dom.push({
      children,
      className: 'TableRow',
      type: 'tr',
    })
  }
  const tableBody = {
    children: dom,
    className: 'TableBody',
    type: 'tbody',
  }
  return tableBody
}

export const getCsvVirtualDom = (parsed: ParsedCsv, cursor: any): any => {
  const children: any[] = [
    {
      children: [getCsvTableHeadDom(parsed.header, cursor), getCsvTableBodyDom(parsed.content, cursor)],
      className: 'Table',
      type: 'table',
    },
  ]

  const dom: any = {
    children,
    className: 'Content',
    type: 'div',
  }
  if (cursor && cursor.textArea) {
    const { x, y } = GetTextAreaPosition.getTextAreaPosition(cursor)
    children.push({
      children: [],
      className: 'TextArea',
      name: 'TextArea',
      style: {
        left: `${x}px`,
        top: `${y}px`,
      },
      type: 'textarea',
      value: parsed?.content?.[cursor.rowIndex]?.[cursor.columnIndex - 1] || '',
    })
  }
  return dom
}
