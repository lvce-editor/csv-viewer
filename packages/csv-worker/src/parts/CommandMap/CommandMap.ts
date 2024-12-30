import * as Create2 from '../Create2/Create2.ts'
import * as GetCells from '../GetCells/GetCells.ts'
import * as GetCursor from '../GetCursor/GetCursor.ts'
import * as GetPosition from '../GetPosition/GetPosition.ts'
import * as GetTextArea from '../GetTextArea/GetTextArea.ts'
import * as GetVirtualDom from '../GetVirtualDom/GetVirtualDom.ts'
import * as HandleCancel from '../HandleCancel/HandleCancel.ts'
import * as HandleClick from '../HandleClick/HandleClick.ts'
import * as HandleInput from '../HandleInput/HandleInput.ts'
import * as HandleKeyDown from '../HandleKeyDown/HandleKeyDown.ts'
import * as HandleSubmit from '../HandleSubmit/HandleSubmit.ts'
import * as ParseCsv from '../ParseCsv/ParseCsv.ts'
import * as SaveState from '../SaveState/SaveState.ts'
import * as SetCells from '../SetCells/SetCells.ts'
import * as HandleDoubleClick from '../HandleDoubleClick/HandleDoubleClick.ts'
import * as SetCursor from '../SetCursor/SetCursor.ts'
import * as SetHeader from '../SetHeader/SetHeader.ts'
import * as SetSavedState from '../SetSavedState/SetSavedState.ts'
import * as SetTextArea from '../SetTextArea/SetTextArea.ts'
import { id } from '../Id/Id.ts'
import * as WebViewStates from '../WebViewStates/WebViewStates.ts'

const wrapCommand = (fn) => {
  return async (...args) => {
    await fn(id, ...args)
    const newState = WebViewStates.get(id)
    const { port } = newState
    const dom = GetVirtualDom.getVirtualDom(id)
    await port.invoke('setDom', dom)
  }
}

export const commandMap = {
  // new
  'WebView.create': Create2.create2,
  handleClick: wrapCommand(HandleClick.handleClick),
  handleKeyDown: wrapCommand(HandleKeyDown.handleKeyDown),
  handleSubmit: wrapCommand(HandleSubmit.handleSubmit),
  handleCancel: wrapCommand(HandleCancel.handleCancel),
  handleInput: wrapCommand(HandleInput.handleInput),
  handleDoubleClick: HandleDoubleClick.handleDoubleClick,

  // deprecated
  'Csv.parse': ParseCsv.parseCsv,
  'WebView.getCells': GetCells.getCells,
  'WebView.getCursor': GetCursor.getCursor,
  'WebView.getPosition': GetPosition.getPosition,
  'WebView.getTextArea': GetTextArea.getTextArea,
  'WebView.getVirtualDom': GetVirtualDom.getVirtualDom,
  'WebView.handleInput': HandleInput.handleInput,
  'WebView.handleKeyDown': HandleKeyDown.handleKeyDown,
  'WebView.handleSubmit': HandleSubmit.handleSubmit,
  'WebView.saveState': SaveState.saveState,
  'WebView.setCells': SetCells.setCells,
  'WebView.setCursor': SetCursor.setCursor,
  'WebView.setHeader': SetHeader.setHeader,
  'WebView.setSavedState': SetSavedState.setSavedState,
  'WebView.setTextarea': SetTextArea.setTextArea,
}
