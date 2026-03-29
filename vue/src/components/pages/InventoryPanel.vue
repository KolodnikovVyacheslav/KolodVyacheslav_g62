<template>
  <div class="inventory-panel">
    <div class="inventory-panel__title">Инвентарь</div>

    <!-- Удочки -->
    <div class="inventory-panel__section">
      <div class="inventory-panel__section-title">Удочки</div>
      <div v-if="inventory.rods.length === 0" class="inventory-panel__empty">Нет удочек</div>
      <div v-for="(item, index) in inventory.rods" :key="'rod-' + index" class="inventory-panel__item">
        <div class="inventory-panel__item-info">
          <div class="inventory-panel__item-name">{{ item.name }}</div>
          <div v-if="selectedRod === item" class="inventory-panel__item-status">Используется</div>
        </div>
        <div class="inventory-panel__item-actions">
          <button class="inventory-panel__button" @click="() => selectRod(item)">Выбрать</button>
          <button class="inventory-panel__button inventory-panel__button--sell" @click="() => sellItem('rods', index)">Продать</button>
        </div>
      </div>
    </div>

    <!-- Лески -->
    <div class="inventory-panel__section">
      <div class="inventory-panel__section-title">Лески</div>
      <div v-if="inventory.lines.length === 0" class="inventory-panel__empty">Нет лесок</div>
      <div v-for="(item, index) in inventory.lines" :key="'line-' + index" class="inventory-panel__item">
        <div class="inventory-panel__item-info">
          <div class="inventory-panel__item-name">{{ item.name }}</div>
          <div v-if="selectedLine === item" class="inventory-panel__item-status">Используется</div>
        </div>
        <div class="inventory-panel__item-actions">
          <button class="inventory-panel__button" @click="() => selectLine(item)">Выбрать</button>
          <button class="inventory-panel__button inventory-panel__button--sell" @click="() => sellItem('lines', index)">Продать</button>
        </div>
      </div>
    </div>

    <!-- Катушки -->
    <div class="inventory-panel__section">
      <div class="inventory-panel__section-title">Катушки</div>
      <div v-if="inventory.reels.length === 0" class="inventory-panel__empty">Нет катушек</div>
      <div v-for="(item, index) in inventory.reels" :key="'reel-' + index" class="inventory-panel__item">
        <div class="inventory-panel__item-info">
          <div class="inventory-panel__item-name">{{ item.name }}</div>
          <div v-if="selectedReel === item" class="inventory-panel__item-status">Используется</div>
        </div>
        <div class="inventory-panel__item-actions">
          <button class="inventory-panel__button" @click="() => selectReel(item)">Выбрать</button>
          <button class="inventory-panel__button inventory-panel__button--sell" @click="() => sellItem('reels', index)">Продать</button>
        </div>
      </div>
    </div>

    <!-- Наживки -->
    <div class="inventory-panel__section">
      <div class="inventory-panel__section-title">Наживки</div>
      <div v-if="inventory.baits.length === 0" class="inventory-panel__empty">Нет наживки</div>
      <div v-for="(item, index) in inventory.baits" :key="'bait-' + index" class="inventory-panel__item">
        <div class="inventory-panel__item-info">
          <div class="inventory-panel__item-name">{{ item.name }} - {{ item.count }}</div>
          <div v-if="selectedBait === item" class="inventory-panel__item-status">Используется</div>
        </div>
        <div class="inventory-panel__item-actions">
          <button class="inventory-panel__button" @click="() => selectBait(item)">Выбрать</button>
          <button class="inventory-panel__button inventory-panel__button--sell" @click="() => sellItem('baits', index)">Продать</button>
        </div>
      </div>
    </div>

    <!-- Прикормки -->
    <div class="inventory-panel__section">
      <div class="inventory-panel__section-title">Прикормки</div>
      <div v-if="inventory.groundBaits.length === 0" class="inventory-panel__empty">Нет прикормки</div>
      <div v-for="(item, index) in inventory.groundBaits" :key="'groundBait-' + index" class="inventory-panel__item">
        <div class="inventory-panel__item-info">
          <div class="inventory-panel__item-name">{{ item.name }} - {{ item.count }} шт.</div>
          <div class="inventory-panel__item-desc">Приманивает: {{ item.targetFishNames.join(', ') }}</div>
          <div v-if="selectedGroundBait === item" class="inventory-panel__item-status">Используется</div>
        </div>
        <div class="inventory-panel__item-actions">
          <button class="inventory-panel__button" @click="() => selectGroundBait(item)">Выбрать</button>
          <button class="inventory-panel__button inventory-panel__button--sell" @click="() => sellItem('groundBaits', index)">Продать</button>
        </div>
      </div>
    </div>

    <!-- Сачки -->
    <div class="inventory-panel__section">
      <div class="inventory-panel__section-title">Сачки</div>
      <div v-if="inventory.nets.length === 0" class="inventory-panel__empty">Нет сачков</div>
      <div v-for="(item, index) in inventory.nets" :key="'net-' + index" class="inventory-panel__item">
        <div class="inventory-panel__item-info">
          <div class="inventory-panel__item-name">{{ item.name }}</div>
          <div class="inventory-panel__item-desc">Допуск: до {{ item.weightLimit }} кг</div>
          <div v-if="selectedNet === item" class="inventory-panel__item-status">Используется</div>
        </div>
        <div class="inventory-panel__item-actions">
          <button class="inventory-panel__button" @click="() => selectNet(item)">Выбрать</button>
          <button class="inventory-panel__button inventory-panel__button--sell" @click="() => sellItem('nets', index)">Продать</button>
        </div>
      </div>
    </div>

    <!-- Рыба -->
    <div class="inventory-panel__section">
      <div class="inventory-panel__section-title">Рыба</div>
      <div v-if="inventory.fish.length === 0" class="inventory-panel__empty">Нет рыбы</div>
      <div v-for="(item, index) in inventory.fish" :key="'fish-' + index" class="inventory-panel__item">
        <div class="inventory-panel__item-info">
          <div class="inventory-panel__item-name">{{ item.name }} {{ item.size }} г</div>
          <div class="inventory-panel__item-status">Цена: {{ item.price }}</div>
        </div>
        <div class="inventory-panel__item-actions">
          <button class="inventory-panel__button inventory-panel__button--sell" @click="() => sellFish(index)">Продать</button>
        </div>
      </div>
      <button v-if="inventory.fish.length > 0" class="inventory-panel__button inventory-panel__button--all" @click="() => sellAllFish()">Продать всю рыбу</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InventoryPanel',
  props: {
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
    },
    selectLine(item) {
      this.$emit('select-line', item)
    },
    selectReel(item) {
      this.$emit('select-reel', item)
    },
    selectBait(item) {
      this.$emit('select-bait', item)
    },
    selectGroundBait(item) {
      this.$emit('select-ground-bait', item)
    },
    selectNet(item) {
      this.$emit('select-net', item)
    },
    sellItem(category, index) {
      this.$emit('sell-item', { category, index })
    },
    sellFish(index) {
      this.$emit('sell-fish', index)
    },
    sellAllFish() {
      this.$emit('sell-all-fish')
    }
  }
}
</script>

