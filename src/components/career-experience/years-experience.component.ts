import type { CustomWebComponentInterface } from '~/web-component.interface';

import { yearsOfExperience } from './years-experience.util';

/**
 * Sets the current years of experience based on the `startYear` attribute.
 *
 * Note: this does not update automatically over time, only on page load/component connected.
 */
export class YearsOfExperience extends HTMLElement implements CustomWebComponentInterface {
  private _timeEl: HTMLTimeElement | null | undefined;

  public connectedCallback(): void {
    this._timeEl = this.querySelector('time');
    this._update();
  }

  private _update(): void {
    if (this._timeEl) {
      const startYear = this._timeEl.getAttribute('datetime');
      if (startYear) {
        this._timeEl.textContent = yearsOfExperience(startYear);
      }
    }
  }
}

// Safari doesn't support custom built-in elements: https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/is
// Plus the syntax `<time is="years-of-experience"` is ugly IMHO.
// customElements.define('years-of-experience', YearsOfExperience, { extends: 'time' });

customElements.define('rob-years-of-experience', YearsOfExperience);
