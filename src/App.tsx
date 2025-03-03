import AppMain from "./AppMain";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider, useDispatch } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./reducers";
import "./App.css";
import { useEffect } from "react";
import { RouteChangeTracker, initGA } from "./utils/analytics";
import { logout, setUserLoggedIn } from "./reducers/user";
import { deleteCookie, getCookie, parseJwt } from "./utils/auth";
import SSEProvider from "./contextApi/sseContext";

function App() {
  useEffect(() => {
    initGA();
  }, []);
  return (
    <div className={`App`}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SSEProvider>
            <ChakraProvider>
              <BrowserRouter>
                <RouteChangeTracker />
                <AppMain />
              </BrowserRouter>
            </ChakraProvider>
          </SSEProvider>
        </PersistGate>
      </Provider>
    </div>
  );
}

export default App;