<style scoped lang="scss">
.inventory-panel {
  padding: 10px;
  border: 1px solid #000000;
  background: #f9f9f9;

  &__title {
    margin-bottom: 8px;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
  }

  &__section {
    margin-bottom: 12px;
  }

  &__section-title {
    margin-bottom: 6px;
    font-weight: bold;
  }

  &__empty {
    padding: 8px;
    border: 1px solid #000000;
    background: #ffffff;
    color: #666666;
  }

  &__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    padding: 8px;
    border: 1px solid #000000;
    background: #ffffff;
    margin-bottom: 6px;
  }

  &__item-info {
    flex: 1;
  }

  &__item-name {
    font-weight: bold;
    margin-bottom: 2px;
  }

  &__item-desc {
    font-size: 11px;
    color: #666;
    margin-bottom: 2px;
  }

  &__item-status {
    font-size: 13px;
    color: #2f7d32;
  }

  &__item-actions {
    display: flex;
    gap: 6px;
  }

  &__button {
    min-width: 80px;
    padding: 6px 8px;
    border: 1px solid #000000;
    background: #e8e8e8;
    cursor: pointer;

    &:active {
      background: #d5d5d5;
    }

    &--sell {
      background: #f1d6d6;

      &:active {
        background: #e3c0c0;
      }
    }

    &--all {
      width: 100%;
      margin-top: 6px;
      background: #f1d6d6;
    }
  }
}
</style>