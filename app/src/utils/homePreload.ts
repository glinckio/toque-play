import { homeService } from '../services/home';
import { teamService } from '../services/team';
import type { DashboardData } from '../types/home';
import type { Team } from '../types/team';

interface PreloadedData {
  dashboard: DashboardData | null;
  teams: Team[];
  timestamp: number;
}

let cache: PreloadedData | null = null;

export async function preloadHomeData() {
  try {
    const [dash, teamsData] = await Promise.all([
      homeService.getDashboard().catch(() => null),
      teamService.findAll().catch(() => []),
    ]);
    cache = { dashboard: dash, teams: teamsData, timestamp: Date.now() };
  } catch {
    // Silent — HomeScreen will fetch normally
  }
}

export function consumePreloadedHomeData(): PreloadedData | null {
  if (!cache) return null;
  const data = cache;
  cache = null;
  return data;
}
