import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface AppState {
  accessToken: string;
}

export interface AppActions {
  setAccessToken: (accessToken: string) => void;
  logout: () => void;
}

export type AppStore = AppState & AppActions;

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set) => ({
        accessToken: '',
        setAccessToken: (accessToken: string) => set({ accessToken }),
        logout: () =>
          set({
            accessToken: '',
          }),
      }),
      {
        name: 'app-store', // localStorage 的 key
        partialize: (state: AppStore) => ({
          accessToken: state.accessToken,
        }),
      }
    ),
    {
      name: 'app-store', // name in Redux DevTools
    }
  )
);

export const useAccessToken = () => useAppStore((state) => state.accessToken);
export const useIsLogin = () => useAppStore((state) => !!state.accessToken);
