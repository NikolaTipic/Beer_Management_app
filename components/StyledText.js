import React from 'react';

import { StyleSheet, Text} from 'react-native';
import { Montserrat_100Thin, useFonts } from '@expo-google-fonts/montserrat'
import AppLoading from 'expo-app-loading';


const StyledText = ({title}) => {

    const [fontsLoaded] = useFonts({
        "Montserrat" : Montserrat_100Thin,
      })
    
    if(!fontsLoaded) {
        return <AppLoading /> ;
      }

     return (
        <Text style={{fontFamily: "Montserrat"}}>{title}</Text>
     );
}

export default StyledText;