function getRandomInt(a = 1, b = 0) {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
}

function getRandomArrayElement(items) {
  return items[getRandomInt(0, items.length - 1)];
}

export {
  getRandomArrayElement,
  getRandomInt,
};
