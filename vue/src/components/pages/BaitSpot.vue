<template>
  <div 
    v-if="active" 
    class="bait-spot"
    :style="{
      left: x + '%',
      top: y + '%',
      width: radius * 2 + '%',
      height: radius * 2 + '%',
      marginLeft: -radius + '%',
      marginTop: -radius + '%'
    }"
  >
    <div class="bait-spot__overlay" :class="`bait-spot__overlay--level-${level}`"></div>
    <div class="bait-spot__label">
      {{ baitName }} (ур. {{ level }}/5)
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaitSpot',
  props: {
    active: {
      type: Boolean,
      default: false
    },
    x: {
      type: Number,
      default: 50
    },
    y: {
      type: Number,
      default: 70
    },
    radius: {
      type: Number,
      default: 8
    },
    level: {
      type: Number,
      default: 1
    },
    baitName: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped lang="scss">
.bait-spot {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 8;

  &__overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    background: rgba(255, 200, 100, 0.3);
    border: 2px dashed #ffaa33;

    &--level-1 {
      background: rgba(255, 200, 100, 0.2);
      border-color: #ffaa33;
    }
    &--level-2 {
      background: rgba(255, 180, 80, 0.3);
      border-color: #ffaa33;
    }
    &--level-3 {
      background: rgba(255, 160, 60, 0.4);
      border-color: #ffaa33;
    }
    &--level-4 {
      background: rgba(255, 140, 40, 0.5);
      border-color: #ffaa33;
    }
    &--level-5 {
      background: rgba(255, 120, 20, 0.6);
      border-color: #ffaa33;
    }
  }

  &__label {
    position: absolute;
    bottom: -24px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 10px;
    white-space: nowrap;
    pointer-events: none;
    z-index: 9;
  }
}
</style>