/**
 * Replaces the line breaks with a space.
 *
 * @param text - Some text
 */
export const removeLineBreaks = (text: string): string => {
  return text.replace(/(\r\n|\n|\r)/gm, ' ').replace(/\s+/g, ' ');
};

/**
 * Parses used_memory to an integer.
 *
 * @param info - Memory consumption related information
 */
export const parseUsedMemory = (info: string): number => {
  const start = info.indexOf('used_memory');
  const end = info.indexOf('used_memory_human') - 1;
  if (start < 0 || end < 0) return 0;
  return Number.parseInt(info.slice(start, end).split(':')[1], 10);
};
