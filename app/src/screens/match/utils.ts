export function cleanName(name?: string | null): string {
  return name?.replace('[Seed T] ', '') ?? 'TBD';
}

interface TimelineEvent {
  type: string;
  team?: 'A' | 'B';
  setNumber?: number;
  scoreA?: number;
  scoreB?: number;
  timestamp: string;
}

export function getFilteredEvents(
  timelineEvents: any[],
  socketEvents: any[],
  selectedSet: number | null,
  currentSetNum: number,
  isLive: boolean,
): any[] {
  const activeSet = selectedSet ?? currentSetNum;
  const apiFiltered = timelineEvents.filter(
    (ev: any) => ev.setNumber === activeSet || ev.type === 'MATCH_START' || ev.type === 'MATCH_FINISH',
  );
  if (activeSet === currentSetNum && isLive) {
    const newestApiTs =
      apiFiltered.length > 0 ? new Date(apiFiltered[0].timestamp).getTime() : 0;
    const newSocketEvents = socketEvents.filter(
      (ev: any) =>
        (ev.setNumber === activeSet || ev.setNumber === undefined) &&
        new Date(ev.timestamp).getTime() > newestApiTs,
    );
    return [...newSocketEvents, ...apiFiltered];
  }
  return apiFiltered;
}
