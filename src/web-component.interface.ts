/**
 * Seems like this is something that should already exist, but I cannot find it.
 *
 * Searched for it using:
 *
 * ```sh
 * grep -R 'attributeChangedCallback' node_modules/typescript/
 * ```
 */
export interface CustomWebComponentInterface extends HTMLElement {
  adoptedCallback?: () => void;
  attributeChangedCallback?: (name: string, oldValue: string | null, newValue: string | null) => void;
  connectedCallback?: () => void;
  disconnectedCallback?: () => void;
}
