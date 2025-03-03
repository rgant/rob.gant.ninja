export const unwrap = (strings: TemplateStringsArray, ...values: string[]): string => {
  let result = '';

  for (const [ indx, str ] of strings.entries()) {
    result += str.replaceAll(/\s*\n\s*/gu, ' ');
    result += values[indx] ?? '';
  }

  return result.trim();
};
