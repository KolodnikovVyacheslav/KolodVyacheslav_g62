<template>
  <div class="index">
    <div class="index__container">
      <div class="index__header">
        <div class="index__title">Русская рыбалка</div>
      </div>

      <LocationSelector :locations="locations" :selected="selectedLocation"
        @change-location="(location) => changeLocation(location)" />

      <div class="index__equipment">
        <div class="index__equipment-title">Текущая снасть</div>
        <div class="index__equipment-row">
          <span class="index__equipment-label">Удочка:</span>
          <span class="index__equipment-value">{{ currentRodName }}</span>
        </div>
        <div class="index__equipment-row">
          <span class="index__equipment-label">Леска:</span>
          <span class="index__equipment-value">{{ currentLineName }}</span>
        </div>
        <div class="index__equipment-row">
          <span class="index__equipment-label">Катушка:</span>
          <span class="index__equipment-value">{{ currentReelName }}</span>
        </div>
        <div class="index__equipment-row">
          <span class="index__equipment-label">Наживка:</span>
          <span class="index__equipment-value">{{ currentBaitName }}</span>
        </div>
      </div>

      <div class="index__menu">
        <button class="index__menu-button" @click="() => setActiveMenu('shop')">
          Магазин
        </button>

        <button class="index__menu-button" @click="() => setActiveMenu('inventory')">
          Инвентарь
        </button>

        <button class="index__menu-button" @click="() => setActiveMenu('none')">
          Закрыть
        </button>
      </div>

      <div v-if="activeMenu === 'shop'" class="index__panel">
        <ShopPanel :money="money" :rods="rods" :lines="lines" :reels="reels" :baits="baits" :shop-message="shopMessage"
          @buy-item="(item, category) => buyItem(item, category)" />
      </div>

      <div v-if="activeMenu === 'inventory'" class="index__panel">
        <InventoryPanel :inventory="inventory" :selected-rod="selectedRod" :selected-line="selectedLine"
          :selected-reel="selectedReel" :selected-bait="selectedBait" @select-rod="(item) => selectRod(item)"
          @select-line="(item) => selectLine(item)" @select-reel="(item) => selectReel(item)"
          @select-bait="(item) => selectBait(item)" @sell-item="(payload) => sellItem(payload)"
          @sell-fish="(index) => sellFish(index)" @sell-all-fish="() => sellAllFish()" />
      </div>

      <div v-if="activeArea" class="index__area-info">
        Выгодная область: {{ activeArea.name }}
      </div>

      <FishingArea :background="currentLocation.background" :message="message" :is-fishing="isFishing"
        :is-waiting-bite="isWaitingBite" :is-fish-hooked="isFishHooked" :float-x="floatX" :float-y="floatY"
        :rod-load="rodLoad" :fish-distance="fishDistance" :active-area="activeArea"
        @cast="(position) => handleCast(position)" @start-pull="() => handleStartPull()"
        @stop-pull="() => handleStopPull()" @error="(message) => showError(message)" />

      <BiteIndicator :last-catch="lastCatch" :catch-history="catchHistory" />

      <div v-if="shopMessage" class="index__shop-message">
        {{ shopMessage }}
      </div>

      <div v-if="errorMessage" class="index__error">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script>

import LocationSelector from './LocationSelector.vue'
import FishingArea from './FishingArea.vue'
import BiteIndicator from './BiteIndicator.vue'
import ShopPanel from './ShopPanel.vue'
import InventoryPanel from './InventoryPanel.vue'

