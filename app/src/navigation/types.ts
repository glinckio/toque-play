export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  VerifyEmail: { email: string };
  EmailConfirmation: undefined;
  EmailConfirmed: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Explore: undefined;
  Teams: undefined;
  Notifications: undefined;
  Profile: undefined;
};

export type TournamentStackParamList = {
  TournamentDetail: { tournamentId: string };
  RegistrationTeamSelect: { tournamentId: string };
  RegistrationMemberSelect: { tournamentId: string; teamId: string; categoryId: string; minMembers: number; maxMembers: number };
  RegistrationSummary: { registrationId: string };
  PaymentWebView: { checkoutUrl: string; registrationId: string };
  BracketView: { tournamentId: string; categoryId?: string };
  LiveMatch: { matchId: string; tournamentId?: string };
  CreateTournament: { tournamentId?: string } | undefined;
};

export type TeamStackParamList = {
  TeamDetail: { teamId: string };
  AddMember: {
    teamId: string;
    memberId?: string;
    isGuest?: boolean;
    guestName?: string;
    memberName?: string;
    positions?: import('../types/team').VolleyballPosition[];
  };
};

export type FriendlyStackParamList = {
  FriendlyDetail: { friendlyId: string };
  CreateFriendly: { challengedTeamId?: string; challengedTeamName?: string };
  MyFriendlies: undefined;
  LiveMatch: { matchId: string };
};

export type RootStackParamList = {
  Main: undefined;
  Tournament: { screen: string; params?: any };
  Team: { screen: string; params?: any };
  Friendly: { screen: string; params?: any };
  RefereeCodeEntry: undefined;
  MyReferees: undefined;
  MyTournaments: undefined;
  MyRegistrations: undefined;
  MyTeams: undefined;
  MyFriendlies: undefined;
  CreateSheet: undefined;
  EditProfile: undefined;
  PrivacyConsents: undefined;
  DataExport: undefined;
  DeleteAccount: undefined;
};
