<template>
  <div id="app" :class="['app',size]">
    <button v-if="size==='medium'" :disabled="!right" @click="right = false" style="grid-column: 1">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/>
      </svg>
    </button>
    <div class="view-area" :class="[size, {right}]">
      <pokedex>
        <template v-slot:face-a>
          <face-a/>
        </template>
        <template v-slot:face-b>
          <face-b/>
        </template>
        <template v-slot:face-c>
          <face-c/>
        </template>
      </pokedex>
    </div>
    <button v-if="size==='medium'" :disabled="right || status !== 'ready'" @click="right = true" style="grid-column: 3">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/>
      </svg>
    </button>
  </div>
</template>

<script>

import Hammer from 'hammerjs'
import Pokedex from './components/Pokedex'
import FaceA from './components/PokedexFaceA'
import FaceB from './components/PokedexFaceB'
import FaceC from './components/PokedexFaceC'
const throttle = require('lodash.throttle')
const enumState = (() => {
  const idle = 'idle'
  const loading = 'loading'
  const ready = 'ready'
  const error = 'error'
  return {idle, loading, ready, error}
})()
export default {
  components: {
    Pokedex,
    FaceA,
    FaceB,
    FaceC
  },
  data: () => ({
    right: false,
    breakpoints: {
      small: el => el.width <= 500,
      medium: el => el.width <= 822 && el.width > 500,
      large: el => el.width > 822
    }
  }),
  computed: {
    size () { return this.$store.state.size },
    status: {
      get () {return this.$store.state.status},
      set (value) {this.$store.commit('setStatus', value)}
    }
  },
  created () {
    const handleOnResize = throttle(() => {
      let w = window.innerWidth
      let large = 846
      let medium = 500
      let size = w >= large ? 'large' : w >= medium ? 'medium' : 'small'
      this.$store.commit('setSize', size)
    }, 200)
    window.onresize = handleOnResize
    handleOnResize()
    this.status = enumState.idle
  },
  async mounted () {
    try {
      // await intro animation
      await new Promise(resolve => setTimeout(resolve, 900))
      this.status = enumState.loading
      // fake processing time
      let timeout = new Promise(resolve => setTimeout(resolve, 1000))
      let request = new Promise(resolve => {
        fetch('/json/pokemon.json').then(response => response.json())
        .then(result => resolve(result))
      })
      await Promise.all([timeout, request])
      let {list} = await request
      this.status = enumState.ready
      this.$ls.set('pokemonList', JSON.stringify(list))
      this.$store.commit('setList', list)
    } catch (error) {
      console.log(error)
      this.status = enumState.error
    }
    let viewArea = this.$el.querySelector('.view-area')
    const viewAreaGestures = new Hammer(viewArea, {direction: Hammer.DIRECTION_ALL})
    viewAreaGestures.on('swiperight', ev => {
      this.right = false
      ev.preventDefault()
    })
    viewAreaGestures.on('swipeleft', ev => {
      this.right = true
      ev.preventDefault()
    })
  }
}
</script>



<style>
#app:not(.small) {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: 1fr auto 1fr;
  align-content: center;
  justify-content: center;
}

.view-area {
  grid-column: 2;
  overflow: hidden;
  --view-w: 100vw;
  width: var(--view-w);
  height: 100vh;
}
.view-area.medium {
  --view-w: 423px;
  height: 667px;
}
.view-area.large {
  --view-w: 846px;
  height: 667px;
}


.frame-bg {
  position: absolute;
  width: var(--bg-w, var(--w));
  height: var(--bg-h, var(--h));
  bottom: 0;
}
.frame-layout {
  position: absolute;
  width: var(--layout-w, var(--w));
  height: var(--layout-h, var(--h));
  bottom: 0;
}

[disabled] {
  opacity: 0.1;
  pointer-events: none;
}


</style>
