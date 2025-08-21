import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface AppState {
  userId: string;
  accessToken: string;
}

export interface AppActions {
  setUserId: (userId: string) => void;
  setAccessToken: (accessToken: string) => void;
  logout: () => void;

  showLogin: boolean;
  setShowLogin: (showLogin: boolean) => void;
}

export type AppStore = AppState & AppActions;

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set) => ({
        userId: '',
        accessToken: '',
        setUserId: (userId: string) => set({ userId }),
        setAccessToken: (accessToken: string) => set({ accessToken }),
        logout: () =>
          set({
            userId: '',
            accessToken: '',
          }),

        showLogin: false,
        setShowLogin: (showLogin: boolean) => set({ showLogin }),
      }),
      {
        name: 'app-store', // localStorage 的 key
        partialize: (state: AppStore) => ({
          userId: state.userId,
          accessToken: state.accessToken,
        }),
      }
    ),
    {
      name: 'app-store', // name in Redux DevTools
    }
  )
);

export const useUserId = () => useAppStore((state) => state.userId);
export const useAccessToken = () => useAppStore((state) => state.accessToken);
export const useIsLogin = () => useAppStore((state) => !!state.userId);
