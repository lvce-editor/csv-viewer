import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import { readFile, writeFile, type ViewContext, type ViewEvent, type VirtualDomViewInstance } from '@lvce-editor/api'
import type { CsvViewState } from '../CsvViewState/CsvViewState.ts'
import { parseCsv, serializeCsvEdits } from '../ParseCsv/ParseCsv.ts'
import { getCellName, renderCsv } from '../RenderCsv/RenderCsv.ts'
import { toFileUri } from '../ToFileUri/ToFileUri.ts'

export interface CsvViewInstance extends VirtualDomViewInstance {
  readonly getComponentState: () => CsvViewState
  readonly getContext: () => Readonly<Record<string, boolean>>
  readonly handleDoubleClick: (name: unknown) => void
  readonly handleKeyDown: (name: unknown, key: unknown) => void
  readonly handleScroll: (scrollTop: unknown, viewportHeight: unknown, scrollLeft: unknown) => void
  readonly handleWheel: (deltaY: unknown) => void
  readonly isDirty: () => boolean
  readonly renderFocus: () => string
  readonly renderScrollPosition: () => readonly [string, number]
  readonly save: () => Promise<void>
  readonly saveState: () => unknown
  readonly setComponentState: (state: CsvViewState) => void
}

interface SavedState {
  readonly columnIndex?: unknown
  readonly rowIndex?: unknown
  readonly uri?: unknown
  readonly value?: unknown
}

type ReadFile = (uri: string) => Promise<string>

const createEmptyRow = (columnCount: number): string[] => {
  const row: string[] = []
  for (let columnIndex = 0; columnIndex < columnCount; columnIndex++) {
    row.push('')
  }
  return row
}

const parseCellName = (name: unknown): { readonly columnIndex: number; readonly rowIndex: number } | undefined => {
  if (typeof name !== 'string') {
    return undefined
  }
  const match = /^cell:(\d+):(\d+)$/.exec(name)
  if (!match) {
    return undefined
  }
  return {
    columnIndex: Number.parseInt(match[2]),
    rowIndex: Number.parseInt(match[1]),
  }
}

const getSavedNumber = (value: unknown): number => {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0 ? value : 0
}

const getUri = (context: ViewContext | undefined): string => {
  if (context && 'uri' in context && typeof context.uri === 'string') {
    return context.uri
  }
  const savedState = context?.state as SavedState | undefined
  return typeof savedState?.uri === 'string' ? savedState.uri : ''
}

const getCellValue = (state: Readonly<CsvViewState>, rowIndex: number, columnIndex: number): string => {
  if (columnIndex <= 0) {
    return ''
  }
  return state.cells[rowIndex]?.[columnIndex - 1] || ''
}

const getGrid = (
  header: readonly string[],
  cells: readonly (readonly string[])[],
): { readonly cells: readonly (readonly string[])[]; readonly header: readonly string[] } => {
  let columnCount = Math.max(1, header.length)
  for (const row of cells) {
    columnCount = Math.max(columnCount, row.length)
  }
  const normalizedHeader = Array.from({ length: columnCount }, (_, index) => {
    if (header.length > 0) {
      return header[index] || ''
    }
    return index === 0 ? 'Column 1' : ''
  })
  const normalizedCells = cells.map((row) => {
    return row.length === columnCount ? row : Array.from({ length: columnCount }, (_, index) => row[index] || '')
  })
  return { cells: normalizedCells, header: normalizedHeader }
}

const getScrollTopForRow = (rowIndex: number, scrollTop: number, viewportHeight: number): number => {
  const rowTop = (rowIndex + 1) * 20
  if (rowTop < scrollTop + 20) {
    return Math.max(0, rowIndex * 20)
  }
  const rowBottom = rowTop + 20
  if (rowBottom > scrollTop + viewportHeight) {
    return Math.max(0, rowBottom - viewportHeight)
  }
  return scrollTop
}