export default {
  name: 'IndexPage',
  components: {
    LocationSelector,
    FishingArea,
    BiteIndicator,
    ShopPanel,
    InventoryPanel
  },
  data() {
    return {
      locations: [
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
      ],
      fishCatalog: {
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
      },
      selectedLocation: null,
      activeArea: null,
      activeMenu: 'none',
      money: 220,
      rods: [
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
      ],
      lines: [
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
      ],
      reels: [
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
      ],
      baits: [
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
      ],
      inventory: {
        rods: [],
        lines: [
          {
            id: 1,
            key: 'thin_line',
            name: 'Тонкая леска',
            price: 20,
            power: 1
          }
        ],
        reels: [
          {
            id: 1,
            key: 'simple_reel',
            name: 'Простая катушка',
            price: 25,
            power: 1
          }
        ],
        baits: [
          {
            id: 1,
            key: 'bread',
            name: 'Хлеб',
            price: 5,
            count: 4
          },
          {
            id: 2,
            key: 'worm',
            name: 'Червь',
            price: 10,
            count: 2
          }
        ],
        fish: []
      },
      selectedRod: null,
      selectedLine: null,
      selectedReel: null,
      selectedBait: null,
      shopMessage: '',
      isFishing: false,
      isWaitingBite: false,
      isFishHooked: false,
      isPulling: false,
      floatX: 0,
      floatY: 0,
      rodLoad: 0,
      fishDistance: 0,
      currentFish: null,
      currentFishStrength: 0,
      currentCastAreaBonus: 0,
      currentBaitKey: '',
      lastCatch: '',
      catchHistory: [],
      message: 'Кликни по воде чтобы забросить',
      errorMessage: '',
      biteTimeout: null,
      fishInterval: null,
      pullInterval: null,
      loadInterval: null,
      fishPowerInterval: null
    }
  },
  computed: {
    currentLocation() {
      if (this.selectedLocation) {
        return this.selectedLocation
      }

      return this.locations[0]
    },

    currentRodName() {
      if (this.selectedRod) {
        return this.selectedRod.name
      }

      return 'Не выбрана'
    },

    currentLineName() {
      if (this.selectedLine) {
        return this.selectedLine.name
      }

      return 'Не выбрана'
    },

    currentReelName() {
      if (this.selectedReel) {
        return this.selectedReel.name
      }

      return 'Не выбрана'
    },

    currentBaitName() {
      if (this.selectedBait) {
        return this.selectedBait.name + ' (' + this.selectedBait.count + ')'
      }

      return 'Не выбрана'
    }
  },
  methods: {
    showError(message) {
      this.errorMessage = message

      setTimeout(() => {
        this.errorMessage = ''
      }, 2200)
    },

    showShopMessage(message) {
      this.shopMessage = message

      setTimeout(() => {
        this.shopMessage = ''
      }, 2200)
    },

    setActiveMenu(menu) {
      this.activeMenu = menu
    },

    changeLocation(location) {
      this.selectedLocation = location
      this.chooseActiveArea()
      this.resetFishing()
    },

    chooseActiveArea() {
      const areas = this.currentLocation.areas
      const randomIndex = Math.floor(Math.random() * areas.length)

      this.activeArea = areas[randomIndex]
    },

    buyItem(item, category) {
      if (this.money < item.price) {
        this.showShopMessage('Недостаточно денег')
        return
      }

      if (category === 'rods' && item.price === 0) {
        const hasBasicRod = this.inventory.rods.find((rod) => rod.id === item.id)

        if (hasBasicRod) {
          this.showShopMessage('Базовая удочка уже есть')
          return
        }
      }

      this.money = this.money - item.price

      if (category === 'baits') {
        const currentBait = this.inventory.baits.find((bait) => bait.id === item.id)

        if (currentBait) {
          currentBait.count = currentBait.count + 1
        } else {
          this.inventory.baits.push({
            id: item.id,
            key: item.key,
            name: item.name,
            price: item.price,
            count: 1
          })
        }

        if (!this.selectedBait) {
          this.selectedBait = this.inventory.baits.find((bait) => bait.id === item.id)
        }
      } else {
        const newItem = {
          id: item.id,
          key: item.key,
          name: item.name,
          price: item.price,
          power: item.power
        }

        this.inventory[category].push(newItem)

        if (category === 'rods' && !this.selectedRod) {
          this.selectedRod = newItem
        }

        if (category === 'lines' && !this.selectedLine) {
          this.selectedLine = newItem
        }

        if (category === 'reels' && !this.selectedReel) {
          this.selectedReel = newItem
        }
      }

      this.showShopMessage('Покупка выполнена')
    },

    sellItem(payload) {
      const category = payload.category
      const index = payload.index
      const item = this.inventory[category][index]

      if (!item) {
        return
      }

      if (category === 'rods' && this.selectedRod === item) {
        this.selectedRod = null
      }

      if (category === 'lines' && this.selectedLine === item) {
        this.selectedLine = null
      }

      if (category === 'reels' && this.selectedReel === item) {
        this.selectedReel = null
      }

      if (category === 'baits') {
        this.money = this.money + Math.max(1, Math.floor(item.price / 2))
        item.count = item.count - 1

        if (item.count <= 0) {
          if (this.selectedBait === item) {
            this.selectedBait = null
          }

          this.inventory.baits.splice(index, 1)
        }

        if (!this.selectedBait && this.inventory.baits.length > 0) {
          this.selectedBait = this.inventory.baits[0]
        }

        this.showShopMessage('Наживка продана')
        return
      }

      this.money = this.money + Math.max(1, Math.floor(item.price / 2))
      this.inventory[category].splice(index, 1)

      if (category === 'rods' && !this.selectedRod && this.inventory.rods.length > 0) {
        this.selectedRod = this.inventory.rods[0]
      }

      if (category === 'lines' && !this.selectedLine && this.inventory.lines.length > 0) {
        this.selectedLine = this.inventory.lines[0]
      }

      if (category === 'reels' && !this.selectedReel && this.inventory.reels.length > 0) {
        this.selectedReel = this.inventory.reels[0]
      }

      this.showShopMessage('Предмет продан')
    },

    sellFish(index) {
      const fish = this.inventory.fish[index]

      if (!fish) {
        return
      }

      this.money = this.money + fish.price
      this.inventory.fish.splice(index, 1)
      this.showShopMessage('Рыба продана')
    },

    sellAllFish() {
      if (this.inventory.fish.length === 0) {
        this.showShopMessage('Рыбы нет')
        return
      }

      let totalPrice = 0

      this.inventory.fish.forEach((fish) => {
        totalPrice = totalPrice + fish.price
      })

      this.money = this.money + totalPrice
      this.inventory.fish = []
      this.showShopMessage('Вся рыба продана')
    },

    selectRod(item) {
      this.selectedRod = item
      this.showShopMessage('Удочка выбрана')
    },

    selectLine(item) {
      this.selectedLine = item
      this.showShopMessage('Леска выбрана')
    },

    selectReel(item) {
      this.selectedReel = item
      this.showShopMessage('Катушка выбрана')
    },

    selectBait(item) {
      this.selectedBait = item
      this.showShopMessage('Наживка выбрана')
    },

    handleCast(position) {
      if (this.isFishing || this.isWaitingBite || this.isFishHooked) {
        return
      }

      if (!this.selectedRod) {
        this.showError('Сначала выбери удочку')
        return
      }

      if (!this.selectedLine) {
        this.showError('Сначала выбери леску')
        return
      }

      if (!this.selectedReel) {
        this.showError('Сначала выбери катушку')
        return
      }

      if (!this.selectedBait) {
        this.showError('Сначала выбери наживку')
        return
      }

      const availableFish = this.getFishForCurrentBait()

      if (availableFish.length === 0) {
        this.showError('На эту наживку здесь не клюет')
        return
      }

      this.currentBaitKey = this.selectedBait.key

      if (!this.useSelectedBait()) {
        this.showError('Наживка закончилась')
        return
      }

      this.clearFishingTimers()

      this.isFishing = true
      this.isWaitingBite = true
      this.isFishHooked = false
      this.isPulling = false
      this.rodLoad = 0
      this.fishDistance = 96
      this.currentFish = null
      this.currentFishStrength = 0
      this.floatX = position.x
      this.floatY = position.y
      this.currentCastAreaBonus = this.isPositionInArea(position) ? this.activeArea.bonus : 0
      this.message = this.currentCastAreaBonus > 0 ? 'Заброс в выгодную область' : 'Ожидание поклевки...'

      const timeToBite = this.currentCastAreaBonus > 0
        ? Math.floor(Math.random() * 1800) + 1200
        : Math.floor(Math.random() * 3000) + 2000

      this.biteTimeout = setTimeout(() => {
        this.startBite()
      }, timeToBite)
    },

    useSelectedBait() {
      if (!this.selectedBait) {
        return false
      }

      this.selectedBait.count = this.selectedBait.count - 1

      if (this.selectedBait.count <= 0) {
        const baitId = this.selectedBait.id
        const baitIndex = this.inventory.baits.findIndex((bait) => bait.id === baitId)

        if (baitIndex !== -1) {
          this.inventory.baits.splice(baitIndex, 1)
        }

        if (this.inventory.baits.length > 0) {
          this.selectedBait = this.inventory.baits[0]
        } else {
          this.selectedBait = null
        }
      }

      return true
    },

    getFishForCurrentBait() {
      const currentFishKeys = this.currentLocation.fish

      return currentFishKeys
        .map((key) => this.fishCatalog[key])
        .filter((fish) => fish.baits.includes(this.currentBaitKey || (this.selectedBait ? this.selectedBait.key : '')))
    },

    startBite() {
      if (!this.isFishing) {
        return
      }

      const availableFish = this.getFishForCurrentBait()

      if (availableFish.length === 0) {
        this.message = 'Поклевки не было'
        this.finishFishing()
        return
      }

      const randomIndex = Math.floor(Math.random() * availableFish.length)
      const fish = availableFish[randomIndex]
      const fishSize = this.generateFishSize(fish)
      const fishPrice = this.calculateFishPrice(fish, fishSize)
      const fishStrength = this.calculateFishStrength(fish, fishSize)

      this.currentFish = {
        key: fish.key,
        name: fish.name,
        size: fishSize,
        price: fishPrice
      }

      this.currentFishStrength = fishStrength
      this.isWaitingBite = false
      this.isFishHooked = true
      this.message = fish.name + ' ' + fishSize + ' г'

      this.startFishMove()
      this.startFishEscape()
    },

    generateFishSize(fish) {
      const minSize = fish.minSize
      const maxSize = fish.maxSize
      const randomSize = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize

      if (this.currentCastAreaBonus > 0) {
        return Math.floor(randomSize * (1 + this.currentCastAreaBonus))
      }

      return randomSize
    },

    calculateFishPrice(fish, size) {
      const price = Math.round((size / 100) * fish.price)

      if (price < 1) {
        return 1
      }

      return price
    },

    calculateFishStrength(fish, size) {
      const sizePart = size / fish.maxSize
      const gearPower = this.selectedRod.power + this.selectedLine.power + this.selectedReel.power
      const strength = fish.difficulty + sizePart * 1.5 - gearPower * 0.15

      if (strength < 0.8) {
        return 0.8
      }

      return strength
    },

    isPositionInArea(position) {
      if (!this.activeArea) {
        return false
      }

      const areaStartX = this.activeArea.x
      const areaEndX = this.activeArea.x + this.activeArea.width
      const areaStartY = this.activeArea.y
      const areaEndY = this.activeArea.y + this.activeArea.height

      return position.x >= areaStartX
        && position.x <= areaEndX
        && position.y >= areaStartY
        && position.y <= areaEndY
    },

    startFishMove() {
      clearInterval(this.fishInterval)

      this.fishInterval = setInterval(() => {
        if (!this.isFishHooked) {
          return
        }

        if (this.isPulling) {
          return
        }

        const centerX = 50
        const moveX = 1.8 + this.currentFishStrength * 0.6
        const moveY = 0.9 + this.currentFishStrength * 0.35

        if (this.floatX <= centerX) {
          this.floatX = this.floatX - moveX
        } else {
          this.floatX = this.floatX + moveX
        }

        this.floatY = this.floatY - moveY

        if (this.floatX < 8) {
          this.floatX = 8
        }

        if (this.floatX > 92) {
          this.floatX = 92
        }

        if (this.floatY < 52) {
          this.floatY = 52
        }

        if (this.floatY > 88) {
          this.floatY = 88
        }
      }, 210)
    },

    startFishEscape() {
      clearInterval(this.fishPowerInterval)

      this.fishPowerInterval = setInterval(() => {
        if (!this.isFishHooked) {
          return
        }

        if (!this.isPulling) {
          this.fishDistance = this.fishDistance + 1.6 + this.currentFishStrength * 0.5 - this.selectedReel.power * 0.15
        } else {
          this.fishDistance = this.fishDistance - 0.4
        }

        if (this.fishDistance < 0) {
          this.fishDistance = 0
        }

        if (this.fishDistance >= 100) {
          this.missFish()
        }
      }, 230)
    },

    handleStartPull() {
      if (!this.isFishHooked) {
        return
      }

      this.isPulling = true
      this.message = 'Тяни осторожно!'

      clearInterval(this.pullInterval)
      clearInterval(this.loadInterval)

      this.pullInterval = setInterval(() => {
        if (!this.isPulling || !this.isFishHooked) {
          return
        }

        const centerX = 50
        const pullX = 1.4 + this.selectedReel.power * 0.35
        const pullY = 1.5 + this.selectedRod.power * 0.3
        const pullFish = 1.3 + this.selectedRod.power * 0.25 + this.selectedReel.power * 0.15 - this.currentFishStrength * 0.35

        if (this.floatX < centerX) {
          this.floatX = this.floatX + pullX
        } else if (this.floatX > centerX) {
          this.floatX = this.floatX - pullX
        }

        this.floatY = this.floatY + pullY
        this.fishDistance = this.fishDistance - pullFish

        if (this.floatX < 8) {
          this.floatX = 8
        }

        if (this.floatX > 92) {
          this.floatX = 92
        }

        if (this.floatY > 84) {
          this.floatY = 84
        }

        if (this.fishDistance < 0) {
          this.fishDistance = 0
        }

        if (this.floatY >= 80 && this.floatX >= 43 && this.floatX <= 57 && this.fishDistance <= 8) {
          this.catchFish()
        }
      }, 180)

      this.loadInterval = setInterval(() => {
        if (!this.isPulling || !this.isFishHooked) {
          return
        }

        const loadStep = 5 + this.currentFishStrength * 1.4 - this.selectedRod.power * 0.6 - this.selectedLine.power * 0.5
        this.rodLoad = this.rodLoad + loadStep

        if (this.rodLoad >= 85) {
          this.checkRodBreakChance()
        }

        if (this.rodLoad >= 100) {
          this.breakRod()
        }
      }, 210)
    },

    checkRodBreakChance() {
      const chance = 0.03 + this.currentFishStrength * 0.02 - this.selectedRod.power * 0.005

      if (Math.random() < chance) {
        this.breakRod()
      }
    },

    handleStopPull() {
      this.isPulling = false

      clearInterval(this.pullInterval)
      clearInterval(this.loadInterval)

      if (this.isFishHooked) {
        this.message = 'Рыба тянет поплавок в сторону'
        this.startRodRelax()
      }
    },

    startRodRelax() {
      clearInterval(this.loadInterval)

      this.loadInterval = setInterval(() => {
        if (this.isPulling || !this.isFishHooked) {
          clearInterval(this.loadInterval)
          return
        }

        this.rodLoad = this.rodLoad - 9

        if (this.rodLoad <= 0) {
          this.rodLoad = 0
          clearInterval(this.loadInterval)
        }
      }, 160)
    },

    catchFish() {
      const fishLabel = this.currentFish.name + ' ' + this.currentFish.size + ' г'
      const historyLabel = this.currentFish.name + ' ' + this.currentFish.size + ' г - ' + this.currentLocation.name

      this.lastCatch = fishLabel
      this.catchHistory.unshift(historyLabel)

      if (this.catchHistory.length > 5) {
        this.catchHistory.pop()
      }

      this.inventory.fish.unshift({
        id: Date.now(),
        name: this.currentFish.name,
        size: this.currentFish.size,
        location: this.currentLocation.name,
        price: this.currentFish.price
      })

      this.message = 'Рыба поймана!'
      this.finishFishing()
    },

    missFish() {
      this.message = 'Рыба сорвалась'
      this.finishFishing()
    },

    breakRod() {
      const brokenRod = this.selectedRod

      this.message = 'Удочка сломалась!'
      this.finishFishing()

      if (!brokenRod) {
        return
      }

      const rodIndex = this.inventory.rods.findIndex((rod) => rod === brokenRod)

      if (rodIndex !== -1) {
        this.inventory.rods.splice(rodIndex, 1)
      }

      this.selectedRod = null

      if (this.inventory.rods.length > 0) {
        this.selectedRod = this.inventory.rods[0]
      }

      this.showShopMessage('Текущая удочка сломана полностью')
    },

    finishFishing() {
      this.clearFishingTimers()
      this.isFishing = false
      this.isWaitingBite = false
      this.isFishHooked = false
      this.isPulling = false
      this.rodLoad = 0
      this.fishDistance = 0
      this.currentFish = null
      this.currentFishStrength = 0
      this.currentCastAreaBonus = 0
      this.currentBaitKey = ''

      setTimeout(() => {
        if (!this.isFishing && !this.isFishHooked) {
          this.message = 'Кликни по воде чтобы забросить'
        }
      }, 1500)

      this.chooseActiveArea()
    },

    resetFishing() {
      this.clearFishingTimers()
      this.isFishing = false
      this.isWaitingBite = false
      this.isFishHooked = false
      this.isPulling = false
      this.floatX = 0
      this.floatY = 0
      this.rodLoad = 0
      this.fishDistance = 0
      this.currentFish = null
      this.currentFishStrength = 0
      this.currentCastAreaBonus = 0
      this.currentBaitKey = ''
      this.lastCatch = ''
      this.message = 'Кликни по воде чтобы забросить'
    },

    clearFishingTimers() {
      clearTimeout(this.biteTimeout)
      clearInterval(this.fishInterval)
      clearInterval(this.pullInterval)
      clearInterval(this.loadInterval)
      clearInterval(this.fishPowerInterval)
    }
  },
  created() {
    this.selectedLocation = this.locations[0]
    this.chooseActiveArea()
    this.selectedLine = this.inventory.lines[0]
    this.selectedReel = this.inventory.reels[0]
    this.selectedBait = this.inventory.baits[0]
  },
  beforeUnmount() {
    this.clearFishingTimers()
  }
}
</script>

