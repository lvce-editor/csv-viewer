import * as GetCsvVirtualDom from '../GetCsvVirtualDom/GetCsvVirtualDom.ts'
import * as ParseCsv from '../ParseCsv/ParseCsv.ts'

export const commandMap = {
  'Csv.parse': ParseCsv.parseCsv,
  'Csv.getVirtualDom': GetCsvVirtualDom.getCsvVirtualDom,
}
