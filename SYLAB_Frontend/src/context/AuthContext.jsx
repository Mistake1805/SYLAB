import { createContext, useCallback, useContext, useMemo, useState } from 'react';

// =========================================================================
// AuthContext — lightweight mock session for the SYLAB front-end flow.
//
// There is no live backend yet, so this holds session state in memory only.
// It exists purely to gate the Login -> Home -> Dashboard journey and to give
// downstream components a `user` object. When a real API lands, swap the body
// of `enter()` / `exit()` for real network calls.
// =========================================================================

const AuthContext = createContext(null);

const DEFAULT_USER = {
  name: 'Developer',
  handle: 'sylab_dev',
  tier: 'Platinum',
  rank: 142,
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(true);

  // "Continue" from the Login page — creates a mock session.
  const enter = useCallback(() => {
    setUser(DEFAULT_USER);
  }, []);

  // "Enter SYLAB" / sign out.
  const exit = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), ready, enter, exit }),
    [user, ready, enter, exit],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
