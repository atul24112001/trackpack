export function getInitials(str: string, length: number) {
  let initial = "";
  const wordArray = str.split(" ");
  for (let i = 0; i < Math.min(length, wordArray.length); i++) {
    initial += wordArray[i][0] || "";
  }
  return initial;
}
