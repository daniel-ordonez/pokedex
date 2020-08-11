<template>
<div id="pokedex__face-a">
  <svg class="frame-bg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 423 667">
    <path data-name="frame-chassis" d="M375 0v651c0 5.9-3.2 11.1-8 13.9-2.3 1.4-5.1 2.1-8 2.1H16c-8.8 0-16-7.2-16-16V0h375z" class="c--red-1"/>
    <path data-name="frame-border" d="M423 0v651c0 8.8-7.2 16-16 16h-16c-8.8 0-16-7.2-16-16V0h48zM0 120v531c0 8.8 7.2 16 16 16h343c2.9 0 5.7-.8 8-2.1 4.8-2.8 8-7.9 8-13.9v-4H20V140h147l40-40.3h168v-20H207L167 120H0z" class="c--red-2"/>
  </svg>
  <div class="frame-layout">
    <!-- top lights -->
    <div id="top-lights">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 423 120">
        <path data-name="frame" d="M0 0h423v79.7H207L167 120H0z" class="c--red-1"/>
        <g data-name="blue-light">
          <circle data-name="border" cx="60" cy="60" r="40" class="c--grey-1"/>
          <circle data-name="fill-color" cx="60" cy="60" r="30" class="c--blue-3"/>
          <path data-name="shadow" class="c--blue-4" opacity=".2" d="M60 86.5c-14.6 0-26.5-11.9-26.5-26.5 0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5c0 9.6 7.9 17.5 17.5 17.5S77.5 69.6 77.5 60c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5c0 14.6-11.9 26.5-26.5 26.5z" />
          <circle data-name="light" opacity=".4" cx="60" cy="58.2" r="10.4" class="c--blue-2"/>
          <path d="M60 42.4c8.7 0 15.7 7.1 15.7 15.7 0 1.5-1.2 2.7-2.7 2.7-1.5 0-2.7-1.2-2.7-2.7 0-5.7-4.7-10.4-10.4-10.4s-10.4 4.7-10.4 10.4c0 1.5-1.2 2.7-2.7 2.7s-2.7-1.2-2.7-2.7c.2-8.6 7.2-15.7 15.9-15.7z" class="c--blue-1"/>
        </g>
      </svg>
      <div class="state-lights">
        <div class="state-light--red c--red-3"/>
        <div class="state-light--yellow c--yellow-2" :class="[{'sound-light--on': status === 'loading'}]"/>
        <div class="state-light--green c--green-1"/>
      </div>
    </div>
    <!--main screen-->
    <div id="main-screen">
      <svg class="main-screen__frame" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 315 313.7">
        <path class="c--grey-1" d="M315 8v293.2c0 4.4-3.6 8-8 8H50.5c-4.4 0-10.6-2.5-13.8-5.5l-30.8-29c-3.2-3-5.8-9.1-5.8-13.5V8c0-4.4 3.6-8 8-8h299c4.3 0 7.9 3.6 7.9 8z"/>
        <circle cx="137.3" cy="17.5" r="6" class="c--red-2"/>
        <circle cx="177.7" cy="17.5" r="6" class="c--red-2"/>
        <circle cx="40.4" cy="268.7" r="10" class="c--red-2"/>
        <path data-name="speakers" d="M227 258.7h60v8h-60v-8zm0 22h60v-8h-60v8zm0 14h60v-8h-60v8z" class="c--grey-3"/>
      </svg>
      <div class="main-screen__display lcd-green" >
        <screen-carousel :index="details ? 1 : 0" class="horizontal">
          <template v-slot:default>
            <div class="screen">

    <!--list-->
              <div v-if="list.length > 0" key="list" class="list screen__content" >
                <button v-for="(item, i) in filteredList" :key="`list-item-${i}`" class="list-item" :selected="item.id === index" @click="selectByItem(item)">
                  {{`${item.name}`}}
                  <div class="hint-arrow">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 17l5-5-5-5M6 17l5-5-5-5"/></svg>
                  </div>
                </button>
              </div>
            </div>
            <div class="screen" >

    <!--entry-->
              <screen-carousel class="vertical entry" :index="detailIndex">
                  <div class="hint">
                    <div>
                      <svg v-show="detailIndex > 0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 15l-6-6-6 6"/>
                      </svg>
                    </div>

                    <div>
                      {{`${detailIndex + 1}/${detailPanels}`}}
                    </div>
                    <div>
                      <svg v-show="detailIndex < detailPanels - 1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M6 9l6 6 6-6"/>
                      </svg>
                    </div>
                  </div>
                  <div class="screen">
                    <div class="sprite" v-if="selected" >
                      <img :key="selected.id" :src="sprite" :alt="selected.name">
                      <div class="label">{{selected.name}}</div>
                    </div>
                  </div>
                <template v-if="selected">
                  <div class="screen screen--entry">
                    <p>
                      {{selected.genera}}
                      <br>
                      {{selected.entry}}
                    </p>
                  </div>
                  <div class="screen">
                    <p>
                      {{`Habitat: ${selected.habitat}`}}
                      <br>
                      {{`Weight: ${parseFloat(selected.weight/10)}kg`}}
                      <br>
                      {{`Height: ${parseFloat(selected.height/10)}m`}}
                      <br>
                      {{`Type: ${selected.types.join(" / ")}`}}
                    </p>
                  </div>
                </template>
              </screen-carousel>
            </div>
          </template>
        </screen-carousel>
      </div>
    </div>
    <!--second screen-->
    <div id="second-screen" class="lcd-green">
      <div v-if="selected">
        {{selected.id | num}}
      </div>
    </div>
    <!-- buttons -->
    <label id="camera-btn" for="scanner">
      <input id="scanner" type="file" accept="image/*" capture="camera" />
      <div class="camera-btn__btn btn--icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><g transform="translate(2 3)"><path d="M20 16a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3l2-3h6l2 3h3a2 2 0 0 1 2 2v11z"/>
        <circle cx="10" cy="10" r="4"/></g></svg>
      </div>
    </label>
    <div id="buttons-ab">
      <button @click="spriteView.back = !spriteView.back"></button>
      <button @click="spriteView.shiny = !spriteView.shiny"></button>
    </div>
    <!-- d-pad -->
    <div id="d-pad" :pressed="pressed" >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 98 98">
        <path class="c--grey-4" d="M93.6 32.7c2.4 0 4.4 2 4.4 4.4v24c0 2.4-2 4.4-4.4 4.4h-24c-2.4 0-4.4 2-4.4 4.4v24c0 2.4-2 4.4-4.4 4.4H37c-2.4 0-4.4-2-4.4-4.4v-24c0-2.4-2-4.4-4.4-4.4h-24C2 65.3 0 63.4 0 61V37c0-2.4 2-4.4 4.4-4.4h24c2.4 0 4.4-2 4.4-4.4v-24C32.7 2 34.6 0 37 0h24c2.4 0 4.4 2 4.4 4.4v24c0 2.4 2 4.4 4.4 4.4h23.8z"/>
      </svg>
      <div class="d-pad__buttons">

      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 98 98">
        <path class="c--grey-3" d="M90 34H68c-2.2 0-4-1.8-4-4V8c0-2.2-1.8-4-4-4H38c-2.2 0-4 1.8-4 4v22c0 2.2-1.8 4-4 4H8c-2.2 0-4 1.8-4 4v22c0 2.2 1.8 4 4 4h22c2.2 0 4 1.8 4 4v22c0 2.2 1.8 4 4 4h22c2.2 0 4-1.8 4-4V68c0-2.2 1.8-4 4-4h22c2.2 0 4-1.8 4-4V38c0-2.2-1.8-4-4-4zM49 62c-7.2 0-13-5.8-13-13s5.8-13 13-13 13 5.8 13 13-5.8 13-13 13z"/>
      </svg>
        <button @click="up" ></button>
        <button @click="right"></button>
        <button @click="down"></button>
        <button @click="left"></button>
        <svg viewBox="0 0 98 98">
          <path class="c--grey-4" d="M22.7 44.3v9.5c0 .9-1 1.5-1.8 1.1l-8.2-4.7c-.8-.5-.8-1.7 0-2.1l8.2-4.7c.8-.7 1.8-.1 1.8.9zM54.8 77.1l-4.7 8.2c-.5.8-1.7.8-2.1 0l-4.7-8.2c-.5-.8.1-1.8 1.1-1.8h9.5c.8 0 1.4 1 .9 1.8zM43.2 20.9l4.7-8.2c.5-.8 1.7-.8 2.1 0l4.7 8.2c.5.8-.1 1.8-1.1 1.8h-9.5c-.8 0-1.4-1-.9-1.8zM85.3 50.1l-8.2 4.7c-.8.5-1.8-.1-1.8-1.1v-9.5c0-1 1-1.5 1.8-1.1l8.2 4.7c.9.6.9 1.8 0 2.3z"/>
        </svg>
      </div>
    </div>
  </div>

