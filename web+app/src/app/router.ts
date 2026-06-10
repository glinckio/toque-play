export type Route =
  | 'splash'
  | 'login'
  | 'register'
  | 'home'
  | 'explore'
  | 'create'
  | 'notifications'
  | 'profile'
  | 'teams'
  | 'team-detail'
  | 'my-tournaments'
  | 'my-refereeing'
  | 'matches'
  | 'tournament'
  | 'create-tournament'
  | 'create-friendly'
  | 'friendly'
  | 'match'
  | 'referee-enter'
  | 'referee-code'
  | 'tournament-register';

export interface Nav {
  go: (route: Route, param?: string) => void;
  back: () => void;
}
