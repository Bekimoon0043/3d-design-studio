import { useState } from 'react';

/** Minimal local-only auth stub for testing (no Supabase). */
export interface LocalUser {
  id: string;
  email: string;
}

interface AuthState {
  user: LocalUser | null;
  loading: boolean;
}

/**
 * Local testing mode: always signed in as a guest.
 * Persistence uses browser localStorage — no cloud account needed.
 */
export function useAuth(): AuthState {
  const [user] = useState<LocalUser | null>({
    id: 'local-user',
    email: 'guest@local',
  });

  return { user, loading: false };
}