</div>
</template>

<script>
import ScreenCarousel from './ScreenCarousel'
import hotkeys from 'hotkeys-js'
import Hammer from 'hammerjs'
const wait = t => new Promise(resolve => setTimeout(resolve, t))
export default {
  name: 'PokedexFaceA',
  components: {
    ScreenCarousel
  },
  filters: {
    num: n => `#${n.toString().padStart(3,0)}`
  },
  data: () => ({
    detailIndex: 0,
    detailPanels: 3,
    lockNav: null,
    pressed: null,
    release: null,
    spriteView: {
      shiny: false,
      back: false
    }
  }),
  watch: {
    list (list) {
      if (list.length > 0) this.selectByIndex(1)
    },
    index (index) {
      this.$nextTick(this.scrollSelectedIntoView)
    },
    async details (details) {
      this.lockNav = true
      await wait(400) // animation length from one screen to another
      this.detailIndex = 0 // relocate panels in details screen
      this.lockNav = false
      if (!details) { // reset sprite view
        this.spriteView = {
          shiny: false,
          back: false
        }
      }
    }
  },
  computed: {
    list () { return this.$store.state.list },
    index () { return this.$store.state.index },
    selected: {
      get () { return this.$store.state.selected },
      set (value) { return this.$store.commit('setSelected', value) }
    },
    details: {
      get () { return this.$store.state.details },
      set (value) { this.$store.commit('setDetails', value)}
    },
    filter () { return this.$store.state.filter },
    filteredList () { return this.$store.getters.filteredList },
    size () { return this.$store.state.size },
    status () { return this.$store.state.status },
    sprite () {
      let {selected} = this
      let {shiny, back} = this.spriteView
      if (selected) {
        return selected.sprites[`${back ? 'back' : 'front'}_${shiny ? 'shiny' : 'default'}`]
      }
    }
  },
  mounted () {
    //this.selectByIndex(1)
    hotkeys('down', this.down )
    hotkeys('up', this.up )
    hotkeys('right', this.right)
    hotkeys('enter', e => this.hnav(e, 1))
    hotkeys('left', this.left)

    // Set hammer swipe gesture to anter/exit details
    let entry = this.$el.querySelector('.entry')
    const entryGestures = new Hammer(entry, {direction: Hammer.DIRECTION_ALL})
    entryGestures.on('swiperight', ev => {
      this.details = false
      ev.preventDefault()
    })
    const scrollV = direction => {
      if (!this.details) return
      this.detailIndex = Math.max(0, Math.min(this.detailPanels - 1, this.detailIndex + direction))
    }
  },
  methods: {
    releaseKey () {
      if (this.release)
      clearTimeout(this.release)
      this.release = setTimeout(() => {
        this.pressed = null
      }, 300)
    },
    down (e) {
      this.vnav(e, 1)
      this.pressed = "down"
      this.releaseKey()
    },
    up (e) {
      this.vnav(e, -1)
      this.pressed = "up"
      this.releaseKey()
    },
    right (e) {
      this.hnav(e, 1)
      this.pressed = "right"
      this.releaseKey()
    },
    left (e) {
      this.hnav(e, -1)
      this.pressed = "left"
      this.releaseKey()
    },
    vnav (e, direction) {
      e.preventDefault();
      if (this.lockNav) return
      if (this.details) {
        this.detailIndex = Math.max(0, Math.min(this.detailPanels - 1, this.detailIndex + direction))
      } else {
        this.scroll(direction)
      }
    },
    hnav (e, direction) {
      e.preventDefault();
      if (this.lockNav) return
      this.details = direction > 0
    },
    scrollSelectedIntoView () {
      let selected = this.$el.querySelector('[selected]')
      let screen_viewport = this.$el.querySelector(".main-screen__display")
      if (selected) {
        let selected_rect = selected.getBoundingClientRect()
        let viewport_rect = screen_viewport.getBoundingClientRect()
        //selected.scrollIntoView({block: 'end'})
        let aT = selected_rect.top
        let aB = selected_rect.bottom
        let bT = viewport_rect.top
        let bB = viewport_rect.bottom
        if (aT > bB || aB > bB) {
          selected.scrollIntoView({block: 'end'})
        } else if (aB < bT || aT < bT) {
          selected.scrollIntoView({block: 'start'})
        }
      }
    },
    scroll (i) {
      let {index} = this
      let newIndex = Math.max(1, Math.min(this.list.length, index + i))
      this.selectByIndex(newIndex)
    },
    selectByIndex (index) {
      let list = this.filteredList
      if (list.length < index) return
      this.$store.commit('setIndex', index)
      this.$store.commit('setSelected', list[index - 1])
    },
    selectByItem (item, details = true) {
      this.$store.commit('setIndex', item.id)
      this.$store.commit('setSelected', item)
      this.details = details
    }
  }
}
</script>

