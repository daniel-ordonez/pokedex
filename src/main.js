import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import VueLocalStorage from 'vue-localstorage'
import Vuex from 'vuex'

Vue.config.productionTip = false

Vue.use(VueLocalStorage, {
  name: 'ls',
  bind: true //created computed members from your variable declarations
})
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    status: 'idle',
    size: 'small',
    list: [],
    index: 0,
    selected: null,
    details: false,
    filter: '',
    playAudio: false,
    playingAudio: false,
    muted: false
  },
  mutations: {
    setStatus (state, value) {
      state.status = value
    },
    setSize (state, value) {
      state.size = value
    },
    setList (state, value) {
      state.list = value
    },
    setIndex (state, value) {
      state.index = value
    },
    setSelected (state, value) {
      state.selected = value
    },
    setDetails (state, value) {
      state.details = value
    },
    setFilter (state, value) {
      state.filter = value ? value : ''
    },
    setPlayAudio (state) {
      if (!state.muted) {
        state.playAudio = true
      }
    },
    setPlayingAudio (state, value) {
      state.playingAudio = value
      if (!value) {
        state.playAudio = false
      }
    },
    toggleMute (state) {
      state.muted = !state.muted
    },
    setMuted (state, value) {
      state.muted = value
    }
  },
  getters: {
    filteredList ({list, filter}) {
      return filter.length ? list.filter(item => item.name.includes(filter)) : list
    }
  }
})


new Vue({
  render: h => h(App),
  store
}).$mount('#app')
