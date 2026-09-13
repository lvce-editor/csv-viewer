import { mergeClassNames, text, VirtualDomElements, type VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import type { CsvRow, CsvViewState } from '../CsvViewState/CsvViewState.ts'
import { getTextAreaPosition } from '../GetTextAreaPosition/GetTextAreaPosition.ts'

const handleClick = 'handleClick'
const handleDoubleClick = 'handleDoubleClick'
const handleInput = 'handleInput'
const handleKeyDown = 'handleKeyDown'

const TabIndex = {
  Focusable: 0,
  Programmatic: -1,
} as const

const tableHeadNode: VirtualDomNode = {
  childCount: 1,
  className: 'TableHead',
  type: VirtualDomElements.THead,
}

const emptyHeadingNode: VirtualDomNode = {
  childCount: 0,
  className: mergeClassNames('TableHeading', 'TableCellInfo'),
  type: VirtualDomElements.Th,
}

const headingCellNode: VirtualDomNode = {
  childCount: 1,
  className: mergeClassNames('TableHeading', 'TableCell'),
  type: VirtualDomElements.Th,
}

const tableNode: VirtualDomNode = {
  childCount: 2,
  className: 'Table',
  type: VirtualDomElements.Table,
}

export const getCellName = (rowIndex: number, columnIndex: number): string => {
  return `cell:${rowIndex}:${columnIndex}`
}

const isFocused = (state: Readonly<CsvViewState>, rowIndex: number, columnIndex: number): boolean => {
  const { columnIndex: focusedColumnIndex, rowIndex: focusedRowIndex, textArea } = state
  return !textArea && focusedRowIndex === rowIndex && focusedColumnIndex === columnIndex
}

const renderCell = (
  state: Readonly<CsvViewState>,
  rowIndex: number,
  columnIndex: number,
  value: string,
  info = false,
): readonly VirtualDomNode[] => {
  const focused = isFocused(state, rowIndex, columnIndex)
  const focusedClassName = focused ? 'TableCellFocused' : ''
  return [
    {
      childCount: 1,
      className: mergeClassNames('TableCell', info ? 'TableCellInfo' : '', focusedClassName),
      id: getCellName(rowIndex, columnIndex),
      name: getCellName(rowIndex, columnIndex),
      onClick: handleClick,
      ...(columnIndex > 0 && { onDblClick: handleDoubleClick }),
      onKeyDown: handleKeyDown,
      tabIndex: focused ? TabIndex.Focusable : TabIndex.Programmatic,
      type: VirtualDomElements.Td,
    },
    text(value),
  ]
}

const renderHead = (header: CsvRow): readonly VirtualDomNode[] => {
  const dom: VirtualDomNode[] = [
    tableHeadNode,
    {
      childCount: header.length + 1,
      className: 'TableRow',
      type: VirtualDomElements.Tr,
    },
    emptyHeadingNode,
  ]
  for (const value of header) {
    dom.push(headingCellNode, text(value))
  }
  return dom
}

const renderBody = (state: Readonly<CsvViewState>): readonly VirtualDomNode[] => {
  const { cells } = state
  const dom: VirtualDomNode[] = [
    {
      childCount: cells.length,
      className: 'TableBody',
      type: VirtualDomElements.TBody,
    },
  ]
  for (let rowIndex = 0; rowIndex < cells.length; rowIndex++) {
    const row = cells[rowIndex]
    dom.push({
      childCount: row.length + 1,
      className: 'TableRow',
      type: VirtualDomElements.Tr,
    })
    dom.push(...renderCell(state, rowIndex, 0, String(rowIndex + 1), true))
    for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
      dom.push(...renderCell(state, rowIndex, columnIndex + 1, row[columnIndex]))
    }
  }
  return dom
}

const renderTextArea = (state: Readonly<CsvViewState>): VirtualDomNode => {
  const { columnIndex, rowIndex, value } = state
  const { x, y } = getTextAreaPosition(rowIndex, columnIndex)
  return {
    childCount: 0,
    className: 'TextArea',
    name: 'cellEditor',
    onInput: handleInput,
    onKeyDown: handleKeyDown,
    style: {
      left: `${x}px`,
      top: `${y}px`,
    },
    type: VirtualDomElements.TextArea,
    value,
  }
}

const renderTextAreaIfNeeded = (state: Readonly<CsvViewState>): readonly VirtualDomNode[] => {
  const { textArea } = state
  return textArea ? [renderTextArea(state)] : []
}

export const renderCsv = (state: Readonly<CsvViewState>): readonly VirtualDomNode[] => {
  const { header, textArea } = state
  return [
    {
      childCount: textArea ? 2 : 1,
      className: 'Content',
      type: VirtualDomElements.Div,
    },
    tableNode,
    ...renderHead(header),
    ...renderBody(state),
    ...renderTextAreaIfNeeded(state),
  ]
}
