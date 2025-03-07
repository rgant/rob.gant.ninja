/**
 * index.astro needs to pre-fill the custom <years-of-experience> component with a static value for
 * user-agents that don't execute JavaScript like web crawlers from search engines.
 * Cannot use the YearsOfExperience class because node doesn't know what HTMLTimeElement is.
 */

/** Maps number to English. Limited to my expected career span. */
const numToEnglish = new Map<number, string>([
  /* eslint-disable @typescript-eslint/no-magic-numbers */
  // [ 0, '' ], // zero should never be returned by output, so let this throw an error!
  [ 1, 'one' ],
  [ 2, 'two' ],
  [ 3, 'three' ],
  [ 4, 'four' ],
  [ 5, 'five' ],
  [ 6, 'six' ],
  [ 7, 'seven' ],
  [ 8, 'eight' ],
  [ 9, 'nine' ],
  [ 20, 'twenty' ],
  [ 30, 'thirty' ],
  [ 40, 'forty' ],
  [ 50, 'fifty' ],
  [ 60, 'sixty' ],
  /* eslint-enable @typescript-eslint/no-magic-numbers */
]);

const TENS_DIVISOR = 10;

/**
 * Type safe lookup of the number to English map.
 *
 * @throws TypeError - numToEnglish Map has no entry for num
 */
const numbersToEnglish = (num: number): string => {
  const val = numToEnglish.get(num);

  if (typeof val !== 'string') {
    throw new TypeError(`${num} has no defined english word`);
  }

  return val;
};

/**
 * Display the number of years since the start year.
 * This is setup only for my expected career span, which simplifies things greatly.
 *
 * @param careerStart - String because this value sometimes comes from the DOM.
 * @param now - Has a default because this is really only here for testing.
 *
 * @throws TypeError - careerStart is not a number
 *
 * @example
 * ```ts
 * YearsOfExperience.yearsOfExperience('2002');
 * // Returns 'twenty-three' (in 2025)
 * ```
 */
export const yearsOfExperience = (careerStart: string, now: Date = new Date()): string => {
  const startYear = Number(careerStart);
  if (Number.isNaN(startYear)) {
    throw new TypeError(`${careerStart} is not a number`);
  }
  const years = Math.abs(now.getFullYear() - startYear);

  // Round the years to decades for lookup of english name
  const tens = Math.floor(years / TENS_DIVISOR) * TENS_DIVISOR;
  const decade = numbersToEnglish(tens);
  const ones = years % TENS_DIVISOR;

  if (ones > 0) {
    const ennium = numbersToEnglish(ones);
    return `${decade}-${ennium} years`;
  }

  return `${decade} years`;
};