<style>
#pokedex__face-a {
  width: var(--w, 100%);
  height: var(--h, 100%);
}

#pokedex__face-a .frame-layout {
  --border: 18px;
  display: grid;
  row-gap: 16px;
  grid-template-rows: repeat(6, auto) minmax(var(--border), 1fr);
  grid-template-columns: var(--border) repeat(6, auto) var(--hinge-w);
}
#pokedex.small #pokedex__face-a .frame-layout {
  --border: 12px;
  grid-template-columns: var(--border) repeat(6, auto) var(--border);

}
/* TOP LIGHTS
  */
  #top-lights {
    width: var(--w);
    grid-column: 1/-1;
    grid-row: 1;
    filter: drop-shadow(-8px 2px 8px rgba(0,0,0,0.16));
    position: relative;
  }
  .state-lights {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    left: 129px;
    top: 30px;
    display: grid;
    grid-auto-flow: column;
    column-gap: 16px;
    grid-template-columns: repeat(3, 20px);
    height: 20px;
    min-width: 80px;
  }
  .state-lights>div {
    border-radius: 50%;
  }
  .state-light--yellow {
      --off-color: hsla(51, 100%, 40%, 0);
      --on-color: hsl(60, 100%, 50%, .25);
      position: relative;
  }
  .state-light--yellow::after {
    content: "";
    position: absolute;
    height: 100%;
    width: 100%;
    border-radius: 50%;
}

