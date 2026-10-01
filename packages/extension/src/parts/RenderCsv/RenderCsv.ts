import { mergeClassNames, text, VirtualDomElements, type VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import type { CsvRow, CsvViewState } from '../CsvViewState/CsvViewState.ts'
import { getTextAreaPosition } from '../GetTextAreaPosition/GetTextAreaPosition.ts'

const handleDoubleClick = 'handleDoubleClick'
const handleInput = 'handleInput'
const handleKeyDown = 'handleKeyDown'
const handleClick = 'handleClick'
const rowHeight = 20
const overscan = 50

const createEmptyRow = (columnCount: number): string[] => {
  const row: string[] = []
  for (let columnIndex = 0; columnIndex < columnCount; columnIndex++) {
    row.push('')
  }
  return row
}

const TabIndex = {
  Focusable: 0,
  Programmatic: -1,
} as const

const tableHeadNode: VirtualDomNode = {
  childCount: 1,
  className: 'TableHead',
  type: VirtualDomElements.Div,
}

const emptyHeadingNode: VirtualDomNode = {
  childCount: 0,
  className: mergeClassNames('TableHeading', 'TableCellInfo'),
  type: VirtualDomElements.Div,
}

const headingCellNode: VirtualDomNode = {
  childCount: 1,
  className: mergeClassNames('TableHeading', 'TableCell'),
  type: VirtualDomElements.Div,
}

const tableNode: VirtualDomNode = {
  childCount: 2,
  className: 'Table',
  type: VirtualDomElements.Div,
}

const scrollContainerNode: VirtualDomNode = {
  childCount: 1,
  className: 'ScrollContainer',
  type: VirtualDomElements.Div,
}

const gridActionsNode: VirtualDomNode = {
  childCount: 2,
  className: 'GridActions',
  type: VirtualDomElements.Div,
}

const addRowButtonNode: VirtualDomNode = {
  childCount: 1,
  name: 'addRow',
  onClick: handleClick,
  type: VirtualDomElements.Button,
}

const addColumnButtonNode: VirtualDomNode = {
  childCount: 1,
  name: 'addColumn',
  onClick: handleClick,
  type: VirtualDomElements.Button,
}

const getVisibleRows = (state: Readonly<CsvViewState>): { readonly end: number; readonly start: number } => {
  const { cells, scrollTop, viewportHeight } = state
  const rowCount = Math.max(1, cells.length)
  const maxScrollTop = Math.max(0, rowCount * rowHeight - viewportHeight)
  const clampedScrollTop = Math.min(Math.max(scrollTop, 0), maxScrollTop)
  const start = Math.min(rowCount, Math.max(0, Math.floor(clampedScrollTop / rowHeight) - overscan))
  const end = Math.min(rowCount, Math.ceil((clampedScrollTop + viewportHeight) / rowHeight) + overscan)
  return { end: Math.max(start, end), start }
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
      // The constants package does not export the valid ARIA gridcell role.
      // eslint-disable-next-line virtual-dom/prefer-constants
      role: 'gridcell',
      tabIndex: focused ? TabIndex.Focusable : TabIndex.Programmatic,
      type: VirtualDomElements.Div,
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
      type: VirtualDomElements.Div,
    },
    emptyHeadingNode,
  ]
  for (const value of header) {
    dom.push(headingCellNode, text(value))
  }
  return dom
}

const renderBody = (state: Readonly<CsvViewState>): readonly VirtualDomNode[] => {
  const { cells, header } = state
  const { end, start } = getVisibleRows(state)
  const rowCount = Math.max(1, cells.length)
  const dom: VirtualDomNode[] = [
    {
      childCount: end - start,
      className: 'TableBody',
      style: `height: ${rowCount * rowHeight}px; position: relative;`,
      type: VirtualDomElements.Div,
    },
  ]
  for (let rowIndex = start; rowIndex < end; rowIndex++) {
    const row = cells[rowIndex] || createEmptyRow(header.length)
    dom.push({
      childCount: row.length + 1,
      className: 'TableRow',
      style: `position: absolute; top: ${rowIndex * rowHeight}px;`,
      type: VirtualDomElements.Div,
    })
    dom.push(...renderCell(state, rowIndex, 0, String(rowIndex + 1), true))
    for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
      dom.push(...renderCell(state, rowIndex, columnIndex + 1, row[columnIndex]))
    }
  }
  return dom
}

const renderTextArea = (state: Readonly<CsvViewState>): VirtualDomNode => {
  const { columnIndex, rowIndex, scrollLeft, scrollTop, value } = state
  const { x, y } = getTextAreaPosition(rowIndex, columnIndex, scrollLeft, scrollTop)
  return {
    childCount: 0,
    className: 'TextArea',
    name: 'cellEditor',
    onInput: handleInput,
    onKeyDown: handleKeyDown,
    style: `left: ${x}px; top: ${y}px;`,
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
      childCount: textArea ? 3 : 2,
      className: 'Content',
      type: VirtualDomElements.Div,
    },
    gridActionsNode,
    addRowButtonNode,
    text('Add row'),
    addColumnButtonNode,
    text('Add column'),
    scrollContainerNode,
    tableNode,
    ...renderHead(header),
    ...renderBody(state),
    ...renderTextAreaIfNeeded(state),
  ]
}
