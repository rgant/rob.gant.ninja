import type { CustomWebComponentInterface } from '~/web-component.interface';
import { yearsOfExperience } from '~/years-experience.util';

const ATTR = 'startYear';

/**
 * Sets the current years of experience based on the `startYear` attribute.
 * Also sets a title attribute to the startYear just for fun.
 *
 * Note: this does not update automatically over time, unless the attribute changes.
 */
export class YearsOfExperience extends HTMLElement implements CustomWebComponentInterface {
  public static observedAttributes: string[] = [ ATTR ];

  public attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void {
    if (name === ATTR && newValue != undefined) {
      this._update(newValue);
    }
  }

  public connectedCallback(): void {
    const startYear = this.getAttribute(ATTR);
    if (startYear) {
      this._update(startYear);
    }
  }

  private _update(startYear: string): void {
    this.textContent = yearsOfExperience(startYear);
    this.title = startYear;
  }
}

// Safari doesn't support custom built-in elements: https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/is
// Plus the syntax `<time is="years-of-experience"` is ugly IMHO.
// customElements.define('years-of-experience', YearsOfExperience, { extends: 'time' });

customElements.define('rob-years-of-experience', YearsOfExperience);
