<template>
  <div class="index">
    <div class="index__container">
      <div class="index__header">
        <div class="index__title">Русская рыбалка</div>
      </div>

      <GameContainer
        :selected-rod="selectedRod"
        :selected-line="selectedLine"
        :selected-reel="selectedReel"
        :selected-bait="selectedBait"
        :selected-ground-bait="selectedGroundBait"
        :selected-net="selectedNet"
        :inventory-baits="inventory.baits"
        :inventory-ground-baits="inventory.groundBaits"
        :inventory-nets="inventory.nets"
        @error="(message) => showError(message)"
        @catch-fish="(fish) => addFish(fish)"
        @break-rod="() => handleBreakRod()"
        @remove-bait="(index) => removeBaitByIndex(index)"
        @select-bait="(item) => selectBait(item)"
        @remove-ground-bait="(index) => removeGroundBaitByIndex(index)"
        @select-ground-bait="(item) => selectGroundBait(item)"
        @use-ground-bait="(payload) => handleUseGroundBait(payload)"
        @remove-net="(index) => removeNetByIndex(index)"
        @select-net="(item) => selectNet(item)"
        @net-broken="() => handleNetBroken()"
      />

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
        <div class="index__equipment-row">
          <span class="index__equipment-label">Прикормка:</span>
          <span class="index__equipment-value">{{ currentGroundBaitName }}</span>
        </div>
        <div class="index__equipment-row">
          <span class="index__equipment-label">Сачок:</span>
          <span class="index__equipment-value">{{ currentNetName }}</span>
        </div>
      </div>

      <div class="index__menu">
        <button
          class="index__menu-button"
          @click="() => setActiveMenu('shop')"
        >
          Магазин
        </button>
        <button
          class="index__menu-button"
          @click="() => setActiveMenu('inventory')"
        >
          Инвентарь
        </button>
        <button
          class="index__menu-button"
          @click="() => setActiveMenu('none')"
        >
          Закрыть
        </button>
      </div>

      <div v-if="activeMenu === 'shop'" class="index__panel">
        <ShopContainer
          :money="money"
          :rods="rods"
          :lines="lines"
          :reels="reels"
          :baits="baits"
          :ground-baits="groundBaits"
          :nets="nets"
          :inventory="inventory"
          :selected-rod="selectedRod"
          :selected-line="selectedLine"
          :selected-reel="selectedReel"
          :selected-bait="selectedBait"
          :selected-ground-bait="selectedGroundBait"
          :selected-net="selectedNet"
          @spend-money="(value) => spendMoney(value)"
          @add-money="(value) => addMoney(value)"
          @add-inventory-item="(payload) => addInventoryItem(payload)"
          @update-bait-count="(payload) => updateBaitCount(payload)"
          @select-rod="(item) => selectRod(item)"
          @select-line="(item) => selectLine(item)"
          @select-reel="(item) => selectReel(item)"
          @select-bait="(item) => selectBait(item)"
          @select-ground-bait="(item) => selectGroundBait(item)"
          @select-net="(item) => selectNet(item)"
        />
      </div>

      <div v-if="activeMenu === 'inventory'" class="index__panel">
        <InventoryContainer
          :money="money"
          :inventory="inventory"
          :selected-rod="selectedRod"
          :selected-line="selectedLine"
          :selected-reel="selectedReel"
          :selected-bait="selectedBait"
          :selected-ground-bait="selectedGroundBait"
          :selected-net="selectedNet"
          @select-rod="(item) => selectRod(item)"
          @select-line="(item) => selectLine(item)"
          @select-reel="(item) => selectReel(item)"
          @select-bait="(item) => selectBait(item)"
          @select-ground-bait="(item) => selectGroundBait(item)"
          @select-net="(item) => selectNet(item)"
          @add-money="(value) => addMoney(value)"
          @remove-inventory-item="(payload) => removeInventoryItem(payload)"
          @remove-fish="(index) => removeFish(index)"
          @clear-all-fish="() => clearAllFish()"
          @show-message="(message) => showShopMessage(message)"
        />
      </div>

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
import GameContainer from './GameContainer.vue'
import ShopContainer from './ShopContainer.vue'
import InventoryContainer from './InventoryContainer.vue'
import {
  rods,
  lines,
  reels,
  baits,
  groundBaits,
  nets
} from './shopData'

