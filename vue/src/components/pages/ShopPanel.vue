<template>
  <div class="shop-panel">
    <div class="shop-panel__title">Магазин</div>

    <div class="shop-panel__money">Деньги: {{ money }}</div>

    <div v-if="shopMessage" class="shop-panel__message">{{ shopMessage }}</div>

    <div class="shop-panel__section">
      <div class="shop-panel__section-title">Удочки</div>
      <div v-for="item in rods" :key="item.id" class="shop-panel__item">
        <div class="shop-panel__item-info">
          <div class="shop-panel__item-name">{{ item.name }}</div>
          <div class="shop-panel__item-price">Цена: {{ item.price }}</div>
        </div>
        <button class="shop-panel__button" @click="() => buyItem(item, 'rods')">Купить</button>
      </div>
    </div>

    <div class="shop-panel__section">
      <div class="shop-panel__section-title">Лески</div>
      <div v-for="item in lines" :key="item.id" class="shop-panel__item">
        <div class="shop-panel__item-info">
          <div class="shop-panel__item-name">{{ item.name }}</div>
          <div class="shop-panel__item-price">Цена: {{ item.price }}</div>
        </div>
        <button class="shop-panel__button" @click="() => buyItem(item, 'lines')">Купить</button>
      </div>
    </div>

    <div class="shop-panel__section">
      <div class="shop-panel__section-title">Катушки</div>
      <div v-for="item in reels" :key="item.id" class="shop-panel__item">
        <div class="shop-panel__item-info">
          <div class="shop-panel__item-name">{{ item.name }}</div>
          <div class="shop-panel__item-price">Цена: {{ item.price }}</div>
        </div>
        <button class="shop-panel__button" @click="() => buyItem(item, 'reels')">Купить</button>
      </div>
    </div>

    <div class="shop-panel__section">
      <div class="shop-panel__section-title">Наживки</div>
      <div v-for="item in baits" :key="item.id" class="shop-panel__item">
        <div class="shop-panel__item-info">
          <div class="shop-panel__item-name">{{ item.name }}</div>
          <div class="shop-panel__item-price">Цена: {{ item.price }}</div>
        </div>
        <button class="shop-panel__button" @click="() => buyItem(item, 'baits')">Купить</button>
      </div>
    </div>

    <div class="shop-panel__section">
      <div class="shop-panel__section-title">Прикормки</div>
      <div v-for="item in groundBaits" :key="item.id" class="shop-panel__item">
        <div class="shop-panel__item-info">
          <div class="shop-panel__item-name">{{ item.name }}</div>
          <div class="shop-panel__item-desc">Приманивает: {{ item.targetFishNames.join(', ') }}</div>
          <div class="shop-panel__item-price">Цена: {{ item.price }}</div>
        </div>
        <button class="shop-panel__button" @click="() => buyItem(item, 'groundBaits')">Купить</button>
      </div>
    </div>

    <div class="shop-panel__section">
      <div class="shop-panel__section-title">Сачки</div>
      <div v-for="item in nets" :key="item.id" class="shop-panel__item">
        <div class="shop-panel__item-info">
          <div class="shop-panel__item-name">{{ item.name }}</div>
          <div class="shop-panel__item-desc">Допуск: до {{ item.weightLimit }} кг</div>
          <div class="shop-panel__item-price">Цена: {{ item.price }}</div>
        </div>
        <button class="shop-panel__button" @click="() => buyItem(item, 'nets')">Купить</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShopPanel',
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
    shopMessage: {
      type: String,
      default: ''
    }
  },
  methods: {
    buyItem(item, category) {
      this.$emit('buy-item', item, category)
    }
  }
}
</script>

<style scoped lang="scss">
.shop-panel {
  padding: 10px;
  border: 1px solid #000000;
  background: #f5f5f5;

  &__title {
    margin-bottom: 8px;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
  }

  &__money {
    margin-bottom: 10px;
    padding: 8px;
    border: 1px solid #000000;
    background: #ffffff;
    text-align: center;
    font-weight: bold;
  }

  &__message {
    margin-bottom: 10px;
    padding: 8px;
    border: 1px solid #000000;
    background: #ffffff;
    text-align: center;
  }

  &__section {
    margin-bottom: 12px;
  }

  &__section-title {
    margin-bottom: 6px;
    font-weight: bold;
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

  &__item-price {
    font-size: 12px;
  }

  &__button {
    min-width: 80px;
    padding: 6px 10px;
    border: 1px solid #000000;
    background: #e8e8e8;
    cursor: pointer;

    &:active {
      background: #d5d5d5;
    }
  }
}
</style>