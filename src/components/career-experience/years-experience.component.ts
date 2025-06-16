import { BaseCustomElement } from '~/custom-element.base';
import type { CustomWebComponentInterface } from '~/web-component.interface';

import { yearsOfExperience } from './years-experience.util';

/**
 * Sets the current years of experience based on the `startYear` attribute.
 *
 * Note: this does not update automatically over time, only on page load/component connected.
 */
export class YearsOfExperience extends BaseCustomElement implements CustomWebComponentInterface {
  public static override readonly tag: string = 'rob-years-of-experience';

  private _timeEl: HTMLTimeElement | null | undefined;

  /**
   * Static initialization block that automatically defines the custom element when the class is loaded.
   *
   * This block executes immediately when the class is evaluated, enabling automatic registration
   * without requiring manual calls to customElements.define().
   *
   * Static blocks are a ES2022 feature that run once when the class is first evaluated.
   */
  static {
    this.define(this.tag);
  }

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
