export interface AdminSession {
  u: string;
  role: string;
}

export async function getSession(): Promise<AdminSession | null> {
  return { u: 'admin', role: 'admin' };
}
