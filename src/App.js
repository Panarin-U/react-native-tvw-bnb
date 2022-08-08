import React, { useEffect, useRef } from "react";

import _ from "lodash";
import { I18nextProvider } from "react-i18next";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import configureStore from "./redux/store.redux";
import Routes from "./routes";

const store = configureStore();

const WrapperApp = () => {
  const styles = {
    container: {
      flex: 1,
    },
  };

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={styles.container}>
        <Routes />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

const App = () => {
  return (
    <I18nextProvider>
      <Provider store={store}>
        <WrapperApp />
      </Provider>
    </I18nextProvider>
  );
};

export default App;
