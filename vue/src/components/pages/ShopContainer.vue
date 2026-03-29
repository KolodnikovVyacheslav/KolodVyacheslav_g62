<template>
  <ShopPanel
    :money="money"
    :rods="rods"
    :lines="lines"
    :reels="reels"
    :baits="baits"
    :ground-baits="groundBaits"
    :nets="nets"
    :shop-message="shopMessage"
    @buy-item="(item, category) => buyItem(item, category)"
  />
</template>
<script>
import ShopPanel from './ShopPanel.vue'

export default {
  name: 'ShopContainer',
  components: {
    ShopPanel
  },
  props: {
    money: {
      type: Number,
      required: true
    },
    rods: {
      type: Array,
      required: true
    },
    lines: {
      type: Array,
      required: true
    },
    reels: {
      type: Array,
      required: true
    },
    baits: {
      type: Array,
      required: true
    },
    groundBaits: {
      type: Array,
      required: true
    },
    nets: {
      type: Array,
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
  data() {
    return {
      shopMessage: ''
    }
  },
  methods: {
    showShopMessage(message) {
      this.shopMessage = message

      setTimeout(() => {
        this.shopMessage = ''
      }, 2200)
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

      this.$emit('spend-money', item.price)

      if (category === 'baits') {
        const currentBait = this.inventory.baits.find((bait) => bait.id === item.id)

        if (currentBait) {
          this.$emit('update-bait-count', {
            id: item.id,
            increment: 1
          })
        } else {
          this.$emit('add-inventory-item', {
            category: 'baits',
            item: {
              id: item.id,
              key: item.key,
              name: item.name,
              price: item.price,
              count: 1
            }
          })
        }

        if (!this.selectedBait) {
          const newBait = currentBait || {
            id: item.id,
            key: item.key,
            name: item.name,
            price: item.price,
            count: 1
          }

          this.$emit('select-bait', newBait)
        }
      } else if (category === 'groundBaits') {
        const currentGroundBait = this.inventory.groundBaits.find((groundBait) => groundBait.id === item.id)

        if (currentGroundBait) {
          currentGroundBait.count = (currentGroundBait.count || 1) + 1
        } else {
          this.$emit('add-inventory-item', {
            category: 'groundBaits',
            item: {
              id: item.id,
              key: item.key,
              name: item.name,
              price: item.price,
              targetFish: item.targetFish,
              targetFishNames: item.targetFishNames,
              count: 1,
              usesLeft: 3
            }
          })
        }

        if (!this.selectedGroundBait) {
          const newGroundBait = currentGroundBait || {
            id: item.id,
            key: item.key,
            name: item.name,
            price: item.price,
            targetFish: item.targetFish,
            targetFishNames: item.targetFishNames,
            count: 1,
            usesLeft: 3
          }

          this.$emit('select-ground-bait', newGroundBait)
        }
      } else if (category === 'nets') {
        const newNet = {
          id: item.id,
          key: item.key,
          name: item.name,
          price: item.price,
          weightLimit: item.weightLimit
        }

        this.$emit('add-inventory-item', {
          category: 'nets',
          item: newNet
        })

        if (!this.selectedNet) {
          this.$emit('select-net', newNet)
        }
      } else {
        const newItem = {
          id: item.id,
          key: item.key,
          name: item.name,
          price: item.price,
          power: item.power
        }

        this.$emit('add-inventory-item', {
          category: category,
          item: newItem
        })

        if (category === 'rods' && !this.selectedRod) {
          this.$emit('select-rod', newItem)
        }

        if (category === 'lines' && !this.selectedLine) {
          this.$emit('select-line', newItem)
        }

        if (category === 'reels' && !this.selectedReel) {
          this.$emit('select-reel', newItem)
        }
      }

      this.showShopMessage('Покупка выполнена')
    }
  }
}
</script>
<style scoped lang="scss">
</style>