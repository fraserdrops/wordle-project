export function isSameDay(dateA: Date, dateB: Date) {
  return (
    dateA.getDate() === dateB.getDate() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getFullYear() === dateB.getFullYear()
  );
}

export function isSameMinute(dateA: Date, dateB: Date) {
  return (
    isSameDay(dateA, dateB) &&
    dateA.getHours() === dateB.getHours() &&
    dateA.getMinutes() === dateB.getMinutes()
  );
}

export const isLetter = (keyValue: string) => {
  return keyValue.length === 1 && /[a-zA-Z]/.test(keyValue);
};

export function ordinal_suffix_of(i: number) {
  var j = i % 10,
    k = i % 100;
  if (j == 1 && k != 11) {
    return i + "st";
  }
  if (j == 2 && k != 12) {
    return i + "nd";
  }
  if (j == 3 && k != 13) {
    return i + "rd";
  }
  return i + "th";
}
