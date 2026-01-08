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
  // deprecated
  'Csv.parse': ParseCsv.parseCsv,
  handleCancel: WrapCommand.wrapCommand(HandleCancel.handleCancel),
  handleClick: WrapCommand.wrapCommand(HandleClick.handleClick),
  handleDoubleClick: HandleDoubleClick.handleDoubleClick,
  handleInput: WrapCommand.wrapCommand(HandleInput.handleInput),
  handleKeyDown: WrapCommand.wrapCommand(HandleKeyDown.handleKeyDown),
  handleSubmit: WrapCommand.wrapCommand(HandleSubmit.handleSubmit),

  // new
  'WebView.create': Create2.create2,
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
