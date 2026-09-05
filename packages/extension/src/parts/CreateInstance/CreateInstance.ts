import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import { readFile, type ViewContext, type ViewEvent, type VirtualDomViewInstance } from '@lvce-editor/api'
import type { CsvViewState } from '../CsvViewState/CsvViewState.ts'
import { parseCsv } from '../ParseCsv/ParseCsv.ts'
import { getCellName, renderCsv } from '../RenderCsv/RenderCsv.ts'
import { toFileUri } from '../ToFileUri/ToFileUri.ts'

export interface CsvViewInstance extends VirtualDomViewInstance {
  readonly getComponentState: () => CsvViewState
  readonly getContext: () => Readonly<Record<string, boolean>>
  readonly handleDoubleClick: (name: unknown) => void
  readonly handleKeyDown: (name: unknown, key: unknown) => void
  readonly renderFocus: () => string
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

export const createInstanceWithReadFile = async (context: ViewContext | undefined, read: ReadFile): Promise<CsvViewInstance> => {
  const uri = getUri(context)
  const parsed = parseCsv(uri ? await read(toFileUri(uri)) : '')
  const savedState = context?.state as SavedState | undefined
  let state: CsvViewState = {
    cells: parsed.content,
    columnIndex: getSavedNumber(savedState?.columnIndex),
    focusRequest: false,
    focusSelector: '',
    header: parsed.header,
    rowIndex: getSavedNumber(savedState?.rowIndex),
    textArea: false,
    value: typeof savedState?.value === 'string' ? savedState.value : '',
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
    requestFocus(`[name="${getCellName(rowIndex, columnIndex)}"]`)
  }

  const handleCellClick = (name: unknown): void => {
    const position = parseCellName(name)
    if (position) {
      focusCell(position.rowIndex, position.columnIndex)
    }
  }

  const handleInput = (value: unknown): void => {
    if (state.textArea && typeof value === 'string') {
      updateState({ value })
    }
  }

  const cancelEdit = (): void => {
    updateState({ textArea: false })
    requestFocus(`[name="${getCellName(state.rowIndex, state.columnIndex)}"]`)
  }

  const submitEdit = (): void => {
    const { cells, columnIndex, rowIndex, value } = state
    const oldRow = cells[rowIndex]
    if (!oldRow || columnIndex <= 0 || columnIndex > oldRow.length) {
      cancelEdit()
      return
    }
    const newRow = [...oldRow]
    newRow[columnIndex - 1] = value
    const newCells = [...cells]
    newCells[rowIndex] = newRow
    updateState({ cells: newCells, textArea: false })
    requestFocus(`[name="${getCellName(rowIndex, columnIndex)}"]`)
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
        handleCellClick(event.name)
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
      const maxRowIndex = Math.max(0, cells.length - 1)
      let { columnIndex, rowIndex } = position
      switch (key) {
        case 'ArrowDown':
          rowIndex = Math.min(maxRowIndex, rowIndex + 1)
          break
        case 'ArrowLeft':
          columnIndex = Math.max(0, columnIndex - 1)
          break
        case 'ArrowRight':
          columnIndex++
          break
        case 'ArrowUp':
          rowIndex = Math.max(0, rowIndex - 1)
          break
        default:
          return
      }
      const maxColumnIndex = Math.max(0, cells[rowIndex]?.length || header.length)
      columnIndex = Math.min(maxColumnIndex, columnIndex)
      focusCell(rowIndex, columnIndex)
    },
    render(): readonly VirtualDomNode[] {
      return renderCsv(state)
    },
    renderFocus(): string {
      return state.focusSelector
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
