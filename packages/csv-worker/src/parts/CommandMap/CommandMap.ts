import * as Create from '../Create/Create.ts'
import * as GetCsvVirtualDom from '../GetCsvVirtualDom/GetCsvVirtualDom.ts'
import * as GetCursor from '../GetCursor/GetCursor.ts'
import * as GetPosition from '../GetPosition/GetPosition.ts'
import * as HandleKeyDown from '../HandleKeyDown/HandleKeyDown.ts'
import * as ParseCsv from '../ParseCsv/ParseCsv.ts'
import * as SetCells from '../SetCells/SetCells.ts'
import * as SetCursor from '../SetCursor/SetCursor.ts'
import * as SetTextArea from '../SetTextArea/SetTextArea.ts'

export const commandMap = {
  'Csv.getVirtualDom': GetCsvVirtualDom.getCsvVirtualDom,
  'Csv.parse': ParseCsv.parseCsv,
  'WebView.create': Create.create,
  'WebView.getCursor': GetCursor.getCursor,
  'WebView.getPosition': GetPosition.getPosition,
  'WebView.handleKeyDown': HandleKeyDown.handleKeyDown,
  'WebView.setCursor': SetCursor.setCursor,
  'WebView.setTextarea': SetTextArea.setTextArea,
  'WebView.setCells': SetCells.setCells,
}
