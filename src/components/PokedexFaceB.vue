<template>
  <div id="pokedex__face-b">
      <!--bg-->
      <svg class="frame-bg" xmlns="http://www.w3.org/2000/svg" overflow="scroll" viewBox="0 0 375 587.3">
        <path data-name="frame-chassis" d="M375 40.3v531c0 8.8-7.2 16-16 16H16c-2.9 0-5.7-.8-8-2.1-4.8-2.8-8-7.9-8-13.9V0h168l40 40.3h167z" class="c--red-1"/>
        <path data-name="frame-border" d="M375 40.3v531c0 8.8-7.2 16-16 16H16c-2.9 0-5.7-.8-8-2.1-4.8-2.8-8-7.9-8-13.9v-4h355v-507H208L168 20H0V0h168l40 40.3h167z" class="c--red-2"/>
      </svg>
      <!--layout-->
      <div class="frame-layout">
      <!--Input-->
        <div id="input-screen" class="lcd-green">
          <input type="text" v-model="filter" :maxlength="filterMaxlength">
        </div>

      <!--keyboard-->
        <div id="keyboard">
          <button v-for="(item, index) in keys" :key="`keyboard-key-${index}`" @click="buttonInput(index, item)">
            {{item}}
          </button>
          <button class="btn--icon" @click="buttonInput('supr', [])">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path>
              <line x1="18" y1="9" x2="12" y2="15"></line>
              <line x1="12" y1="9" x2="18" y2="15"></line>
            </svg>
          </button>
        </div>

        <!--buttons input-->
        <div id="buttons-input">
          <button @click="clearFilter"></button>
          <button @click="applyFilter"></button>
        </div>

      <!--buttons audio-->
        <div class="buttons-audio">
          <button class="btn--icon" @click="toggleMute" :pressed="muted" >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 5L6 9H2v6h4l5 4zM22 9l-6 6M16 9l6 6"/>
            </svg>
          </button>
          <button @click="playAudio" class="btn--icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="5 3 19 12 5 21 5 3">
              </polygon>
            </svg>
          </button>
        </div>
        <div id="sound-light" :class="['btn--icon', {'sound-light--on': playingAudio}]">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5">
            </polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
        </div>
      <!--solar panels-->
        <div id="solar-panels">
          <div></div>
          <div></div>
        </div>
      </div>
  </div>
</template>

