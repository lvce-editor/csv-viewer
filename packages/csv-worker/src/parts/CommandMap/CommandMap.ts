import * as Create from '../Create/Create.ts'
import * as GetCells from '../GetCells/GetCells.ts'
import * as GetCursor from '../GetCursor/GetCursor.ts'
import * as GetPosition from '../GetPosition/GetPosition.ts'
import * as GetTextArea from '../GetTextArea/GetTextArea.ts'
import * as GetVirtualDom from '../GetVirtualDom/GetVirtualDom.ts'
import * as HandleInput from '../HandleInput/HandleInput.ts'
import * as HandleKeyDown from '../HandleKeyDown/HandleKeyDown.ts'
import * as HandleSubmit from '../HandleSubmit/HandleSubmit.ts'
import * as ParseCsv from '../ParseCsv/ParseCsv.ts'
import * as SaveState from '../SaveState/SaveState.ts'
import * as SetCells from '../SetCells/SetCells.ts'
import * as SetCursor from '../SetCursor/SetCursor.ts'
import * as SetHeader from '../SetHeader/SetHeader.ts'
import * as SetTextArea from '../SetTextArea/SetTextArea.ts'

export const commandMap = {
  // deprecated
  'Csv.parse': ParseCsv.parseCsv,

  // new
  'WebView.create': Create.create,
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
  'WebView.setTextarea': SetTextArea.setTextArea,
}
