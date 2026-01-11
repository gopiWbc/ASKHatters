import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import { Provider as JotaiProvider } from 'jotai';
import { createStore } from 'jotai';

/**
 * Redux Store Provider
 * Wraps the app with Redux store for RTK Query
 */

interface StoreProviderProps {
  children: ReactNode;
}
const jotaiStore = createStore();

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  return (
    <JotaiProvider store={jotaiStore}>
      <Provider store={store}>{children}</Provider>;
    </JotaiProvider>
  );
};

// Re-export store for direct access if needed
export { store };
