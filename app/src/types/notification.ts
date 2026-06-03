export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: string;
  referenceId: string | null;
  read: boolean;
  createdAt: string;
}