/* MAIN SCREEN
  */
  #main-screen {
    grid-column: 2/-2;
    grid-row: 2;
    --screen-w: calc( var(--w) - var(--hinge-w) - (var(--border) * 2) );
    --screen-h: calc( var(--screen-w) * 0.9 );
    width: var(--screen-w);
    height: var(--screen-h);
    justify-self: center;
    position: relative;
    z-index: 1;
  }
  #pokedex.small   #main-screen {
    --screen-w: calc( var(--w) - (var(--border) * 2) );
  }
  .main-screen__frame {
    width: 100%;
    height: 100%;
    filter: drop-shadow(0px 8px var(--grey-2)) drop-shadow(2px 8px 4px rgba(0,0,0,0.16));
  }
  .main-screen__display {
    position: absolute;
    --lcd-w: calc( var(--screen-w) * 0.81);
    --lcd-h: calc( var(--screen-h) * 0.62);
    left: 9%;
    top: 12.84%;
    font-size: 22px;
    border-radius: 16px;
    background: var(--green-2);
    border: solid 6px var(--grey-2);
    border-width: 6px 2px 0px 2px;
}

/*  SECOND SCREEN
 */
  #second-screen {
    --lcd-w: 128px;
    --lcd-h: 56px;
    grid-column: 3/5;
    grid-row: 4;
    justify-self: center;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 32px;
    border-radius: 8px;
    background: var(--green-2);
    border: solid 3px var(--red-3);
    border-width: 3px 1px 0px 1px;
}


