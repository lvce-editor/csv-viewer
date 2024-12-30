import * as Create from '../Create/Create.ts'
import * as GetVirtualDom from '../GetVirtualDom/GetVirtualDom.ts'
import { id } from '../Id/Id.ts'
import * as ParseCsv from '../ParseCsv/ParseCsv.ts'
import * as Rpc from '../Rpc/Rpc.ts'
import * as SetCells from '../SetCells/SetCells.ts'
import * as SetHeader from '../SetHeader/SetHeader.ts'
import * as SetSavedState from '../SetSavedState/SetSavedState.ts'

export const create2 = async ({ port, savedState, webViewId, uri }) => {
  const content = await Rpc.invoke('WebView.readFile', uri)
  const parsed = ParseCsv.parseCsv(content)

  Create.create(id)
  SetSavedState.setSavedState(id, savedState)
  SetHeader.setHeader(id, parsed.header)
  SetCells.setCells(id, parsed.content)

  const dom = GetVirtualDom.getVirtualDom(id)
  await port.invoke('initialize', dom)
  return {}
}
