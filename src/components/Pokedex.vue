<template>
  <div id="pokedex" :class="[size, {closed: status !== 'ready'}]" >
    <div class="side-left">
      <slot name="face-d">
        <div class="placeholder--d"></div>
      </slot>
      <slot name="face-a">
        <div class="placeholder--a"></div>
      </slot>
    </div>
    <div class="side-right">
      <slot name="face-c">
        <div class="placeholder--c">C</div>
      </slot>
      <slot name="face-b">
        <div class="placeholder--b">B</div>
      </slot>
    </div>
    <audio :src="audioSource" :muted="!!muted ? true : false" @play="setPlaying(true)" @ended="setPlaying(false)"></audio>
  </div>
</template>

<script>
export default {
  name: 'Pokedex',
  watch: {
    playAudio (value) {
      if (value) {
        let audio = this.$el.querySelector('audio')
        audio && audio.play()
      }
    }
  },
  computed: {
    status () { return this.$store.state.status },
    size () { return this.$store.state.size },
    selected () { return this.$store.state.selected },
    audioSource () {
      let {selected} = this
      return selected && selected.id ? `./cries/${selected.id}.ogg` : null
    },
    muted () { return this.$store.state.muted },
    playAudio () { return this.$store.state.playAudio }
  },
  methods: {
    setPlaying (v) { this.$store.commit('setPlayingAudio', v) },
  }
}
</script>

<style>
#pokedex {
  --pokedex-w: 846px;
  --pokedex-h: 667px;
  --hinge-w: 48px;
  width: var(--pokedex-w);
  height: var(--pokedex-h);
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: repeat(2, calc( var(--pokedex-w) / 2));
  position: relative;
  perspective: 1000px;
}
#pokedex {
  margin-left: 0px;
  transition: margin .5s ease-in-out;
}
.right>#pokedex.medium {
  margin-left: -423px;
}
.right>#pokedex.small {
  margin-left: calc( var(--pokedex-w) * -0.5);
}

#pokedex.small {
  --pokedex-w: 200vw;
  --pokedex-h: 100vh;
  background: var(--red-1);
}
#pokedex.small .frame-bg {
  display: none;
}
#pokedex.small #pokedex__face-c {
  background: var(--red-1);
  height: 100vh;
}
#pokedex.small #pokedex__face-c>svg>path:first-of-type {
  display: none;
}
#pokedex .side-left,
#pokedex .side-right {
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
}
#pokedex .side-left {
  --w: calc( var(--pokedex-w) / 2);
  --h: var(--pokedex-h);
}
#pokedex .side-right {
  --w: calc( (var(--pokedex-w) / 2) - var(--hinge-w));
  --h: calc( var(--pokedex-h) - 80px);
  transition: transform 1s ease-in-out, margin .8s ease-in-out;
  will-change: transform;
  transform-origin: left;
}
#pokedex.small .side-right {
  --w: calc( (var(--pokedex-w) / 2) );
}
#pokedex .side-left>div,
#pokedex .side-right>div {
  position: absolute;
  bottom: 0;
  backface-visibility: hidden;
}
#pokedex .slide-right>div {
  left: 0;
}

#pokedex .side-left>div:first-child,
#pokedex .side-right>div:first-child {
  transform: rotateY(180deg);
  z-index: 1;
}

#pokedex.closed .side-right{
  transform: rotateY(-180deg);
}
#pokedex.closed:not(.small) .side-right{
  margin-left: -48px;
}

#pokedex .placeholder--a {
  background: red;
  height: 100%;
  width: 100%;
}
#pokedex .placeholder--b {
  background: green;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 80px;
  color: white;
}
#pokedex .placeholder--c {
  background: blue;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 80px;
  color: white;
}
#pokedex .placeholder--d {
  background: yellow;
  height: 100%;
  width: 100%;
}
</style>
