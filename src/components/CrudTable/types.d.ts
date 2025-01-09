export interface ISearchColumns {
  label: string
  field: string
  type?: 'a-input' | 'a-select' | 'a-range-picker'
  dictData?: any
  dictDataOption?: IDictDataOption
  disabled?: boolean
  onChange?: any
}

export interface IDictDataOption {
  label?: string
  value?: string
}
