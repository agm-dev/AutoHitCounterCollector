import { ElectronAPI } from '@electron-toolkit/preload'
import { Stats, RunEntry } from '../main/types';

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getStats: () => Promise<Stats>
      getLastEntries: (limit: number) => Promise<RunEntry[]>
    }
  }
}