/*  CAMERA BTN
  */
  #camera-btn {
    grid-row: 3;
    grid-column: 2;
    justify-self: center;
  }
  #camera-btn:hover {
    cursor: pointer;
  }
  #camera-btn > input[type="file"]{
    display: none;
  }
  .camera-btn__btn {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    background: var(--grey-4);
    box-shadow: 2px 2px 4px rgba(0,0,0,.4), -2px -2px 6px rgba(0,0,0,.16);
}

/*  BUTTONS AB
  */
  #buttons-ab {
    grid-column: 3/6;
    grid-row: 3;
    justify-self: center;
    display: grid;
    grid-auto-flow: column;
    column-gap: 8px;
  }
  #buttons-ab>button {
    width: 72px;
    height: 16px;
    border-radius: 4px;
    box-shadow: 2px 2px 4px rgba(0,0,0,.4), -2px -2px 8px rgba(0,0,0,.16);
  }
  #buttons-ab>button:first-of-type {
    background: var(--red-3);
  }
  #buttons-ab>button:nth-of-type(2) {
    background: var(--green-1);
  }
  #buttons-ab>button:active {
    box-shadow: 1px 1px 2px rgba(0,0,0,.4), -2px -2px 4px rgba(0,0,0,.16);
}


/* d-pad
  */
  #d-pad {
    grid-column: 5/-2;
    grid-row: 4/6;
    justify-self: center;
    --size: var(--dpad-size, 98px);
    width: var(--size);
    height: var(--size);
    filter: drop-shadow(0px 0px 8px rgba(0,0,0,.16));
  }

  .d-pad__buttons {
    perspective: 100px;
    transform-style: preserve-3d;
    transition: all ease .2s;
    will-change: transform;
  }
  #d-pad[pressed="left"] .d-pad__buttons {
    transform: translate3D(-4px, 0px, 20px) scaleX(1.05) rotateY(-25deg);
  }
  #d-pad[pressed="right"] .d-pad__buttons {
    transform: translate3D(4px, 0px, 20px) scaleX(1.05) rotateY(25deg);
  }
  #d-pad[pressed="down"] .d-pad__buttons {
    transform: translate3D(0,4px,20px) scaleY(1.05) rotateX(25deg);
  }
  #d-pad[pressed="up"] .d-pad__buttons {
    transform: translate3D(0,-4px,20px) scaleY(1.05) rotateX(-25deg);
  }
  .d-pad__buttons>button {
    position: absolute;
    --s: calc( var(--size) * 0.28 );
    width: var(--s);
    height: var(--s);
    background: var(--grey-3);
    transform-origin: center;
  }
  .d-pad__buttons>button:hover {
    cursor: pointer;
  }
  .d-pad__buttons>button:active {
    -webkit-tap-highlight-color: transparent;
  }
  .d-pad__buttons>button:nth-of-type(1) {
    left: calc(50% - (var(--s) / 2));
    top: calc( var(--s) * 0.15 );
  }
  .d-pad__buttons>button:nth-of-type(2) {
    top: calc(50% - (var(--s) / 2));
    right: calc( var(--s) * 0.15 );
  }
  .d-pad__buttons>button:nth-of-type(3) {
    right: calc(50% - (var(--s) / 2));
    bottom: calc( var(--s) * 0.15 );
  }
  .d-pad__buttons>button:nth-of-type(4) {
    top: calc(50% - (var(--s) / 2));
    left: calc( var(--s) * 0.15 );
  }
  .d-pad__buttons, .d-pad__buttons>svg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
  .d-pad__buttons>svg {
    user-select: none;
    pointer-events: none;
}

