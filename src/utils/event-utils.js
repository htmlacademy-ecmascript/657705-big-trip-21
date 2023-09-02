function getUpdatedEvents(events, updatedEvent) {
  return events.map((event) => event.id === updatedEvent.id ? updatedEvent : event);
}

export { getUpdatedEvents };
