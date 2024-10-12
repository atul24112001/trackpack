export function getInitials(
  str: string,
  length: number,
  pattern: string = " "
) {
  let initial = "";
  const wordArray = str.split(pattern) || ["A"];
  for (let i = 0; i < Math.min(length, wordArray.length); i++) {
    initial += wordArray[i][0] || "";
  }
  return initial;
}
