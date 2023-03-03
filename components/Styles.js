import styled from "styled-components";
import { Text, TouchableOpacity, TextInput, View } from "react-native";
import { widthPercentToDp as wp, heightPercentToDp as hp } from '../components/Dimensions';


export const Colors = {
    yellow: "#ffff00",
    brown: "#ce931c",
    white: "#fff"
}

export const LogoText = styled.Text`
    font-size: ${hp(7)}px; 
    font-family: Montserrat;
    color: #000;
    letter-spacing:${wp(3)}px;
    margin: ${hp(-0.7)}px;
`

export const Button = styled.TouchableOpacity`
    background-color: #fff;   
    height: ${hp(4)}px;
    width: ${wp(50)}px;
    align-items: center;
    justify-content: center;
    borderRadius: ${wp(4)}px;
    elevation: 2;
    
`
export const SubmitButton = styled.TouchableOpacity`
    background-color: #888;   
    height: ${hp(4)}px;
    width: ${wp(30)}px;
    align-items: center;
    justify-content: center;
    borderRadius: ${wp(4)}px;
    elevation: 2;
    align-self: center;
    margin-top: ${hp(2)}px;
`
export const SubmitButtonText = styled.Text`
    font-family: Montserrat;
    color: rgba(250,250,250,0.7);
    letter-spacing:${wp(0)}px;
    font-size: ${hp(2)}px;
`

export const ButtonText = styled.Text`
    font-family: Montserrat;
    color: #000;
    letter-spacing:${wp(0)}px;
    font-size: ${hp(2)}px;
`
export const StyledTextInput = styled.TextInput`
    background-color: #000;
    padding: 0px;
    padding-left: ${wp(12)}px;
    padding-right: ${wp(12)}px;
    border-radius: ${wp(15)}px;
    font-size: ${wp(3.7)}px;
    height: ${hp(5.2)}px;
    margin-vertical: ${hp(1)}px;
    margin-bottom: 0px;
    color: #fff;
    max-width: ${wp(53.5)}px;
    min-Width: ${wp(53.5)}px;
`
export const StyledTextInputAddDispenser = styled.TextInput`
    background-color: #fff;
    padding-left: ${wp(12)}px;
    padding-right: ${wp(12)}px;
    border-radius: ${wp(15)}px;
    font-size: ${wp(2.8)}px;
    height: ${hp(4.5)}px;
    margin-vertical: ${hp(1)}px;
    margin-bottom: 0px;
    color: #000;
    max-width: ${wp(53.5)}px;
    min-Width: ${wp(53.5)}px;
`
export const StylesTextInputSearchBar = styled.TextInput`
    background-color: rgba(0,0,0, 0.9);
    padding-left: ${wp(12)}px;
    padding-right: ${wp(12)}px;
    border-radius: ${wp(15)}px;
    font-size: ${wp(3.2)}px;
    height: ${hp(4.5)}px;
    color: #fff;
    width: ${wp(70)}px;
    max-width: ${wp(70)}px;
`

export const LeftIcon = styled.View`
    justify-content: center;
    margin: ${wp(2)}px;
    height: ${hp(5.2)}px;
`

export const RightIcon = styled.TouchableOpacity`
    justify-content: center;
    margin-horizontal: ${wp(2)}px;
`
export const MsgBox = styled.Text`
    text-align: center;
    font-size: ${hp(1.2)}px;
    color: red;
`
export const SuccessMsgBox = styled.Text`
    text-align: center;
    font-size: ${hp(1.2)}px;
    color: #0f0;
`

export const ExtraView = styled.View`
    justify-content: center;
    flex-direction: row;
    align-items:center;
    padding: ${wp(1)}px;
    margin-top: ${hp(2)}px;
`

export const ExtraText = styled.Text`
    color: #888;
    font-size: ${hp(1.6)}px;
`

export const TextLink = styled.TouchableOpacity`
    justify-content: center;
    align-items: center;
`

export const TextLinkContent = styled.Text`
    font-size: ${hp(1.6)}px;
    color: ${Colors.brown};
`
export const ModalView = styled.View`
    margin: 20px;
    backgroundColor: #fff;
    borderRadius: 20px;
    padding: 35px;
    alignItems: center;
    shadowColor: #000;
    elevation: 3;
`