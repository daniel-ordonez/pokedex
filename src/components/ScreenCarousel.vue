<template>
  <div class="screen-carousel" :style="`--childs: ${$refs.carousel ? $refs.carousel.children.length : 0}; --index: ${index}`" ref="carousel" :screen="index + 1">
    <slot/>
  </div>
</template>

<script>
export default {
  name: 'ScreenCarousel',
  props: {
    index: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style>
.screen-carousel {
  --scrollbar: 20px;
  width: calc( var(--lcd-w) * var(--childs));
  height: var(--lcd-h);
  transition: margin .5s ease-in-out;
  display: flex;
  flex-wrap: nowrap;
  margin-left: calc(-1 * var(--index) * var(--lcd-w));
}
.screen-carousel.vertical {
  flex-direction: column;
  width: var(--lcd-w);
  height: calc( var(--lcd-h) * var(--childs));
  margin-left: 0;
  margin-top: calc(-1 * var(--index) * var(--lcd-h));
}

.screen-carousel>.screen {
  min-height: var(--lcd-h);
  width: var(--lcd-w);
  height: var(--lcd-h);
  position: relative;
  overflow: hidden;
}

.screen__content{
  height: var(--lcd-h);
  width: var(--lcd-w);
  padding-right: var(--scrollbar);
  box-sizing: content-box;
  overflow-y: scroll;
  overflow-x: hidden;
  position: absolute;
  top: 0;
  left: 0;
}


.screen__content::-webkit-scrollbar {
  display: none;
  opacity: 0;
}
</style>
