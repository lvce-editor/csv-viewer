import { activate as activateExtensionApi } from '@lvce-editor/api'

export const activate = async (): Promise<void> => {
  await activateExtensionApi()
}
