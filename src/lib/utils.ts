import { clsx, type ClassValue } from 'clsx'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import relativeTime from 'dayjs/plugin/relativeTime'
import { twMerge } from 'tailwind-merge'

dayjs.extend(relativeTime)
dayjs.locale('pt-br')

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMoney(curr: number, order?: 'K' | 'M'): string {
  const formatted = new Intl.NumberFormat('pt-BR', {
    currency: 'BRL',
    style: 'currency',
  }).format(curr)

  if (order === 'K' && curr >= 1000) {
    return `R$ ${(curr / 1000).toFixed(1)}K`
  }

  if (order === 'M') {
    return curr >= 1000000
      ? `R$ ${(curr / 1000000).toFixed(2)}M`
      : formatMoney(curr, 'K')
  }

  return formatted
}

export function parseMoney(value: string) {
  if (typeof value !== 'string') return 0

  const numericString = value
    .replace(/R\$\s?/, '')
    .replace(/\./g, '')
    .replace(/,/g, '.')

  const number = parseFloat(numericString)

  return isNaN(number) ? 0 : number
}

export function dateMask(value: string) {
  const cleanedValue = value.replace(/\D/g, '')
  const day = cleanedValue.slice(0, 2)
  const month = cleanedValue.slice(2, 4)
  const year = cleanedValue.slice(4, 8)
  let formattedDate = ''

  if (day) formattedDate = day
  if (month) formattedDate += `/${month}`
  if (year) formattedDate += `/${year}`

  return formattedDate
}

export function moneyMask(value: string) {
  const cleanedValue = value.replace(/\D/g, '')
  const numberValue = (parseInt(cleanedValue, 10) / 100).toFixed(2)
  return numberValue.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}
export function removeMask(value: string) {
  return value
    .replaceAll(' ', '')
    .replaceAll('.', '')
    .replaceAll('-', '')
    .replaceAll('(', '')
    .replaceAll(')', '')
}

export function cpfMask(value: string) {
  return value
    .replace(/\D/g, '') // substitui qualquer caracter que nao seja numero por nada
    .replace(/(\d{3})(\d)/, '$1.$2') // captura 2 grupos de numero o primeiro de 3 e o segundo de 1, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de numero
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1') // captura 2 numeros seguidos de um traço e não deixa ser digitado mais nada
}

export function cepMask(value: string) {
  if (!value) return ''
  return value.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2')
}

export function cellphoneMask(value: string, countryCode?: string) {
  if (countryCode === 'BR') {
    return value
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d{1,4})$/, '$1-$2')
  }

  return value
    .replace(/\D/g, '')
    .replace(/^(\d)/, '($1')
    .replace(/^(\(\d{2})(\d)/, '$1) $2')
    .replace(/(\d{5})(\d{1,4})/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1')
}

export function timeMask(value: string) {
  if (!value) return ''
  return value
    .replace(/\D/g, '')
    .slice(0, 4)
    .replace(/(\d{2})(\d)/, '$1:$2')
}

export function ddiMask(value: string) {
  return value
    .replace(/\D/g, '') // Remove tudo que não é dígito
    .replace(/^(\d{1,3})/, '+$1') // Adiciona o + na frente do DDI
}

export function formatTimeAgo(date: string) {
  const formatted = dayjs(date)

  if (!formatted.isValid()) {
    return '* atrás'
  }

  return formatted.fromNow()
}

export function twoDigitsMask(value: string) {
  let inputValue = value.replace(/\D/g, '')
  inputValue = inputValue.slice(-2)

  while (inputValue.length < 2) {
    inputValue = '0' + inputValue
  }

  return inputValue
}
