import React from "react";

//React navigation
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

//screens
import Welcome from "./../srceens/Welcome";
import Menu from "./../srceens/Menu";
import AddMenu from "../srceens/AddMenu";
import Inventory from "../srceens/Inventory";
import Transfers from "../srceens/Transfers";

//credential context
import { CredentailsContext } from '../components/CredentialsContext';

const Stack = createNativeStackNavigator();

export default function RootStack() {
    return (
        <CredentailsContext.Consumer>
            {({ storedCredentials }) => (
                <NavigationContainer>
                    <Stack.Navigator
                        screenOptions={{
                            headerTransparent: true,
                            headerTitle: "",
                            headerBackVisible: false,
                        }}
                        initialRouteName="Welcome"
                    >{storedCredentials ? (
                        <>
                            <Stack.Screen name="Menu" component={Menu} />
                            <Stack.Screen name="Inventory" component={Inventory} />
                            <Stack.Screen name="AddMenu" component={AddMenu} />
                            <Stack.Screen name="Transfers" component={Transfers} />
                        </>
                    ) : (
                        <Stack.Screen name="Welcome" component={Welcome} />
                    )}

                    </Stack.Navigator>
                </NavigationContainer>
            )}
        </CredentailsContext.Consumer>

    );
}

