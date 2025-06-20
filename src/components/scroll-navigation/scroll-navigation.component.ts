import type { CustomWebComponentInterface } from '~/web-component.interface';

export class ScrollNav extends HTMLElement implements CustomWebComponentInterface {
  public static readonly tag: string = 'rob-scroll-nav';

  /** Connects the list element (<li>) with the article element for each navigation link. */
  private readonly _articleToListMap: Map<Element, HTMLElement>;

  /** Connects the anchor element to the parent list element. */
  private readonly _listToAnchorMap: Map<HTMLElement, HTMLElement>;

  private readonly _observer: IntersectionObserver;

  /**
   * Static initialization block that automatically defines the custom element when the class is loaded.
   *
   * This block executes immediately when the class is evaluated, enabling automatic registration
   * without requiring manual calls to customElements.define().
   *
   * Static blocks are a ES2022 feature that run once when the class is first evaluated.
   */
  static {
    customElements.define(this.tag, this);
  }

  constructor() {
    super();

    this._articleToListMap = new Map<Element, HTMLElement>();
    this._listToAnchorMap = new Map<HTMLElement, HTMLElement>();

    // Since the <article>s can be larger than the viewport we cannot use a threshold because a large
    // enough section might never clear the threshold. This rootMargin is setup to trigger when the
    // top of the element is within 20% of the viewport's height from the top.
    const options: IntersectionObserverInit = {
      // This makes the scroll area root a single line 20% down from the top of the viewport.
      // Which makes it so only a single section enabled at once.
      rootMargin: '-20% 0px -80%', // Unlike CSS these must be 0px
      threshold: 0,
    };
    this._observer = new IntersectionObserver(this._toggleSelected, options);
  }

  public connectedCallback(): void {
    this._initialize();
  }

  /** Remove the observer to prevent memory leaks. */
  public disconnectedCallback(): void {
    this._observer.disconnect();
  }

  /**
   * Lookup the locations in the page for each hash link in the navigation contained by this component.
   * Will skip links that
   */
  private _initialize(): void {
    const anchors = this.querySelectorAll('a');
    for (const anchorEl of anchors) {
      const { hash, pathname } = anchorEl;
      if (hash && pathname === globalThis.location.pathname) {
        // 'selected' class is set on the anchor's parent list element (<li>)
        const { parentElement: listEl } = anchorEl;
        const articleEl = document.querySelector(hash);
        if (articleEl && listEl) {
          this._articleToListMap.set(articleEl, listEl);
          this._listToAnchorMap.set(listEl, anchorEl);
          this._observer.observe(articleEl);
        }
      }
    }
  }

  /**
   * It is possible for multiple entries to be `isIntersecting` at the same time if the scrolling
   * area root is large enough for the `threshold` to apply to multiple entries. But since some
   * sections are larger than the viewport `thresholds` larger than 0 is a problem.
   * The workaround is to set `rootMargin: '-20% 0px -80%'` so there can only be one entry in the
   * observed region at a time.
   */
  private readonly _toggleSelected = (entries: IntersectionObserverEntry[]): void => {
    for (const entry of entries) {
      const { isIntersecting, target: articleEl } = entry;
      const listEl = this._articleToListMap.get(articleEl);

      if (listEl) {
        listEl.classList.toggle('selected', isIntersecting);

        const anchorEl = this._listToAnchorMap.get(listEl);
        if (anchorEl) {
          anchorEl.ariaCurrent = isIntersecting ? 'location' : 'false';
        } else {
          console.error('List', listEl, 'has no anchorEl in _listToAnchorMap');
        }
      } else {
        console.error('Article', articleEl, 'has no listEl in _articleToListMap');
      }
    }
  };
}
