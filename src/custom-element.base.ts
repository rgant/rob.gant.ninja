/**
 * Base class for custom web components providing automatic registration and lifecycle management.
 *
 * Based on the pattern from: https://til.jakelazaroff.com/html/define-a-custom-element/
 *
 * Extends HTMLElement and provides static registration methods with collision detection.
 * Individual components should implement CustomWebComponentInterface for proper lifecycle method typing.
 */
export class BaseCustomElement extends HTMLElement {
  // Can't use static abstract, so just static
  public static readonly tag: string;

  constructor() {
    super();
    if (this.constructor === BaseCustomElement) {
      // Prevent direct instantiation of base class
      // Note: We use runtime checks instead of abstract class due to TypeScript limitations:
      // - Can't use `static abstract` together
      // - Abstract constructors can't be assigned to CustomElementConstructor type
      // - Would require unsafe type assertions in define() method
      throw new TypeError('BaseCustomElement cannot be instantiated directly - extend it instead');
    }
  }

  public static define(tagName: string = this.tag): void {
    if (this === BaseCustomElement) {
      throw new TypeError('BaseCustomElement cannot be used directly - extend it instead');
    }

    if (!tagName) {
      throw new TypeError(`${this.name} must define a tag name`);
    }

    if (!tagName.includes('-')) {
      throw new TypeError(`Custom element tag "${tagName}" must contain a hyphen`);
    }

    // Check if this class is already registered
    const existingName = customElements.getName(this);
    if (existingName) {
      console.warn(`${this.name} already defined as <${existingName}>`);
      return;
    }

    // Check if tag is already taken by different class
    const existingClass = customElements.get(tagName);
    if (existingClass && existingClass !== this) {
      throw new DOMException(
        `Failed to define custom element: the name "${tagName}" is already used by ${existingClass.name}`,
        'NotSupportedError',
      );
    }

    customElements.define(tagName, this);
  }
}
