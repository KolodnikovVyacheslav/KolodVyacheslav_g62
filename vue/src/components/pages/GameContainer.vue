<template>
  <div class="game-container">
    <LocationSelector
      :locations="locations"
      :selected="currentLocationData"
      @change-location="(location) => changeLocation(location)"
    />

    <div class="game-container__fishing-wrapper">
      <FishingArea
        :background="currentLocationData.background"
        :message="message"
        :is-fishing="isFishing"
        :is-waiting-bite="isWaitingBite"
        :is-fish-hooked="isFishHooked"
        :float-x="floatX"
        :float-y="floatY"
        :rod-load="rodLoad"
        :fish-distance="fishDistance"
        :active-area="activeArea"
        @cast="(position) => handleCast(position)"
        @start-pull="() => handleStartPull()"
        @stop-pull="() => handleStopPull()"
        @error="(message) => showError(message)"
      >
        <template #bait-spot>
          <BaitSpot
            :active="baitSpot.active"
            :x="baitSpot.x"
            :y="baitSpot.y"
            :radius="baitSpot.radius"
            :level="baitSpot.level"
            :bait-name="baitSpot.baitName"
          />
        </template>
      </FishingArea>
    </div>

    <BiteIndicator
      :last-catch="lastCatch"
      :catch-history="catchHistory"
    />

    <div v-if="activeArea" class="game-container__area-info">
      Выгодная область: {{ activeArea.name }}
    </div>

    <div v-if="baitSpot.active" class="game-container__bait-info">
      🎣 Активная прикормка: {{ baitSpot.baitName }} (ур. {{ baitSpot.level }}/5)
    </div>

    <div v-if="selectedNet" class="game-container__net-toggle">
      <button
        class="game-container__net-button"
        :class="{
          'game-container__net-button--active': netActive,
          'game-container__net-button--broken': netBroken
        }"
        :disabled="netBroken"
        @click="() => toggleNet()"
      >
        🎣 Сачок {{ netActive ? 'ВКЛ' : 'ВЫКЛ' }}
        <span class="game-container__net-limit">
          (до {{ selectedNet.weightLimit }} кг)
        </span>
      </button>

      <div v-if="netBroken" class="game-container__net-broken">
        ⚠️ Сачок сломан! Купите новый в магазине
      </div>
    </div>
  </div>
</template>
<script>
import LocationSelector from './LocationSelector.vue'
import FishingArea from './FishingArea.vue'
import BiteIndicator from './BiteIndicator.vue'
import BaitSpot from './BaitSpot.vue'
import { locations, fishCatalog } from './gameData'