export const createInstanceWithReadFile = async (
  context: ViewContext | undefined,
  read: ReadFile,
  write: (uri: string, content: string) => Promise<void> = writeFile,
): Promise<CsvViewInstance> => {
  const uri = getUri(context)
  const original = uri ? await read(toFileUri(uri)) : ''
  const parsed = parseCsv(original)
  const grid = getGrid(parsed.header, parsed.content)
  let savedContent = original
  let serializedCells = grid.cells
  let serializedHeader = grid.header
  let serializedContent = original
  const savedState = context?.state as SavedState | undefined
  let state: CsvViewState = {
    cells: grid.cells,
    columnIndex: getSavedNumber(savedState?.columnIndex),
    focusRequest: false,
    focusSelector: '',
    header: grid.header,
    rowIndex: getSavedNumber(savedState?.rowIndex),
    scrollLeft: 0,
    scrollTop: 0,
    textArea: false,
    value: typeof savedState?.value === 'string' ? savedState.value : '',
    viewportHeight: 600,
  }

  const getContent = (): string => {
    if (serializedCells !== state.cells || serializedHeader !== state.header) {
      serializedContent = serializeCsvEdits(original, state.header, state.cells)
      serializedCells = state.cells
      serializedHeader = state.header
    }
    return serializedContent
  }

  const updateState = (newState: Partial<CsvViewState>): void => {
    state = {
      ...state,
      ...newState,
    }
  }

  const requestFocus = (selector: string): void => {
    updateState({
      focusRequest: !state.focusRequest,
      focusSelector: selector,
    })
  }

  const focusCell = (rowIndex: number, columnIndex: number): void => {
    updateState({ columnIndex, rowIndex, textArea: false })
    requestFocus(`[id="${getCellName(rowIndex, columnIndex)}"]`)
  }

  const handleCellClick = (name: unknown): void => {
    const position = parseCellName(name)
    if (position) {
      focusCell(position.rowIndex, position.columnIndex)
    }
  }

  const addRow = (): void => {
    const rowIndex = state.cells.length
    updateState({ cells: [...state.cells, createEmptyRow(state.header.length)] })
    focusCell(rowIndex, 1)
  }

  const addColumn = (): void => {
    const columnIndex = state.header.length
    const header = [...state.header, `Column ${columnIndex + 1}`]
    const cells = state.cells.map((row) => [...row, ''])
    updateState({ cells, header })
    focusCell(state.rowIndex, columnIndex + 1)
  }

  const handleInput = (value: unknown): void => {
    if (state.textArea && typeof value === 'string') {
      updateState({ value })
    }
  }

  const cancelEdit = (): void => {
    updateState({ textArea: false })
    requestFocus(`[id="${getCellName(state.rowIndex, state.columnIndex)}"]`)
  }

  const submitEdit = (): void => {
    const { cells, columnIndex, rowIndex, value } = state
    const oldRow = cells[rowIndex] || (rowIndex === 0 ? createEmptyRow(state.header.length) : undefined)
    if (!oldRow || columnIndex <= 0 || columnIndex > state.header.length) {
      cancelEdit()
      return
    }
    const newRow = [...oldRow]
    newRow[columnIndex - 1] = value
    const newCells = [...cells]
    newCells[rowIndex] = newRow
    updateState({ cells: newCells, textArea: false })
    requestFocus(`[id="${getCellName(rowIndex, columnIndex)}"]`)
  }

  const clearCell = (rowIndex: number, columnIndex: number): void => {
    const { cells } = state
    const oldRow = cells[rowIndex]
    if (!oldRow || columnIndex <= 0 || columnIndex > oldRow.length) {
      return
    }
    if (oldRow[columnIndex - 1] === '') {
      return
    }
    const newRow = [...oldRow]
    newRow[columnIndex - 1] = ''
    const newCells = [...cells]
    newCells[rowIndex] = newRow
    updateState({ cells: newCells, textArea: false })
    focusCell(rowIndex, columnIndex)
  }

  return {
    getComponentState(): CsvViewState {
      return state
    },
    getContext(): Readonly<Record<string, boolean>> {
      return { csvViewerFocusRequest: state.focusRequest }
    },
    handleDoubleClick(name: unknown): void {
      const position = parseCellName(name)
      if (!position || position.columnIndex <= 0) {
        return
      }
      updateState({
        columnIndex: position.columnIndex,
        rowIndex: position.rowIndex,
        textArea: true,
        value: getCellValue(state, position.rowIndex, position.columnIndex),
      })
      requestFocus('[name="cellEditor"]')
    },
    handleEvent(event: Readonly<ViewEvent>): void {
      if (event.type === 'click') {
        if (event.name === 'addRow') {
          addRow()
        } else if (event.name === 'addColumn') {
          addColumn()
        } else {
          handleCellClick(event.name)
        }
      } else if (event.type === 'input') {
        handleInput(event.value)
      }
    },
    handleKeyDown(name: unknown, key: unknown): void {
      if (typeof key !== 'string') {
        return
      }
      if (name === 'cellEditor') {
        if (key === 'Enter') {
          submitEdit()
        } else if (key === 'Escape') {
          cancelEdit()
        }
        return
      }
      const position = parseCellName(name)
      if (!position) {
        return
      }
      const { cells, header } = state
      const maxRowIndex = cells.length - 1
      let { columnIndex, rowIndex } = position
      switch (key) {
        case 'ArrowDown':
          rowIndex = Math.min(maxRowIndex, rowIndex + 1)
          break
        case 'ArrowLeft':
          columnIndex = Math.max(0, columnIndex - 1)
          break
        case 'ArrowRight':
          columnIndex = Math.min(header.length, columnIndex + 1)
          break
        case 'ArrowUp':
          rowIndex = Math.max(0, rowIndex - 1)
          break
        case 'Backspace':
        case 'Delete':
          clearCell(rowIndex, columnIndex)
          return
        default:
          return
      }
      columnIndex = Math.min(header.length, Math.max(1, columnIndex))
      const nextScrollTop = getScrollTopForRow(rowIndex, state.scrollTop, state.viewportHeight)
      updateState({ scrollTop: nextScrollTop })
      focusCell(rowIndex, columnIndex)
    },
    handleScroll(scrollTop: unknown, viewportHeight: unknown, scrollLeft: unknown): void {
      if (typeof scrollTop !== 'number' || typeof viewportHeight !== 'number' || typeof scrollLeft !== 'number') {
        return
      }
      updateState({ scrollLeft, scrollTop, viewportHeight })
    },
    handleWheel(deltaY: unknown): void {
      if (typeof deltaY !== 'number' || !Number.isFinite(deltaY)) {
        return
      }
      const maxScrollTop = Math.max(0, Math.max(1, state.cells.length) * 20 - state.viewportHeight)
      const scrollTop = Math.min(Math.max(state.scrollTop + deltaY, 0), maxScrollTop)
      updateState({ scrollTop })
    },
    isDirty(): boolean {
      return getContent() !== savedContent
    },
    render(): readonly VirtualDomNode[] {
      return renderCsv(state)
    },
    renderFocus(): string {
      return state.focusSelector
    },
    renderScrollPosition(): readonly [string, number] {
      return ['.ScrollContainer', state.scrollTop]
    },
    async save(): Promise<void> {
      const content = getContent()
      if (content === savedContent) {
        return
      }
      if (!uri) {
        throw new Error('Cannot save a CSV document without a URI')
      }
      await write(toFileUri(uri), content)
      savedContent = content
    },
    saveState(): unknown {
      return {
        columnIndex: state.columnIndex,
        rowIndex: state.rowIndex,
        uri,
        value: state.value,
      }
    },
    setComponentState(newState: CsvViewState): void {
      state = newState
    },
  }
}

export const createInstance = (context?: ViewContext): Promise<CsvViewInstance> => {
  return createInstanceWithReadFile(context, readFile)
}
