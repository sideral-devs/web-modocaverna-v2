import { Categories } from 'emoji-picker-react'

export const emojiCategories: { category: Categories; name: string }[] = [
  {
    category: Categories.SUGGESTED,
    name: 'Recentes',
  },
  {
    category: Categories.SMILEYS_PEOPLE,
    name: 'Carinhas',
  },
  {
    category: Categories.ANIMALS_NATURE,
    name: 'Animais e Natureza',
  },
  {
    category: Categories.FOOD_DRINK,
    name: 'Comidas e Bebidas',
  },
  {
    category: Categories.TRAVEL_PLACES,
    name: 'Viagens e Lugares',
  },
  {
    category: Categories.ACTIVITIES,
    name: 'Atividades',
  },
  {
    category: Categories.OBJECTS,
    name: 'Objetos',
  },
  {
    category: Categories.SYMBOLS,
    name: 'Símbolos',
  },
  {
    category: Categories.FLAGS,
    name: 'Bandeiras',
  },
]

export const bannedEmojis: string[] = ['1f595']
