const styles = ":host { display: block; font-family: 'DM Sans', sans-serif; }\n.counter-widget { display: flex; flex-direction: column; gap: 10px; }\n.ctr-display {\n  background: #fafaf8; border: 1px solid #f0ede8; border-radius: 8px;\n  padding: 1.25rem; display: flex; flex-direction: column;\n  align-items: center; gap: 6px;\n}\n.ctr-num {\n  font-family: 'DM Mono', monospace; font-size: 48px; font-weight: 500;\n  color: #dd0031; line-height: 1; letter-spacing: -0.04em;\n  transition: transform 0.1s;\n}\n.ctr-num.bump { transform: scale(1.12); }\n.ctr-sublabel { font-size: 10px; color: #b0ada6; letter-spacing: 0.08em; text-transform: uppercase; font-family: 'DM Mono', monospace; }\n.step-row { display: flex; align-items: center; gap: 8px; font-size: 11px; color: #7a7870; font-family: 'DM Mono', monospace; margin-top: 4px; }\n.step-input {\n  width: 50px; border: 1px solid #e8e6e0; border-radius: 5px;\n  padding: 4px 6px; font-family: 'DM Mono', monospace; font-size: 12px;\n  text-align: center; outline: none; background: #fff;\n}\n.step-input:focus { border-color: #dd0031; }\n.ctr-controls { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; }\n.ctr-btn {\n  padding: 8px; border-radius: 6px; cursor: pointer;\n  border: 1px solid rgba(221,0,49,0.25); background: rgba(221,0,49,0.06);\n  color: #dd0031; font-family: 'DM Mono', monospace; font-size: 16px;\n  display: flex; align-items: center; justify-content: center;\n  transition: background 0.15s, transform 0.1s;\n}\n.ctr-btn:hover { background: rgba(221,0,49,0.12); }\n.ctr-btn:active { transform: scale(0.95); }\n.ctr-btn.reset { font-size: 10px; letter-spacing: 0.06em; }\n.log-label { font-family: 'DM Mono', monospace; font-size: 10px; color: #b0ada6; text-transform: uppercase; letter-spacing: 0.1em; }\n.event-log {\n  background: #fafaf8; border: 1px solid #f0ede8; border-radius: 6px;\n  padding: 8px 10px; font-family: 'DM Mono', monospace; font-size: 10px;\n  color: #b0ada6; max-height: 90px; overflow-y: auto;\n  display: flex; flex-direction: column-reverse; gap: 1px;\n}\n.op { color: #dd0031; }\n.log-hint { color: #b0ada6; }\n";

/**
 * CounterWidget — Angular-style Web Component
 *
 * Follows Angular's class + template + lifecycle pattern using
 * native Custom Elements so it mounts into any shell framework.
 */

class CounterWidget extends HTMLElement {
  // --- Angular-style: component state (like signals) ---
  #count = 0
  #step = 1
  #log = []

  // --- Angular lifecycle: connectedCallback = ngOnInit ---
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.#render();
    this.#bindEvents();
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
    this.shadowRoot.innerHTML = this.#template();
  }

  // --- Angular-style: event binding (like @HostListener) ---
  #bindEvents() {
    const root = this.shadowRoot;
    root.getElementById('btn-inc').addEventListener('click', () => this.#act('inc'));
    root.getElementById('btn-dec').addEventListener('click', () => this.#act('dec'));
    root.getElementById('btn-rst').addEventListener('click', () => this.#act('reset'));
    root.getElementById('step-input').addEventListener('change', (e) => {
      this.#step = Math.max(1, parseInt(e.target.value) || 1);
    });
  }

  // --- Angular-style: action handler (like a method in a component class) ---
  #act(op) {
    if (op === 'inc')   this.#count += this.#step;
    else if (op === 'dec') this.#count -= this.#step;
    else                this.#count = 0;

    const numEl = this.shadowRoot.getElementById('ctr-num');
    numEl.classList.add('bump');
    setTimeout(() => numEl.classList.remove('bump'), 120);
    numEl.textContent = this.#count;

    const ts = new Date().toLocaleTimeString('en-US', { hour12: false });
    const label = op === 'inc' ? `+${this.#step}` : op === 'dec' ? `-${this.#step}` : 'reset';
    this.#log.unshift({ ts, label, result: this.#count });
    if (this.#log.length > 15) this.#log.pop();

    const logEl = this.shadowRoot.getElementById('event-log');
    logEl.innerHTML = this.#log
      .map(e => `<div>[${e.ts}] <span class="op">${e.label}</span> → ${e.result}</div>`)
      .join('');
  }
}

// Register as a Custom Element — usable as <counter-widget> in any shell
customElements.define('counter-widget', CounterWidget);

export { CounterWidget as default };
