import React, {useState} from 'react';


//fonts
import { Montserrat_200ExtraLight, useFonts } from '@expo-google-fonts/montserrat'
//appLoading
import AppLoading from 'expo-app-loading';
//React navigation stack
import RootStack from "./navigators/RootStack";
//asyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage"
//credential context
import { CredentailsContext } from './components/CredentialsContext';


export default function App() {
  const [appReady, setAppReady] = useState(false);
  const [storedCredentials, setStoredCredentials] = useState("");

  const [fontsLoaded] = useFonts({
    "Montserrat" : Montserrat_200ExtraLight
    })

  const checkLoginCredentials = () => {
    AsyncStorage
      .getItem("beer")
      .then((result) => {
        if(result !== null) {
          setStoredCredentials(JSON.parse(result));
        }
        else {
          setStoredCredentials(null);
        }
      })
      .catch(error => console.log(error))
  }

    if(!fontsLoaded) {
      return <AppLoading 
        startAsync={checkLoginCredentials}
        onFinish={() => setAppReady(true)}
        onError={console.warn}
      />;
    }
    return (
      <CredentailsContext.Provider value={{storedCredentials, setStoredCredentials}}>
        <RootStack />
      </CredentailsContext.Provider>
    );
}