<script>
import hotkeys from 'hotkeys-js'
export default {
  name: 'PokedexFaceB',
  components: {
  },
  data: () => ({
    filterMaxlength: 12,
    filterString: "",
    keys: [
      'abc',
      'def',
      'ghi',
      'jkl',
      'mno',
      'pqr',
      'stu',
      'vwx',
      'yz'
    ],
    keyStack: {
      key: null,
      count: 0
    },
    keyStackClear: null
  }),
  watch: {
    muted (muted) { this.$ls.set('muted', muted) },
  },
  computed: {
    selected () { return this.$store.state.selected },
    details () { return this.$store.state.details },
    filter: {
      get () {
        let {selected, details} = this
        let {filterString} = this.$data
        if (selected && details && !filterString.length) {
          return this.selected.name
        } else return filterString
      },
      set (value) {
        this.$store.commit('setDetails', false)
        this.filterString = value
        this.$store.commit('setFilter', value)
      }
    },
    list () { return this.$store.state.list },
    filteredList () { return this.$store.getters.filteredList },
    playingAudio () { return this.$store.state.playingAudio },
    muted () { return this.$store.state.muted }
  },
  mounted () {
    // load muted state
    let muted = this.$ls.get('muted')
    this.$store.commit('setMuted', muted)
    // set key inputs for keyboard
    this.bindkeys()
    // bind audio

  },
  methods: {
    bindkeys () {
      hotkeys('*', ev => {
        let isLetter = ev.keyCode >= 64 && ev.keyCode <= 90
        let isDelete = ev.keyCode === 8 || ev.keyCode === 46
        if (isLetter || isDelete) {
          ev.preventDefault()
          let l = this.filter.length
          if (isLetter && l < this.filterMaxlength) {
            this.filter += ev.key
          } else if (isDelete) {
            this.deleteLastKey()
          }
          this.resetKeyStack()
        }
      })
    },
    toggleMute (){ this.$store.commit('setMuted', !this.muted) },
    playAudio () {
      this.$store.commit('setPlayAudio')
    },
    clearFilter () {
      this.filter = ""
    },
    applyFilter () {
      let {filterString} = this.$data
      let {filteredList} = this
      if (filterString.length && filteredList.length) {
        let target = filteredList[0]
        this.$store.commit('setIndex', target.id)
        this.$store.commit('setSelected', target)
        this.$store.commit('setDetails', true)
        this.filterString = ''
        // clear filter after list-to-details animation
        setTimeout(() => {
          this.$store.commit('setFilter', null)
        }, 500)
      }
    },
    deleteLastKey () {
      let l = this.filter.length
      if (l > 0) {
        let filter = this.filter.substr(0, l-1)
        this.filter = filter
      }
    },
    resetKeyStack (key, count = 0) {
      this.keyStack = { key, count }
      this.clearTimeout()
    },
    resetTimeout () {
      if (this.keyStackClear) {
        clearTimeout(this.keyStackClear)
      }
      this.keyStackClear = setTimeout(() => {
        this.resetKeyStack()
      }, 800)
    },
    clearTimeout () {
      if (this.keyStackClear) {
        clearTimeout(this.keyStackClear)
        this.keyStackClear = null
      }
    },
    buttonInput (key, group) {
      if (group.length <= 1) {
        // delete key
        this.deleteLastKey()
        this.clearTimeout()
        return
      }
      let {keyStackClear, keyStack} = this.$data
      let {filter} = this
      if (keyStack.key === key) { //add click count
        keyStack.count++
        if (keyStack.count > group.length) {
          this.filter += group[0]
          this.resetKeyStack(key, 1)
        } else if (keyStack.count > 1 && filter.length > 0) {
          let lastKey = filter.slice(-1)
          if (group.includes(lastKey)) {
            let replace = filter.substr(0, filter.length -1) + group[keyStack.count - 1]
            this.filter = replace
          }
        }
        this.resetTimeout()
      } else {
        this.filter += group[0]
        this.resetKeyStack(key, 1)
        this.resetTimeout()
      }
    }
  }
}
</script>
<style>
#pokedex__face-b {
  width: var(--w, 100%);
  height: var(--h, 100%);
  --layout-h: calc( var(--h) - 100px );
}
/*  FRAME LAYOUT
  */
  #pokedex__face-b .frame-layout {
    --border: 18px;
    justify-content: center;
    display: grid;
    grid-auto-flow: row;
    grid-auto-rows: min-content;
    row-gap: 16px;
    grid-template-rows: repeat(5, auto) minmax(auto, 1fr);
    grid-template-columns: minmax(var(--border), 1fr) repeat(6, auto) minmax(var(--border), 1fr);
}
/*  INPUT SCREEN
  */
  #input-screen {
    grid-row: 1;
    grid-column: 2/-2;
    --lcd-w: 258px;
    --lcd-h: 96px;
    font-size: 24px;
    border-radius: 12px;
    background: var(--green-2);
    border: solid 6px var(--red-2);
    border-width: 6px 3px 0px 3px;
  }
  #input-screen>input[type="text"] {
    width: 100%;
    height: 100%;
    outline: none;
    background: none;
    border: none;
    text-align: center;
    font-family: inherit;
    font-size: 32px;
    color: inherit;
    text-transform: uppercase;
}
/*  KEYBOARD
 */
  #keyboard {
    grid-row: 2;
    grid-column: 2/-2;
  }
  #keyboard {
    width: 254px;
    height: 94px;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: 1fr 1fr;
    gap: 4px;
    background: var(--blue-5);
    padding: 4px;
    border-radius: 4px;
  }
  #keyboard>button {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--blue-4);
    border-radius: 2px;
    box-shadow: 2px 4px 2px rgba(0, 0, 0, 0.16);
    filter: brightness(104%) saturate(115%) contrast(70%);
    text-transform: uppercase;
    color: rgba(0, 0, 0, 0.4);
    letter-spacing: 1px;
  }
  #keyboard>button:hover {
    opacity: .8;
  }
  #keyboard>button:active {
    box-shadow: 2px 2px 1px rgba(0, 0, 0, 0.4), -2px -2px 1px rgba(0, 0, 0, 0.16);
}
/*  BUTTONS INPUT
  */
  #buttons-input {
    grid-row: 3;
    grid-column: 4/-2;
    justify-self: center;
    display: grid;
    grid-auto-flow: column;
    column-gap: 8px;
  }
  #buttons-input>button {
    width: 72px;
    height: 16px;
    border-radius: 4px;
    box-shadow: 2px 2px 4px rgba(0,0,0,.4), -2px -2px 8px rgba(0,0,0,.16);
  }
  #buttons-input>button:first-of-type {
    background: var(--grey-3);
  }
  #buttons-input>button:nth-of-type(2) {
    background: var(--grey-3);
  }
  #buttons-input>button:active {
    box-shadow: 1px 1px 2px rgba(0,0,0,.4), -2px -2px 4px rgba(0,0,0,.16);
}
/*  BUTTONS FB
  */
  .buttons-audio {
    grid-row: 4;
    grid-column: 2/4;
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 1fr 1fr;
    width: 100px;
    height: 50px;
    padding: 2px;
    column-gap: 2px;
    box-sizing: border-box;
  }
  .buttons-audio>button {
    background: var(--grey-2);
    box-shadow: 2px 4px 2px rgba(0, 0, 0, .16);
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .buttons-audio>button:active,
  .buttons-audio>button[pressed] {
    filter: brightness(80%);
    box-shadow: 0 2px 8px rgba(0, 0, 0, .16);
}
/* SOUND LIGHT
  */
  #sound-light {
    height: 46px;
    grid-row: 4;
    grid-column: -3/-2;
    width: 46px;
    border-radius: 50%;
    background: var(--yellow-2);
    --off-color: hsla(51, 100%, 40%, 0);
    --on-color: hsl(60, 100%, 50%, .25);
  }
  #sound-light::after {
    content: "";
    position: absolute;
    height: 46px;
    width: 46px;
    border-radius: 50%;

  }
  .sound-light--on {
    box-shadow: 2px 2px 16px hsl(60, 100%, 50%, .25), -2px -2px 16px hsl(60, 100%, 50%, .25);
  }
  .sound-light--on::after {
  animation: blip .3s ease infinite both;
}
/*  SOLAR PANELS
  */
  #solar-panels {
    grid-row: 5;
    grid-column: 2/-2;
    display: grid;
    grid-auto-flow: column;
    column-gap: 16px;
    margin-top: 50px;;
  }
  #solar-panels>div {
    width: 120px;
    height: 40px;
    border-radius: 4px;
    background: var(--green-3);
    border: solid 3px var(--red-3);
    border-width: 3px 1px 0px 1px;
}
</style>

