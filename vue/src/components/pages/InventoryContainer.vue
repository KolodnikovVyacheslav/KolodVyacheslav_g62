<template>
  <InventoryPanel
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
    @sell-item="(payload) => sellItem(payload)"
    @sell-fish="(index) => sellFish(index)"
    @sell-all-fish="() => sellAllFish()"
  />
</template>
<script>
import InventoryPanel from './InventoryPanel.vue'

export default {
  name: 'InventoryContainer',
  components: {
    InventoryPanel
  },
  props: {
    money: {
      type: Number,
      required: true
    },
    inventory: {
      type: Object,
      required: true
    },
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
    }
  },
  methods: {
    selectRod(item) {
      this.$emit('select-rod', item)
      this.$emit('show-message', 'Удочка выбрана')
    },

    selectLine(item) {
      this.$emit('select-line', item)
      this.$emit('show-message', 'Леска выбрана')
    },

    selectReel(item) {
      this.$emit('select-reel', item)
      this.$emit('show-message', 'Катушка выбрана')
    },

    selectBait(item) {
      this.$emit('select-bait', item)
      this.$emit('show-message', 'Наживка выбрана')
    },

    selectGroundBait(item) {
      this.$emit('select-ground-bait', item)
      this.$emit('show-message', 'Прикормка выбрана. Кликни по воде для заброса')
    },

    selectNet(item) {
      this.$emit('select-net', item)
      this.$emit('show-message', 'Сачок выбран')
    },

    sellItem(payload) {
      const category = payload.category
      const index = payload.index
      const item = this.inventory[category][index]

      if (!item) {
        return
      }

      if (category === 'rods' && this.selectedRod === item) {
        this.$emit('select-rod', null)
      }

      if (category === 'lines' && this.selectedLine === item) {
        this.$emit('select-line', null)
      }

      if (category === 'reels' && this.selectedReel === item) {
        this.$emit('select-reel', null)
      }

      if (category === 'baits') {
        const sellPrice = Math.max(1, Math.floor(item.price / 2))
        this.$emit('add-money', sellPrice)

        item.count = item.count - 1

        if (item.count <= 0) {
          if (this.selectedBait === item) {
            this.$emit('select-bait', null)
          }

          this.$emit('remove-inventory-item', {
            category: category,
            index: index
          })
        }

        if (!this.selectedBait && this.inventory.baits.length > 0) {
          this.$emit('select-bait', this.inventory.baits[0])
        }

        this.$emit('show-message', 'Наживка продана')
        return
      }

      if (category === 'groundBaits') {
        const sellPrice = Math.max(1, Math.floor(item.price / 2))
        this.$emit('add-money', sellPrice)

        item.count = (item.count || 1) - 1

        if (item.count <= 0) {
          if (this.selectedGroundBait === item) {
            this.$emit('select-ground-bait', null)
          }

          this.$emit('remove-inventory-item', {
            category: category,
            index: index
          })
        }

        if (!this.selectedGroundBait && this.inventory.groundBaits.length > 0) {
          this.$emit('select-ground-bait', this.inventory.groundBaits[0])
        }

        this.$emit('show-message', 'Прикормка продана')
        return
      }

      if (category === 'nets') {
        const sellPrice = Math.max(1, Math.floor(item.price / 2))
        this.$emit('add-money', sellPrice)

        if (this.selectedNet === item) {
          this.$emit('select-net', null)
        }

        this.$emit('remove-inventory-item', {
          category: category,
          index: index
        })

        if (!this.selectedNet && this.inventory.nets.length > 0) {
          this.$emit('select-net', this.inventory.nets[0])
        }

        this.$emit('show-message', 'Сачок продан')
        return
      }

      const sellPrice = Math.max(1, Math.floor(item.price / 2))
      this.$emit('add-money', sellPrice)
      this.$emit('remove-inventory-item', {
        category: category,
        index: index
      })

      if (category === 'rods' && !this.selectedRod && this.inventory.rods.length > 0) {
        this.$emit('select-rod', this.inventory.rods[0])
      }

      if (category === 'lines' && !this.selectedLine && this.inventory.lines.length > 0) {
        this.$emit('select-line', this.inventory.lines[0])
      }

      if (category === 'reels' && !this.selectedReel && this.inventory.reels.length > 0) {
        this.$emit('select-reel', this.inventory.reels[0])
      }

      this.$emit('show-message', 'Предмет продан')
    },

    sellFish(index) {
      const fish = this.inventory.fish[index]

      if (!fish) {
        return
      }

      this.$emit('add-money', fish.price)
      this.$emit('remove-fish', index)
      this.$emit('show-message', 'Рыба продана')
    },

    sellAllFish() {
      if (this.inventory.fish.length === 0) {
        this.$emit('show-message', 'Рыбы нет')
        return
      }

      let totalPrice = 0

      this.inventory.fish.forEach((fish) => {
        totalPrice = totalPrice + fish.price
      })

      this.$emit('add-money', totalPrice)
      this.$emit('clear-all-fish')
      this.$emit('show-message', 'Вся рыба продана')
    }
  }
}
</script>
<style scoped lang="scss">
</style>