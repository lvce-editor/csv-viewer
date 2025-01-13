import * as Create2 from '../Create2/Create2.ts'
import * as GetCells from '../GetCells/GetCells.ts'
import * as GetCursor from '../GetCursor/GetCursor.ts'
import * as GetPosition from '../GetPosition/GetPosition.ts'
import * as GetTextArea from '../GetTextArea/GetTextArea.ts'
import * as GetVirtualDom from '../GetVirtualDom/GetVirtualDom.ts'
import * as HandleCancel from '../HandleCancel/HandleCancel.ts'
import * as HandleClick from '../HandleClick/HandleClick.ts'
import * as HandleDoubleClick from '../HandleDoubleClick/HandleDoubleClick.ts'
import * as HandleInput from '../HandleInput/HandleInput.ts'
import * as HandleKeyDown from '../HandleKeyDown/HandleKeyDown.ts'
import * as HandleSubmit from '../HandleSubmit/HandleSubmit.ts'
import * as ParseCsv from '../ParseCsv/ParseCsv.ts'
import * as SaveState from '../SaveState/SaveState.ts'
import * as SetCells from '../SetCells/SetCells.ts'
import * as SetCursor from '../SetCursor/SetCursor.ts'
import * as SetHeader from '../SetHeader/SetHeader.ts'
import * as SetSavedState from '../SetSavedState/SetSavedState.ts'
import * as SetTextArea from '../SetTextArea/SetTextArea.ts'
import * as WrapCommand from '../WrapCommand/WrapCommand.ts'

export const commandMap = {
  // new
  'WebView.create': Create2.create2,
  handleClick: WrapCommand.wrapCommand(HandleClick.handleClick),
  handleKeyDown: WrapCommand.wrapCommand(HandleKeyDown.handleKeyDown),
  handleSubmit: WrapCommand.wrapCommand(HandleSubmit.handleSubmit),
  handleCancel: WrapCommand.wrapCommand(HandleCancel.handleCancel),
  handleInput: WrapCommand.wrapCommand(HandleInput.handleInput),
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
