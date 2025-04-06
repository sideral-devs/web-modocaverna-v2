import { KeyboardEventHandler } from 'react'
import CreatableSelect from 'react-select/creatable'
import {
  StylesConfig,
  ControlProps,
  GroupBase,
  CSSObjectWithLabel,
} from 'react-select'

// Defina a interface para as opções do select
interface Option {
  readonly label: string
  readonly value: string
}

// Estilos personalizados para o CreatableSelect
const customStyles: StylesConfig<Option, true, GroupBase<Option>> = {
  control: (
    baseStyles: CSSObjectWithLabel,
    state: ControlProps<Option, true, GroupBase<Option>>,
  ) => ({
    ...baseStyles,
    borderColor: state.isFocused ? 'white' : 'none',
    backgroundColor: 'rgb(39 39 42)',
    color: 'white',
  }),
  input: (baseStyles: CSSObjectWithLabel) => ({
    ...baseStyles,
    color: 'white',
  }),
  option: (baseStyles: CSSObjectWithLabel) => ({
    ...baseStyles,
    backgroundColor: 'red',
    color: 'white',
  }),
  multiValueLabel: (baseStyles: CSSObjectWithLabel) => ({
    ...baseStyles,
    color: 'white',
    backgroundColor: 'rgb(39 39 42)',
    border: '5px',
    padding: '10px 20px',
    fontSize: '0.875rem',
  }),
  multiValueRemove: (baseStyles: CSSObjectWithLabel) => ({
    ...baseStyles,
    color: 'white',
    backgroundColor: 'rgb(39 39 42)',
    padding: '10px',
    ':hover': {
      cursor: 'pointer',
    },
  }),
  multiValue: (baseStyles: CSSObjectWithLabel) => ({
    ...baseStyles,
    margin: '5px',
  }),
}

interface CategorySelectProps {
  inputValue: string
  valueSelect: readonly Option[]
  onInputChange: (newValue: string) => void
  onChange: (newValue: readonly Option[]) => void
  onBlur: () => void
  onKeyDown: KeyboardEventHandler
  placeholder?: string
}

/**
 * Componente `CategorySelect` para seleção de categorias com criação de novas opções.
 *
 * @param {string} inputValue - Valor atual do campo de input.
 * @param {readonly Option[]} valueSelect - Opções selecionadas.
 * @param {(newValue: string) => void} onInputChange - Função chamada quando o valor do input muda.
 * @param {(newValue: readonly Option[]) => void} onChange - Função chamada quando as opções selecionadas mudam.
 * @param {KeyboardEventHandler} onKeyDown - Função chamada ao pressionar uma tecla.
 * @param {string} [placeholder="Type something and press enter..."] - Texto de placeholder.
 */
export function CategorySelect({
  inputValue,
  valueSelect,
  onInputChange,
  onBlur,
  onChange,
  onKeyDown,
  placeholder = 'Type something and press enter...',
}: CategorySelectProps) {
  return (
    <CreatableSelect
      styles={customStyles}
      components={{ DropdownIndicator: null }}
      inputValue={inputValue}
      isClearable
      isMulti
      menuIsOpen={false}
      onChange={onChange}
      onInputChange={onInputChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      value={valueSelect}
      onBlur={onBlur}
    />
  )
}
