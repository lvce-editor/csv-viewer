import * as GetCsvVirtualDom from '../GetCsvVirtualDom/GetCsvVirtualDom.ts'
import * as GetPosition from '../GetPosition/GetPosition.ts'
import * as ParseCsv from '../ParseCsv/ParseCsv.ts'
import * as WebView from '../WebView/WebView.ts'

export const commandMap = {
  'Csv.getVirtualDom': GetCsvVirtualDom.getCsvVirtualDom,
  'Csv.parse': ParseCsv.parseCsv,
  'WebView.create': WebView.create,
  'WebView.getCursor': WebView.getCursor,
  'WebView.getPosition': GetPosition.getPosition,
  'WebView.handleKeyDown': WebView.handleKeyDown,
  'WebView.setCursor': WebView.setCursor,
  'WebView.setTextarea': WebView.setTextArea,
}
