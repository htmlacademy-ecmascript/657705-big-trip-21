function getUpdatedEvents(events, updatedEvent) {
  return events.map((event) => event.id === updatedEvent.event.id ? updatedEvent.event : event);
}

export { getUpdatedEvents };
