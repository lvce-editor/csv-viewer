import * as SetTextArea from '../SetTextArea/SetTextArea.ts'

export const handleCancel = (id: number) => {
  SetTextArea.setTextArea(id, false)
}