export default {
  name: 'GameContainer',
  components: {
    LocationSelector,
    FishingArea,
    BiteIndicator,
    BaitSpot
  },
  props: {
    selectedRod: {
      type: Object,
      default: null
    },
    selectedLine: {
      type: Object,
      default: null
    },
    selectedReel: {
      type: Object,
      default: null
    },
    selectedBait: {
      type: Object,
      default: null
    },
    selectedGroundBait: {
      type: Object,
      default: null
    },
    selectedNet: {
      type: Object,
      default: null
    },
    inventoryBaits: {
      type: Array,
      default() {
        return []
      }
    },
    inventoryGroundBaits: {
      type: Array,
      default() {
        return []
      }
    },
    inventoryNets: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      locations: locations,
      fishCatalog: fishCatalog,
      currentLocation: locations[0],
      activeArea: null,
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
      biteTimeout: null,
      fishInterval: null,
      pullInterval: null,
      loadInterval: null,
      fishPowerInterval: null,
      baitSpot: {
        active: false,
        x: 50,
        y: 70,
        radius: 6,
        level: 1,
        baitKey: '',
        baitName: '',
        targetFish: []
      },
      netActive: false,
      netBroken: false
    }
  },
  computed: {
    currentLocationData() {
      if (this.currentLocation) {
        return this.currentLocation
      }

      return this.locations[0]
    }
  },
  watch: {
    selectedBait: {
      handler() {
        if (this.selectedBait) {
          this.currentBaitKey = this.selectedBait.key
        }
      },
      immediate: true
    },
    selectedNet: {
      handler(newNet) {
        if (newNet) {
          this.netActive = false
          this.netBroken = false
        }
      },
      immediate: true
    }
  },
  methods: {
    showError(message) {
      this.$emit('error', message)
    },

    changeLocation(location) {
      this.currentLocation = location
      this.chooseActiveArea()
      this.resetFishing()
      this.baitSpot.active = false
    },

    chooseActiveArea() {
      const areas = this.currentLocationData.areas
      const randomIndex = Math.floor(Math.random() * areas.length)

      this.activeArea = areas[randomIndex]
    },

    toggleNet() {
      if (this.netBroken) {
        return
      }

      this.netActive = !this.netActive
      this.message = this.netActive ? 'Сачок активирован!' : 'Сачок деактивирован'

      setTimeout(() => {
        if (this.message === 'Сачок активирован!' || this.message === 'Сачок деактивирован') {
          this.message = this.isFishHooked ? 'Тяни осторожно!' : 'Кликни по воде чтобы забросить'
        }
      }, 1000)
    },

    handleCast(position) {
      if (this.tryUseGroundBait(position)) {
        return
      }

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

    tryUseGroundBait(position) {
      if (!this.selectedGroundBait) {
        return false
      }

      const groundBaitIndex = this.inventoryGroundBaits.findIndex((item) => item === this.selectedGroundBait)

      if (groundBaitIndex === -1) {
        this.showError('Прикормка не найдена')
        return true
      }

      if (position.y < 50) {
        this.showError('Прикормку нужно бросать в воду')
        return true
      }

      this.applyGroundBait(position)
      this.$emit('use-ground-bait', {
        index: groundBaitIndex,
        item: this.selectedGroundBait
      })

      return true
    },

    applyGroundBait(position) {
      const selectedGroundBait = this.selectedGroundBait

      if (!this.baitSpot.active) {
        this.baitSpot.active = true
        this.baitSpot.x = position.x
        this.baitSpot.y = position.y
        this.baitSpot.radius = 6
        this.baitSpot.level = 1
        this.baitSpot.baitKey = selectedGroundBait.key
        this.baitSpot.baitName = selectedGroundBait.name
        this.baitSpot.targetFish = selectedGroundBait.targetFish
        this.message = 'Прикормка заброшена'
        return
      }

      if (this.baitSpot.baitKey === selectedGroundBait.key) {
        if (this.baitSpot.level < 5) {
          this.baitSpot.level = this.baitSpot.level + 1
          this.baitSpot.radius = this.baitSpot.radius * 1.2
        }

        this.baitSpot.x = position.x
        this.baitSpot.y = position.y
        this.message = 'Прикормка усилена'
        return
      }

      this.baitSpot.x = position.x
      this.baitSpot.y = position.y
      this.baitSpot.radius = 6
      this.baitSpot.level = 1
      this.baitSpot.baitKey = selectedGroundBait.key
      this.baitSpot.baitName = selectedGroundBait.name
      this.baitSpot.targetFish = selectedGroundBait.targetFish
      this.message = 'Новая прикормка заброшена'
    },

    useSelectedBait() {
      if (!this.selectedBait) {
        return false
      }

      const baitIndex = this.inventoryBaits.findIndex((item) => item === this.selectedBait)

      if (baitIndex === -1) {
        return false
      }

      this.selectedBait.count = this.selectedBait.count - 1

      if (this.selectedBait.count <= 0) {
        this.$emit('remove-bait', baitIndex)
      }

      return true
    },

    getFishForCurrentBait() {
      const currentFishKeys = this.currentLocationData.fish

      return currentFishKeys
        .map((key) => this.fishCatalog[key])
        .filter((fish) => fish.baits.includes(this.currentBaitKey || (this.selectedBait ? this.selectedBait.key : '')))
    },

    getWeightedFishList() {
      const availableFish = this.getFishForCurrentBait()
      const weightedFish = []

      availableFish.forEach((fish) => {
        let count = 1

        if (this.baitSpot.active && this.baitSpot.targetFish.includes(fish.key)) {
          count = 3 + this.baitSpot.level
        }

        for (let index = 0; index < count; index = index + 1) {
          weightedFish.push(fish)
        }
      })

      return weightedFish
    },

    startBite() {
      if (!this.isFishing) {
        return
      }

      const weightedFish = this.getWeightedFishList()

      if (weightedFish.length === 0) {
        this.message = 'Поклевки не было'
        this.finishFishing()
        return
      }

      const randomIndex = Math.floor(Math.random() * weightedFish.length)
      const fish = weightedFish[randomIndex]
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

        if (this.netActive) {
          this.tryCatchWithNet()
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

    tryCatchWithNet() {
      if (!this.selectedNet || this.netBroken || !this.currentFish) {
        return
      }

      if (this.floatY < 72) {
        return
      }

      const fishWeightKg = this.currentFish.size / 1000

      if (fishWeightKg <= this.selectedNet.weightLimit) {
        this.message = 'Рыба поймана сачком!'
        this.catchFish()
        return
      }

      this.netBroken = true
      this.netActive = false
      this.$emit('net-broken')
      this.breakNet()
    },

    breakNet() {
      const netIndex = this.findCurrentNetIndex()

      if (netIndex === -1) {
        return
      }

      this.$emit('remove-net', netIndex)
      this.$emit('select-net', null)
      this.message = 'Сачок сломан, ловля продолжается'

      setTimeout(() => {
        if (this.isFishHooked) {
          this.message = 'Тяни осторожно!'
        }
      }, 1200)
    },

    findCurrentNetIndex() {
      if (!this.selectedNet) {
        return -1
      }

      return this.inventoryNets.findIndex((item) => item === this.selectedNet)
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
      if (!this.currentFish) {
        return
      }

      const fishLabel = this.currentFish.name + ' ' + this.currentFish.size + ' г'
      const historyLabel = this.currentFish.name + ' ' + this.currentFish.size + ' г - ' + this.currentLocationData.name

      this.lastCatch = fishLabel
      this.catchHistory.unshift(historyLabel)

      if (this.catchHistory.length > 5) {
        this.catchHistory.pop()
      }

      this.$emit('catch-fish', {
        id: Date.now(),
        name: this.currentFish.name,
        size: this.currentFish.size,
        location: this.currentLocationData.name,
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
      this.message = 'Удочка сломалась!'
      this.finishFishing()
      this.$emit('break-rod')
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
    this.chooseActiveArea()
  },
  beforeUnmount() {
    this.clearFishingTimers()
  }
}
</script>
<style scoped lang="scss">
.game-container {
  margin-bottom: 10px;

  &__fishing-wrapper {
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

  &__bait-info {
    margin-bottom: 10px;
    padding: 8px;
    border: 1px solid #000000;
    background: #fff7df;
    text-align: center;
    font-size: 14px;
  }

  &__net-toggle {
    margin-bottom: 10px;
  }

  &__net-button {
    width: 100%;
    padding: 10px;
    border: 1px solid #000000;
    background: #e8e8e8;
    cursor: pointer;
    font-weight: bold;

    &:active {
      background: #d5d5d5;
    }

    &--active {
      background: #dff6df;
    }

    &--broken {
      background: #ffd9d9;
      cursor: not-allowed;
    }
  }

  &__net-limit {
    display: block;
    font-size: 12px;
    margin-top: 4px;
  }

  &__net-broken {
    margin-top: 6px;
    padding: 8px;
    border: 1px solid #cc0000;
    background: #ffd9d9;
    color: #cc0000;
    text-align: center;
    font-size: 13px;
  }
}
</style>