/*  LIST
  */
  .list {
    width: 100%;
    display: grid;
    grid-auto-flow: row;
    grid-auto-rows: min-content;
    opacity: 0;
    transition: opacity .5s cubic-bezier(.94,.01,.67,.76);
  }
  [screen="1"] .list {
    opacity: 1;
  }
  .list-item {
    width: var(--lcd-w);
    padding: 8px 16px;
    text-transform: capitalize;
    text-align: left;
    position: relative;
  }
  .list-item:hover,
  .list-item[selected] {
    background: rgba(0,0,0,0.16);
  }
  .list-item .hint-arrow {
    position: absolute;
    right: 0px;
    top: calc(50% - 12px);
    transform-origin: center center;
    display: none;
  }
  .list-item[selected] .hint-arrow {
    display: block;
    margin: auto;
    animation: hint-right 1.2s ease-out;
    animation-iteration-count: infinite;
  }
  .hint-arrow>svg{
    stroke: var(--green-3);
  }
  @keyframes hint-right {
    0% {
      transform: translateX(-100%);
      opacity: 1;
    }
    30% {
      transform: translateX(-100%);
      opacity: 1;
    }
    to {
      transform: translateX(0);
      opacity: 0;
    }
}

/*  ENTRY
  */
      .entry {
    opacity: 0;
    transition: opacity .5s cubic-bezier(.94,.01,.67,.76), margin .5s ease-in-out;
    will-change: opcity, margin;
  }
  .entry>.screen {
    padding: .6em;
    box-sizing: border-box;
  }
  .entry>.screen>* {
    pointer-events: none;
    user-select: none;
  }
  .screen-carousel.horizontal[screen="2"] .entry {
    opacity: 1;
  }
  .sprite {
    position: relative;
    display: flex;
    justify-content: center;
  }
  .sprite>.label {
    position: absolute;
    top: .3em;
    left: 0;
    width: 100%;
    text-align: center;
    text-transform: capitalize;
  }
  .sprite>img {
    width: auto;
    margin-top: 1em;
    height: calc( var(--lcd-h) - 1em);
    image-rendering: pixelated;
    image-rendering: -moz-crisp-edges;
    image-rendering: crisp-edges;
    filter: brightness(95%) contrast(80%) saturate(95%) drop-shadow(2px 2px 4px rgba(0,0,0,.4)) opacity(80%);
  }
  #pokedex.large .sprite>.label {
    display: none;
  }
  #pokedex.large .sprite>img {
    margin-top: 0;
    height: var(--lcd-h);
  }
  .entry .hint {
    display: grid;
    grid-auto-flow: row;
    grid-template-rows: 24px auto 24px;
    row-gap: 8px;
    position: absolute;
    bottom: 0px;
    top: 0px;
    right: 8px;
    color: var(--green-3);
    opacity: .8;
    align-content: center;
  }
  .entry .hint>svg {
    stroke: var(--green-3);
  }
  .screen--entry p {
    margin: 0;
    padding-right: 24px;
}

/*
  #pokedex[state="processing"] [data-name="yellow-light"]>circle {
    --off-color: var(--yellow-2);
    --on-color: var(--yellow-1);
    animation: blip .3s ease infinite both;
  }
  #pokedex[state="success"] [data-name="green-light"]>circle {
    --off-color: var(--green-1);
    --on-color: var(--green-0);
    animation: blip .9s ease backwards;
    animation-iteration-count: 1;
}
.speaking blue-light {
	filter: drop-shadow(0 0 16px rgba(255,255,255,1)) brightness(110%);
}
 */
</style>
