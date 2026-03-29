export const locations = [
  {
    id: 1,
    name: 'Пруд',
    background: '/img/pond.jpg',
    fish: ['crucian', 'perch', 'carp'],
    areas: [
      {
        id: 1,
        name: 'Камыши',
        x: 12,
        y: 60,
        width: 18,
        height: 14,
        bonus: 0.2
      },
      {
        id: 2,
        name: 'Тихая вода',
        x: 38,
        y: 68,
        width: 20,
        height: 14,
        bonus: 0.25
      },
      {
        id: 3,
        name: 'Старый мостик',
        x: 68,
        y: 58,
        width: 18,
        height: 14,
        bonus: 0.3
      }
    ]
  },
  {
    id: 2,
    name: 'Река',
    background: '/img/river.jpg',
    fish: ['pike', 'roach', 'perch'],
    areas: [
      {
        id: 1,
        name: 'Заводь',
        x: 15,
        y: 66,
        width: 20,
        height: 14,
        bonus: 0.22
      },
      {
        id: 2,
        name: 'Под корягой',
        x: 44,
        y: 58,
        width: 18,
        height: 16,
        bonus: 0.28
      },
      {
        id: 3,
        name: 'У берега',
        x: 70,
        y: 70,
        width: 18,
        height: 12,
        bonus: 0.18
      }
    ]
  },
  {
    id: 3,
    name: 'Озеро',
    background: '/img/lake.jpg',
    fish: ['bream', 'zander', 'crucian'],
    areas: [
      {
        id: 1,
        name: 'Глубина',
        x: 18,
        y: 62,
        width: 18,
        height: 16,
        bonus: 0.26
      },
      {
        id: 2,
        name: 'Причал',
        x: 42,
        y: 72,
        width: 18,
        height: 12,
        bonus: 0.2
      },
      {
        id: 3,
        name: 'Яма',
        x: 66,
        y: 60,
        width: 20,
        height: 16,
        bonus: 0.32
      }
    ]
  }
]

export const fishCatalog = {
  crucian: {
    key: 'crucian',
    name: 'Карась',
    minSize: 200,
    maxSize: 1200,
    price: 4,
    difficulty: 1,
    baits: ['bread', 'worm']
  },
  perch: {
    key: 'perch',
    name: 'Окунь',
    minSize: 250,
    maxSize: 1400,
    price: 5,
    difficulty: 1.2,
    baits: ['worm', 'spoon']
  },
  carp: {
    key: 'carp',
    name: 'Карп',
    minSize: 1200,
    maxSize: 7000,
    price: 7,
    difficulty: 2,
    baits: ['bread', 'worm']
  },
  pike: {
    key: 'pike',
    name: 'Щука',
    minSize: 1800,
    maxSize: 9000,
    price: 9,
    difficulty: 2.4,
    baits: ['spoon']
  },
  roach: {
    key: 'roach',
    name: 'Плотва',
    minSize: 150,
    maxSize: 900,
    price: 3,
    difficulty: 0.9,
    baits: ['bread', 'worm']
  },
  bream: {
    key: 'bream',
    name: 'Лещ',
    minSize: 700,
    maxSize: 5000,
    price: 6,
    difficulty: 1.7,
    baits: ['bread', 'worm']
  },
  zander: {
    key: 'zander',
    name: 'Судак',
    minSize: 1400,
    maxSize: 7500,
    price: 8,
    difficulty: 2.1,
    baits: ['spoon']
  }
}