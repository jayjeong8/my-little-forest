export type { StorageAdapter, StorageContextType } from './types';
export {
  LocalStorageAdapter,
  createLocalStorageAdapter,
  hasExistingGameState,
  needsInitialization,
  checkAndMigrate,
} from './localStorage';
