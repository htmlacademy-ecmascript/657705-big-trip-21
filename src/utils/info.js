function getDestinationsTemplate(destinations, length) {
  const dash = '&nbsp;&mdash;&nbsp;';

  if (length === 1) {
    return destinations[0];
  }

  if (length >= 2 && length <= 3) {
    return destinations.join(dash);
  }

  return `${destinations[0]}${dash}...${dash}${destinations[1]}`;
}

export { getDestinationsTemplate };