export default {
  name: 'IndexPage',
  components: {
    GameContainer,
    ShopContainer,
    InventoryContainer
  },
  data() {
    return {
      activeMenu: 'none',
      money: 220,
      shopMessage: '',
      errorMessage: '',
      rods: rods,
      lines: lines,
      reels: reels,
      baits: baits,
      groundBaits: groundBaits,
      nets: nets,
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
        groundBaits: [
          {
            id: 1,
            key: 'carp_ground',
            name: 'Карповая смесь',
            price: 35,
            targetFish: ['carp', 'crucian'],
            targetFishNames: ['Карп', 'Карась'],
            count: 1,
            usesLeft: 3
          }
        ],
        nets: [],
        fish: []
      },
      selectedRod: null,
      selectedLine: null,
      selectedReel: null,
      selectedBait: null,
      selectedGroundBait: null,
      selectedNet: null
    }
  },
  computed: {
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
    },

    currentGroundBaitName() {
      if (this.selectedGroundBait) {
        return this.selectedGroundBait.name + ' (' + this.selectedGroundBait.count + ', использований: ' + this.selectedGroundBait.usesLeft + '/3)'
      }

      return 'Не выбрана'
    },

    currentNetName() {
      if (this.selectedNet) {
        return this.selectedNet.name
      }

      return 'Не выбран'
    }
  },
  methods: {
    setActiveMenu(menu) {
      this.activeMenu = menu
    },

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

    spendMoney(value) {
      this.money = this.money - value
      this.showShopMessage('Покупка выполнена')
    },

    addMoney(value) {
      this.money = this.money + value
    },

    addInventoryItem(payload) {
      this.inventory[payload.category].push(payload.item)
    },

    updateBaitCount(payload) {
      const currentBait = this.inventory.baits.find((item) => item.id === payload.id)

      if (currentBait) {
        currentBait.count = currentBait.count + payload.increment
      }
    },

    selectRod(item) {
      this.selectedRod = item
    },

    selectLine(item) {
      this.selectedLine = item
    },

    selectReel(item) {
      this.selectedReel = item
    },

    selectBait(item) {
      this.selectedBait = item
    },

    selectGroundBait(item) {
      this.selectedGroundBait = item
    },

    selectNet(item) {
      this.selectedNet = item
    },

    addFish(fish) {
      this.inventory.fish.unshift(fish)
    },

    handleBreakRod() {
      if (!this.selectedRod) {
        return
      }

      const rodIndex = this.inventory.rods.findIndex((item) => item === this.selectedRod)

      if (rodIndex !== -1) {
        this.inventory.rods.splice(rodIndex, 1)
      }

      this.selectedRod = null

      if (this.inventory.rods.length > 0) {
        this.selectedRod = this.inventory.rods[0]
      }

      this.showShopMessage('Текущая удочка сломана полностью')
    },

    removeBaitByIndex(index) {
      if (index < 0 || index >= this.inventory.baits.length) {
        return
      }

      const removedItem = this.inventory.baits[index]

      this.inventory.baits.splice(index, 1)

      if (this.selectedBait === removedItem) {
        this.selectedBait = null

        if (this.inventory.baits.length > 0) {
          this.selectedBait = this.inventory.baits[0]
        }
      }
    },

    removeGroundBaitByIndex(index) {
      if (index < 0 || index >= this.inventory.groundBaits.length) {
        return
      }

      const removedItem = this.inventory.groundBaits[index]

      this.inventory.groundBaits.splice(index, 1)

      if (this.selectedGroundBait === removedItem) {
        this.selectedGroundBait = null

        if (this.inventory.groundBaits.length > 0) {
          this.selectedGroundBait = this.inventory.groundBaits[0]
        }
      }
    },

    handleUseGroundBait(payload) {
      if (!payload) {
        return
      }

      const index = payload.index
      const item = this.inventory.groundBaits[index]

      if (!item) {
        return
      }

      item.usesLeft = (item.usesLeft || 3) - 1

      if (item.usesLeft > 0) {
        if (this.selectedGroundBait !== item) {
          this.selectedGroundBait = item
        }
        return
      }

      item.count = item.count - 1

      if (item.count > 0) {
        item.usesLeft = 3

        if (this.selectedGroundBait !== item) {
          this.selectedGroundBait = item
        }

        return
      }

      const removedItem = item

      this.inventory.groundBaits.splice(index, 1)

      if (this.selectedGroundBait === removedItem) {
        this.selectedGroundBait = null

        if (this.inventory.groundBaits.length > 0) {
          this.selectedGroundBait = this.inventory.groundBaits[0]
        }
      }
    },

    removeNetByIndex(index) {
      if (index < 0 || index >= this.inventory.nets.length) {
        return
      }

      const removedItem = this.inventory.nets[index]

      this.inventory.nets.splice(index, 1)

      if (this.selectedNet === removedItem) {
        this.selectedNet = null

        if (this.inventory.nets.length > 0) {
          this.selectedNet = this.inventory.nets[0]
        }
      }
    },

    handleNetBroken() {
      this.showShopMessage('Сачок сломан')
    },

    removeInventoryItem(payload) {
      if (!this.inventory[payload.category]) {
        return
      }

      this.inventory[payload.category].splice(payload.index, 1)
    },

    removeFish(index) {
      this.inventory.fish.splice(index, 1)
    },

    clearAllFish() {
      this.inventory.fish = []
    }
  },
  created() {
    this.selectedLine = this.inventory.lines[0]
    this.selectedReel = this.inventory.reels[0]
    this.selectedBait = this.inventory.baits[0]
    this.selectedGroundBait = this.inventory.groundBaits[0] || null
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