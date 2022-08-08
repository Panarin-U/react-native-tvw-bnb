import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AffectVirtualBackgroundPage } from "../pages";
import SamplePage from "../pages/samplePage";

const Stack = createNativeStackNavigator();

const Routes = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
      >
        <Stack.Screen initial name="StartPage" component={SamplePage} />
        <Stack.Screen
          name="AffectVirtualBackgroundPage"
          component={AffectVirtualBackgroundPage}
          screenOptions={{ presentation: "modal" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
