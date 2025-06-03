// utils/calculateOverlaps.ts
import { ICalendarEventBase } from "react-native-big-calendar";

export function calculateOverlaps<T extends ICalendarEventBase>(events: T[]): (T & { overlapCount: number; overlapPosition: number })[] {
  const enrichedEvents: (T & { overlapCount: number; overlapPosition: number })[] = [];

  const sortedEvents = [...events].sort((a, b) => a.start.getTime() - b.start.getTime());

  for (let i = 0; i < sortedEvents.length; i++) {
    const currentEvent = sortedEvents[i];
    const overlappingGroup: T[] = [];

    for (let j = 0; j < sortedEvents.length; j++) {
      const compareEvent = sortedEvents[j];

      if (currentEvent.start < compareEvent.end && currentEvent.end > compareEvent.start) {
        overlappingGroup.push(compareEvent);
      }
    }

    const overlapCount = overlappingGroup.length;

    const overlapPosition = overlappingGroup.sort((a, b) => a.start.getTime() - b.start.getTime()).findIndex((e) => e === currentEvent);

    enrichedEvents.push({
      ...currentEvent,
      overlapCount,
      overlapPosition,
    });
  }

  return enrichedEvents;
}
