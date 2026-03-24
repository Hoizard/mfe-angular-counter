/**
 * CounterWidget — Angular-style Web Component
 *
 * Follows Angular's class + template + lifecycle pattern using
 * native Custom Elements so it mounts into any shell framework.
 */
import styles from './counter.css?inline'

class CounterWidget extends HTMLElement {
  // --- Angular-style: component state (like signals) ---
  #count = 0
  #step = 1
  #log = []

  // --- Angular lifecycle: connectedCallback = ngOnInit ---
  connectedCallback() {
    this.attachShadow({ mode: 'open' })
    this.#render()
    this.#bindEvents()
  }

  // --- Angular-style template method ---
  #template() {
    return `
      <style>${styles}</style>
      <div class="counter-widget">
        <div class="ctr-display">
          <div class="ctr-num" id="ctr-num">${this.#count}</div>
          <div class="ctr-sublabel">current value</div>
          <div class="step-row">
            step: <input id="step-input" type="number" value="${this.#step}" min="1" max="99" class="step-input" />
          </div>
        </div>

        <div class="ctr-controls">
          <button class="ctr-btn" id="btn-dec">−</button>
          <button class="ctr-btn reset" id="btn-rst">RESET</button>
          <button class="ctr-btn" id="btn-inc">+</button>
        </div>

        <div class="log-label">Event Log</div>
        <div class="event-log" id="event-log">
          <div class="log-hint">// awaiting events…</div>
        </div>
      </div>
    `
  }

  #render() {
    this.shadowRoot.innerHTML = this.#template()
  }

  // --- Angular-style: event binding (like @HostListener) ---
  #bindEvents() {
    const root = this.shadowRoot
    root.getElementById('btn-inc').addEventListener('click', () => this.#act('inc'))
    root.getElementById('btn-dec').addEventListener('click', () => this.#act('dec'))
    root.getElementById('btn-rst').addEventListener('click', () => this.#act('reset'))
    root.getElementById('step-input').addEventListener('change', (e) => {
      this.#step = Math.max(1, parseInt(e.target.value) || 1)
    })
  }

  // --- Angular-style: action handler (like a method in a component class) ---
  #act(op) {
    if (op === 'inc')   this.#count += this.#step
    else if (op === 'dec') this.#count -= this.#step
    else                this.#count = 0

    const numEl = this.shadowRoot.getElementById('ctr-num')
    numEl.classList.add('bump')
    setTimeout(() => numEl.classList.remove('bump'), 120)
    numEl.textContent = this.#count

    const ts = new Date().toLocaleTimeString('en-US', { hour12: false })
    const label = op === 'inc' ? `+${this.#step}` : op === 'dec' ? `-${this.#step}` : 'reset'
    this.#log.unshift({ ts, label, result: this.#count })
    if (this.#log.length > 15) this.#log.pop()

    const logEl = this.shadowRoot.getElementById('event-log')
    logEl.innerHTML = this.#log
      .map(e => `<div>[${e.ts}] <span class="op">${e.label}</span> → ${e.result}</div>`)
      .join('')
  }
}

// Register as a Custom Element — usable as <counter-widget> in any shell
customElements.define('counter-widget', CounterWidget)

export default CounterWidget
