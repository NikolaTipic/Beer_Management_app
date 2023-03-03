import React, {useState, useEffect, useContext} from 'react';

//status bar
import { StatusBar } from 'expo-status-bar';

import { StyleSheet, View, Animated, Easing, Text, Switch, ActivityIndicator } from 'react-native';
//components
import { Button, ButtonText, LogoText, LeftIcon, StyledTextInput, RightIcon, SubmitButton,
         SubmitButtonText, MsgBox, ExtraView, ExtraText, TextLinkContent, TextLink } from '../components/Styles';
//linearGradient
import {LinearGradient} from 'expo-linear-gradient';
//Style android bottom nav bar
import * as NavigationBar from 'expo-navigation-bar';
//dimensions
import { widthPercentToDp as wp, heightPercentToDp as hp } from '../components/Dimensions';
//colors
import { Colors } from '../components/Styles';
//form
import {Formik} from "formik";
//icons
import {Entypo, Foundation} from "@expo/vector-icons";
//Keyboard avoiding view
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
//axios
import axios from 'axios';
//asyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage"
//credential context
import { CredentailsContext } from '../components/CredentialsContext';


const Welcome = () => {

    NavigationBar.setVisibilityAsync("hidden");
    NavigationBar.setBehaviorAsync('overlay-swipe')

    const [clicked, setClicked] = useState(false);
    const [bottomFlex, setBottomFlex] = useState(new Animated.Value(1));
    const [clickedLoggin, setClickedLogin] = useState(false);
    const [clickedSignup, setClickedSignup] = useState(false);
    const [clickedSiginInLogin, setClickedSigninInLogin] = useState(false);
    
    const [hidePassword, setHidePassword] = useState(true);

    const [message, setMessage] = useState();
    //context
    const {storedCredentials, setStoredCredentials} = useContext(CredentailsContext)


    const handleLogin = (credentials, setSubmitting) => {
        handleMessage(null);
        const url = "https://salty-river-31434.herokuapp.com/user/login";

        axios
            .post(url, credentials)
            .then((response) => {
                const result = response.data;
                const {message, status, data} = result;

                if(status !== "SUCCESS") {
                    handleMessage(message);
                }
                else {
                    persistLogin({...data}, message);
                }

                setSubmitting(false);

            })
            .catch(err => {
                setSubmitting(false);
                handleMessage("Error, provijeri svoju internetsku vezu, pa pokusaj ponovo!");
            });

    }

    const handleMessage = (message) => {
        setMessage(message)
    }    

    const handleSignup = (credentials, setSubmitting) => {
        handleMessage(null);

        const url = "https://salty-river-31434.herokuapp.com/user/signup";

        axios
            .post(url, credentials)
            .then((response) => {
                const result = response.data;
                const {message, status, data} = result;

                if(status !== "SUCCESS") {
                    handleMessage(message);
                }
                else {
                    persistLogin({...data}, message)
                }

                setSubmitting(false);

            })
            .catch(err => {
                setSubmitting(false);
                handleMessage("Error, provijeri svoju internetsku vezu, pa pokusaj ponovo!");
            });
    }

    const persistLogin = (credentials, message) => {
        AsyncStorage
            .setItem("beer", JSON.stringify(credentials))
            .then(() => {
                handleMessage(message);
                setStoredCredentials(credentials);
            })
            .catch(error => {
                console.log(error);
                handleMessage("Persist login failed");
            })
    }

    useEffect(() => {
        if(clicked) {
            Animated.timing(bottomFlex, {
                toValue: 2,
                duration: 500,
                useNativeDriver: false,
                easing: Easing.linear,
            }).start();

            setClickedLogin(true)
        }
    }, [clicked]);

    useEffect(() => {
        if(clickedLoggin) {
            Animated.timing(bottomFlex, {
                toValue: 3.9,
                duration: 250,
                useNativeDriver: false,
                easing: Easing.linear,
                }).start();
        }
    }, [clickedLoggin]);

    useEffect(() => {
        if(clickedSignup) {
            Animated.timing(bottomFlex, {
                toValue: 13,
                duration: 500,
                useNativeDriver: false,
                easing: Easing.linear,
                }).start();
        }
    }, [clickedSignup]);

    useEffect(() => {
        if(clickedSiginInLogin) {
            Animated.timing(bottomFlex, {
                toValue: 2,
                duration: 500,
                useNativeDriver: false,
                easing: Easing.linear,
            }).start()
        }
    }, [clickedSiginInLogin])
    

    return (
        <>
        <StatusBar style="auto" />
        <LinearGradient colors={[Colors.white,Colors.yellow,Colors.brown]} style={styles.container}>
            <View style={styles.topView}>
                <LogoText>BE</LogoText>
                <LogoText>ER</LogoText>
            </View>

            <Animated.View style={{flex: bottomFlex, justifyContent: "center", alignItems: "center"}}>
                {clicked ? (
                    <KeyboardAvoidingWrapper>
                    <View
                        style={{flex: 1, width: wp(80), alignItems:"center", borderRadius: wp(10), marginBottom: hp(10), justifyContent: "flex-start", backgroundColor: "rgba(250,250,250,0.5)"}}>
                        
                        {clickedSignup && (
                            <>
                            <View>
                                <Text style={{
                                    fontFamily: "Montserrat", 
                                    marginBottom: hp(4), 
                                    marginTop: hp(2), fontWeight: "bold",
                                     color:"#888"}}
                                >
                                    Signup
                                </Text>
                            </View>
                            
                            <Formik
                                initialValues={{name: "", email: "", password: "", repeatPassword: "", code: "", administrator: false}}
                                onSubmit={(values, {setSubmitting}) => {
                                    if(values.password !== values.repeatPassword) {
                                        handleMessage("Unesene lozinke se ne podudaraju!")
                                        setSubmitting(false)
                                    }
                                    else {
                                        console.log(values);
                                        handleSignup(values, setSubmitting)
                                    }
                                    
                                }}
                            >{
                                ({handleChange, handleBlur, handleSubmit,setFieldValue, values, isSubmitting}) => (
                                    <View>
                                        <Input 
                                            icon="v-card"
                                            placeholder="enter full name"
                                            placeholderTextColor= "#888"
                                            onChangeText={handleChange("name")}
                                            onBlur={handleBlur("name")}
                                            value={values.name}
                                        />

                                        <Input 
                                            icon="mail-with-circle"
                                            placeholder="enter e-mail"
                                            placeholderTextColor= "#888"
                                            onChangeText={handleChange("email")}
                                            onBlur={handleBlur("email")}
                                            value={values.email}
                                            keyboardType="email-address"
                                        />

                                        <Input 
                                            icon="lock"
                                            placeholder="enter password"
                                            placeholderTextColor= "#888"
                                            onChangeText={handleChange("password")}
                                            onBlur={handleBlur("password")}
                                            value={values.password}
                                            secureTextEntry={hidePassword}
                                            isPassword={true}
                                            hidePassword={hidePassword}
                                            setHidePassword={setHidePassword}
                                        />

                                        <Input 
                                            icon="lock"
                                            placeholder="repeat password"
                                            placeholderTextColor= "#888"
                                            onChangeText={handleChange("repeatPassword")}
                                            onBlur={handleBlur("repeatPassword")}
                                            value={values.repeatPassword}
                                            secureTextEntry={hidePassword}
                                            hidePassword={hidePassword}
                                            setHidePassword={setHidePassword}
                                        />

                                        <View style={{flexDirection: "row", alignItems: 'center', justifyContent: "space-around", maxWidth: wp(52), marginStart: wp(12)}}>
                                            <SubmitButtonText style={{color: "#888", fontWeight: "normal"}}>OWNER</SubmitButtonText>
                                            <Switch
                                                value={values.administrator}
                                                onValueChange={() => {
                                                    setFieldValue("administrator", !values.administrator);
                                                }}
                                                trackColor={{false: "#888", true: "0f0"}}
                                                thumbColor={values.administrator ? "#fff" : "#fff"}
                                            />
                                        </View>

                                        {values.administrator && (
                                            <Input 
                                            code={true}
                                            icon="key"
                                            placeholder="enter Code"
                                            placeholderTextColor= "#888"
                                            onChangeText={handleChange("code")}
                                            onBlur={handleBlur("code")}
                                            value={values.code}
                                            secureTextEntry={hidePassword}
                                            isCode={true}
                                        />
                                        )}
                                        
                                        <MsgBox>{message}</MsgBox>
                                
                                        { !isSubmitting ? (
                                            <SubmitButton onPress={handleSubmit}>
                                                <SubmitButtonText>submit</SubmitButtonText>
                                            </SubmitButton>
                                        ):(
                                            <SubmitButton disabled={true}>
                                                <ActivityIndicator size={hp(2.5)} color="#fff" />
                                            </SubmitButton>
                                        )}

                                        <ExtraView>
                                            <ExtraText>have an account already? </ExtraText>
                                            <TextLink onPress={() => {
                                                setClickedSigninInLogin(setClickedLogin(true));
                                                setClickedSignup(false);
                                                setMessage(null);
                                            }}>
                                                <TextLinkContent>Login </TextLinkContent>
                                            </TextLink>
                                        </ExtraView>
                                    </View>
                                )
                            }
                            </Formik>
                            </>
                        )}

                        
                        {clickedLoggin && (
                            <>
                            <View>
                                <Text style={{
                                    fontFamily: "Montserrat", 
                                    marginBottom: hp(4), 
                                    marginTop: hp(2), fontWeight: "bold",
                                     color:"#888"}}
                                >
                                    Login
                                </Text>
                            </View>
                            
                            <Formik
                                initialValues={{email: "", password: ""}}
                                onSubmit={(values, {setSubmitting}) => {
                                    handleLogin(values, setSubmitting);
                                }}
                            >{
                                ({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => (
                                    <View>
                                        <Input 
                                            icon="mail-with-circle"
                                            placeholder="enter e-mail"
                                            placeholderTextColor= "#888"
                                            onChangeText={handleChange("email")}
                                            onBlur={handleBlur("email")}
                                            value={values.email}
                                            keyboardType="email-address"
                                        />

                                        <Input 
                                            icon="lock"
                                            placeholder="enter password"
                                            placeholderTextColor= "#888"
                                            onChangeText={handleChange("password")}
                                            onBlur={handleBlur("password")}
                                            value={values.password}
                                            secureTextEntry={hidePassword}
                                            isPassword={true}
                                            hidePassword={hidePassword}
                                            setHidePassword={setHidePassword}
                                        />

                                        <MsgBox>{message}</MsgBox>

                                        { !isSubmitting ? (
                                            <SubmitButton onPress={handleSubmit}>
                                                <SubmitButtonText>submit</SubmitButtonText>
                                            </SubmitButton>
                                        ):(
                                            <SubmitButton disabled={true}>
                                                <ActivityIndicator size={hp(2.5)} color="#fff" />
                                            </SubmitButton>
                                        )}
                                    

                                        <ExtraView>
                                            <ExtraText>Don't have an account already? </ExtraText>
                                            <TextLink onPress={() => {
                                                setClickedSigninInLogin(setClickedSignup(true));
                                                setClickedLogin(false);
                                                setMessage(null);
                                            }}>
                                                <TextLinkContent>Signup </TextLinkContent>
                                            </TextLink>
                                        </ExtraView>
                                    </View>
                                )
                            }
                            </Formik>
                            </>
                        )}

                        
                        {!clickedLoggin && !clickedSignup && (
                            <>
                            <Button onPress={() => {
                                setClickedLogin(true);
                                setClickedSigninInLogin(false);
                                } 
                            }       
                                    style={{marginTop: hp(4.4), backgroundColor: "transparent", elevation:0}}>
                                <ButtonText style={{color: "transparent"}}>login</ButtonText>
                            </Button>      
                            <Button style={{backgroundColor: "#000"}} onPress={() => {
                                setClickedSignup(true);
                                setClickedSigninInLogin(false);
                                }
                            }
                                    style={{marginTop: hp(4),backgroundColor: "transparent", elevation:0, marginBottom: hp(5)}}>
                                <ButtonText style={{color: "transparent"}}>signup</ButtonText>
                            </Button>   
                            </>
                        )}
                            
                        
                                  
                    </View>
                    </KeyboardAvoidingWrapper>
                ):(
                    <View style={{alignItems:"center"}}>
                        <Button style={{backgroundColor: "#000"}} onPress={() => setClicked(true)}>
                            <ButtonText style={{fontWeight: "normal", color: "#fff"}}>welcome</ButtonText>                                                 
                        </Button>
                    </View>                   
                )}
                
            </Animated.View>
        </LinearGradient>
        </>
    );
}

const Input = ({icon, isPassword, hidePassword, setHidePassword, isCode, ...props}) => {
    return (
        
        <View style={{flexDirection: "row"}}>
            {isCode ? (
                <>
                <LeftIcon>
                    <Foundation name={icon} size={wp(7)} color={"#000"} />
                </LeftIcon>
                <StyledTextInput {...props} />
                </>
            ): (
                <>
                    <LeftIcon>
                        <Entypo name={icon} size={wp(7)} color={"#000"} />
                    </LeftIcon>
                    <StyledTextInput {...props} />
                    
                    {isPassword && (
                        <RightIcon onPress={() => setHidePassword(!hidePassword)}>
                            <Entypo name={hidePassword ? "eye-with-line" : "eye"} size={wp(7)} color={"#888"}/>
                        </RightIcon>
                    )}
                </>
             )}
            
            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
    },
    topView: {
        flex: 3,
        alignItems: "center",
        justifyContent: "flex-end",
        paddingVertical: hp(10),
    },
  });
  

  export default Welcome;