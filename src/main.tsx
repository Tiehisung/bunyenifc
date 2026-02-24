import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

//Redux imports
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./store/store.ts";

import { ThemeProvider } from "./contexts/ThemContext.tsx";
import AppLoader from "./components/loaders/AppLoader.tsx";

const App = React.lazy(() => import('./App'));
createRoot(document.getElementById("root")!).render(
  <React.Suspense fallback={<AppLoader />}>
    <StrictMode>
      <ThemeProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <App />
          </PersistGate>
        </Provider>
      </ThemeProvider>
    </StrictMode>
  </React.Suspense>,
);
