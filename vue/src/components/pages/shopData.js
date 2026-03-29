export const rods = [
  {
    id: 1,
    key: 'basic_rod',
    name: 'Базовая удочка',
    price: 0,
    power: 1
  },
  {
    id: 2,
    key: 'light_rod',
    name: 'Легкая удочка',
    price: 60,
    power: 2
  },
  {
    id: 3,
    key: 'strong_rod',
    name: 'Крепкая удочка',
    price: 120,
    power: 3
  }
]

export const lines = [
  {
    id: 1,
    key: 'thin_line',
    name: 'Тонкая леска',
    price: 20,
    power: 1
  },
  {
    id: 2,
    key: 'normal_line',
    name: 'Обычная леска',
    price: 45,
    power: 2
  },
  {
    id: 3,
    key: 'strong_line',
    name: 'Прочная леска',
    price: 80,
    power: 3
  }
]

export const reels = [
  {
    id: 1,
    key: 'simple_reel',
    name: 'Простая катушка',
    price: 25,
    power: 1
  },
  {
    id: 2,
    key: 'stable_reel',
    name: 'Надежная катушка',
    price: 55,
    power: 2
  },
  {
    id: 3,
    key: 'power_reel',
    name: 'Усиленная катушка',
    price: 95,
    power: 3
  }
]

export const baits = [
  {
    id: 1,
    key: 'bread',
    name: 'Хлеб',
    price: 5
  },
  {
    id: 2,
    key: 'worm',
    name: 'Червь',
    price: 10
  },
  {
    id: 3,
    key: 'spoon',
    name: 'Блесна',
    price: 20
  }
]

export const groundBaits = [
  {
    id: 1,
    key: 'carp_ground',
    name: 'Карповая смесь',
    price: 35,
    targetFish: ['carp', 'crucian'],
    targetFishNames: ['Карп', 'Карась']
  },
  {
    id: 2,
    key: 'predator_ground',
    name: 'Хищная смесь',
    price: 45,
    targetFish: ['pike', 'zander', 'perch'],
    targetFishNames: ['Щука', 'Судак', 'Окунь']
  },
  {
    id: 3,
    key: 'universal_ground',
    name: 'Универсальная смесь',
    price: 30,
    targetFish: ['crucian', 'roach', 'bream'],
    targetFishNames: ['Карась', 'Плотва', 'Лещ']
  }
]

export const nets = [
  {
    id: 1,
    key: 'small_net',
    name: 'Малый сачок',
    price: 40,
    weightLimit: 3
  },
  {
    id: 2,
    key: 'medium_net',
    name: 'Средний сачок',
    price: 75,
    weightLimit: 6
  },
  {
    id: 3,
    key: 'big_net',
    name: 'Большой сачок',
    price: 120,
    weightLimit: 10
  }
]