<style scoped lang="scss">
.index {
  font-family: Arial, sans-serif;
  padding: 10px;
  background: #ffffff;

  &__container {
    max-width: 420px;
    margin: 0 auto;
    border: 1px solid #000000;
    padding: 10px;
    background: #ffffff;
  }

  &__header {
    text-align: center;
    margin-bottom: 10px;
  }

  &__title {
    font-size: 22px;
    font-weight: bold;
  }

  &__equipment {
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #000000;
    background: #f8f8f8;
  }

  &__equipment-title {
    margin-bottom: 6px;
    font-weight: bold;
  }

  &__equipment-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
    font-size: 14px;
  }

  &__equipment-label {
    font-weight: bold;
  }

  &__equipment-value {
    text-align: right;
  }

  &__menu {
    display: flex;
    gap: 8px;
    margin-bottom: 10px;
  }

  &__menu-button {
    flex: 1;
    padding: 8px;
    border: 1px solid #000000;
    background: #e8e8e8;
    cursor: pointer;
    font-weight: bold;

    &:active {
      background: #d5d5d5;
    }
  }

  &__panel {
    margin-bottom: 10px;
  }

  &__area-info {
    margin-bottom: 10px;
    padding: 8px;
    border: 1px solid #000000;
    background: #eef7ff;
    text-align: center;
    font-size: 14px;
  }

  &__shop-message {
    margin-top: 10px;
    padding: 10px;
    border: 1px solid #1f6d1f;
    background: #dff6df;
    color: #1f6d1f;
    text-align: center;
  }

  &__error {
    margin-top: 10px;
    padding: 10px;
    border: 1px solid #cc0000;
    background: #ffd9d9;
    color: #cc0000;
    text-align: center;
  }
}
</style>