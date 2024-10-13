import * as GetCsvVirtualDom from '../GetCsvVirtualDom/GetCsvVirtualDom.ts'
import * as ParseCsv from '../ParseCsv/ParseCsv.ts'
import * as WebView from '../WebView/WebView.ts'

export const commandMap = {
  'Csv.parse': ParseCsv.parseCsv,
  'Csv.getVirtualDom': GetCsvVirtualDom.getCsvVirtualDom,
  'WebView.create': WebView.create,
  'WebView.setCursor': WebView.setCursor,
  'WebView.getCursor': WebView.getCursor,
  'WebView.handleKeyDown': WebView.handleKeyDown,
  'WebView.setTextarea': WebView.setTextArea,
}
