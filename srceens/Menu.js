import React, {useContext, useState} from "react";
import { StatusBar } from "expo-status-bar";

//linearGradient
import {LinearGradient} from 'expo-linear-gradient';
//colors
import { Colors } from '../components/Styles';
//dimensions
import { widthPercentToDp as wp, heightPercentToDp as hp } from '../components/Dimensions';
//icons
import {MaterialIcons, Feather, MaterialCommunityIcons, FontAwesome5} from "@expo/vector-icons"
//Style android bottom nav bar
import * as NavigationBar from 'expo-navigation-bar';
//components
import {View, Text, StyleSheet, ImageBackground, TouchableOpacity, ActivityIndicator, ScrollView, Modal} from "react-native"
//asyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage"
//credential context
import { CredentailsContext } from '../components/CredentialsContext';
//form
import { Formik } from "formik";
//custom components
import { StylesTextInputSearchBar, RightIcon, MsgBox, SuccessMsgBox, SubmitButton, SubmitButtonText, LeftIcon, StyledTextInputAddDispenser } from "../components/Styles";
//axios
import axios from 'axios';
//Keyboard avoiding view
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';

const Menu = ({navigation}) => {

    //context
    const {storedCredentials, setStoredCredentials} = useContext(CredentailsContext)
    const {name, email, administrator, dispensers, parts} = storedCredentials

    const [message, setMessage] = useState(null);
    const [listMessage, setListMessage] = useState(null);

    const [invNumber, setInvNumber] = useState(null);
    const [model, setModel] = useState();
    const [warehouse, setWarehouse] = useState();
    const [dols, setDols] = useState();
    const [dts, setDts] = useState();
    const [region, setRegion] = useState();
    const [city, setCity] = useState();
    const [address, setAddress] = useState();

    const [extend, setExtend] = useState(false);

    const [expiredDispensersList, setExpiredDispenserList] = useState([]);

    const [modalPartsVisible, setModalPartsVisible] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);

    NavigationBar.setVisibilityAsync("hidden");
    NavigationBar.setBehaviorAsync('overlay-swipe');

    const clearLogin = () => {
        AsyncStorage
            .removeItem("beer")
            .then(() => {
                setStoredCredentials("");
            })
            .catch(error => console.log(error))
    }

    const handleMessage = (message) => {
        setMessage(message);
    }

    const handleSuccessMessage = (message) => {
        setSuccessMessage(message);
    }

    const handleSearch = (invNumber, setSubmitting) => {
        handleMessage(null);

        const url = "https://salty-river-31434.herokuapp.com/dispenser/findDispenser";

        axios
            .post(url, invNumber)
            .then((response) => {
                const result = response.data;
                const {status, message, data} = result;

                if(status !== "SUCCESS") {
                    handleMessage(message);
                    setSubmitting(false);
                }
                else {

                    let [index0] = data;

                    setInvNumber(index0.invNumber);
                    setModel(index0.model);
                    setWarehouse(index0.warehouse);

                    const date = new Date(index0.dateOfLastSanitation)

                    setDols(date.toDateString());
                    setDts(index0.dts);
                    setRegion(index0.location.region);
                    setCity(index0.location.city)
                    setAddress(index0.location.address);

                    setSubmitting(false);
                }
            })
            .catch(err => {
                setSubmitting(false);
                handleMessage("Error, provijeri svoju internetsku vezu, pa pokusaj ponovo!")
            })

    }

    const handleExpiredDispensers = () => {
        const url = "https://salty-river-31434.herokuapp.com/dispenser/checkForExpiredSanitation"
        const list = true;

        axios
        .post(url, list)
        .then((response) => {
            const result = response.data;
            const {status, message, data} = result;

            if(status !== "SUCCESS") {
                setListMessage(message);
            }
            else {

                let arrayOfExpiredDispensers = [];

                for( let i = 0; i < data.length; i++) {
                    arrayOfExpiredDispensers.push(data[i].invNumber, data[i].dts);
                }

                setExpiredDispenserList(arrayOfExpiredDispensers);
                setListMessage(message);
            }
        })
    }

    const renderfExpiredDispenser = (index) => {
        if(index % 2 == 0)
            return (
                <>        
                    <View key={index}>
                        <Text key={index}>{expiredDispensersList[index]} - {
                        (index < expiredDispensersList.length - 1)? expiredDispensersList[index+1] : ''
                        }</Text>
                    </View>
                </>
            );
    }

    // const listOfExpiredDispensers = expiredDispensersList.map((dispenser, index) =>
    // <View key={index}>
    //     <Text key={index}>{dispenser}</Text>
    // </View>
    // );


    const removeItem = (credentials, setSubmitting) => {
        const url = "https://salty-river-31434.herokuapp.com/part/removePart";

        axios
            .post(url, credentials)
            .then((response) => {
                const result = response.data;
                const { message, status } = result;

                if (status !== "SUCCESS") {
                    handleMessage(message);
                }
                else {
                    handleSuccessMessage(message);
                }

                setSubmitting(false);
            })
            .catch(err => {
                setSubmitting(false);
                handleMessage("Error, provijeri svoju internetsku vezu, pa pokusaj ponovo!");
            })
    }

    return(
    <>
        <StatusBar style="light" />
        <ImageBackground source={require("../assets/MenuBackground.jpg")} resizeMode="cover" style={styles.backgroundMenu}>
        <LinearGradient colors={["rgba(200,200,200,0.4)","rgba(200,200,200,0.4)", "rgba(200,200,200,0.4)"]} style={styles.container}>

            {/* profile and logout */}
            <View style={styles.topView}>
                <View style={styles.userView}>
                    <TouchableOpacity style={styles.profileLogo}>
                        <Feather name="user" size={wp(5)} color={"#fff"} />
                    </TouchableOpacity>
                    <Text style={{fontFamily: "Montserrat", marginHorizontal: wp(2), fontWeight: "bold", color: "#fff", fontSize: hp(1.7)}}>{name}</Text>
                </View>
                <View style={styles.logoutView}>
                    <Text style={{fontFamily: "Montserrat", marginHorizontal: wp(2), fontWeight: "bold", color: "#fff", fontSize: hp(1.7)}}>Logout</Text>
                    <TouchableOpacity onPress={clearLogin} style={styles.logoutLogo}>
                        <MaterialIcons name="logout" size={wp(5)} color={"#fff"}/>
                    </TouchableOpacity>
                </View>
            </View >
            
            {/* bottom navigator */}
            <View style={styles.bottomView}>
                
                    <TouchableOpacity style={styles.iconBox}>
                        <Feather name="home" size={wp(5)} color={"yellow"} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("Inventory")} style={styles.iconBox}>
                        <Feather name="bar-chart-2" size={wp(5)} color={"#fff"}/>
                    </TouchableOpacity>
                

                
                    <TouchableOpacity onPress={() => navigation.navigate("AddMenu")} style={styles.iconBox}>
                        <MaterialCommunityIcons name="database" size={wp(5)} color={"#fff"}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setModalPartsVisible(true)} style={styles.iconBox}>
                        <Feather name="trash" size={wp(5)} color={"#fff"}/>
                    </TouchableOpacity>
                
            </View>

            {/* modal for deleting parts from inventory */}
            <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalPartsVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalPartsVisible);
                        setMessage(null);
                        setSuccessMessage(null);
                    }}
                >
                    <KeyboardAvoidingWrapper>
                        <View style={styles.centeredView2}>
                            <View style={styles.modalView2}>

                                <Formik
                                    initialValues={{
                                        quantityUnit: "",
                                        productName: "",
                                        productCode: "",
                                        quantity: ""
                                    }}
                                    onSubmit={(values, { setSubmitting }) => {
                                        setMessage(null);
                                        setSuccessMessage(null);
                                        values = { ...values };
                                        removeItem(values, setSubmitting);
                                    }}
                                >
                                    {
                                        ({ handleChange, handleBlur, handleSubmit, setFieldValue, values, isSubmitting, handleReset }) => (
                                            <View style={{ alignItems: "center" }}>

                                                <View style={styles.dispenserContainer}>
                                                    <Input
                                                        icon="tool"
                                                        placeholder="Naziv proizvoda"
                                                        placeholderTextColor="#888"
                                                        onChangeText={handleChange("productName")}
                                                        onBlur={handleBlur("productName")}
                                                        value={values.productName}
                                                        returnKeyType="next"
                                                    />

                                                    <Input
                                                        icon="hash"
                                                        placeholder="Šifra proizvoda"
                                                        placeholderTextColor="#888"
                                                        onChangeText={handleChange("productCode")}
                                                        onBlur={handleBlur("productCode")}
                                                        value={values.productCode}
                                                        returnKeyType="next"
                                                        keyboardType="numeric"
                                                    />

                                                    <Input
                                                        icon="minus"
                                                        placeholder="Količina"
                                                        placeholderTextColor="#888"
                                                        onChangeText={handleChange("quantity")}
                                                        onBlur={handleBlur("quantity")}
                                                        value={values.quantity}
                                                        returnKeyType="next"
                                                        keyboardType="numeric"
                                                    />


                                                </View>

                                                <MsgBox style={{ marginTop: hp(0.5) }}>{message}</MsgBox>
                                                <SuccessMsgBox>{successMessage}</SuccessMsgBox>

                                                {!isSubmitting ? (
                                                    <SubmitButton style={{ marginTop: hp(1) }} onPress={handleSubmit}>
                                                        <SubmitButtonText>submit</SubmitButtonText>
                                                    </SubmitButton>
                                                ) : (
                                                    <SubmitButton disabled={true}>
                                                        <ActivityIndicator size={hp(2.5)} color="#fff" />
                                                    </SubmitButton>
                                                )}

                                            </View>
                                        )
                                    }
                                </Formik>


                                <TouchableOpacity
                                    onPress={() => {
                                        setModalPartsVisible(false);
                                        setDols("");
                                        setSuccessMessage(null);
                                        setMessage(null);
                                    }}
                                    style={{ marginVertical: hp(2) }}>
                                    <Text style={{ color: "#fff" }}>Zatvori</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingWrapper>
                </Modal>

            <View style={styles.formikContainer}>
                <Formik
                    initialValues={{invNumber: ""}}
                    onSubmit={(values, {setSubmitting}) => {
                        if(values.invNumber == "") {
                            handleMessage("Unos inventurnog broja je obavezan!");
                            setSubmitting(false);
                        }
                        else {
                            handleSearch(values, setSubmitting);
                            values.invNumber = "";
                        }
                    }}
                >
                {({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => (
                    <View style={styles.searchContainer}>
                        <View style={styles.searchView}>
                            <StylesTextInputSearchBar
                                placeholder="Unesite inventurni broj..."
                                placeholderTextColor={"#888"}
                                onChangeText={handleChange("invNumber")}
                                onBlur={handleBlur("invNumber")}
                                value={values.invNumber}
                                keyboardType="numeric"
                            />
                            { !isSubmitting ? (
                                <RightIcon onPress={handleSubmit} >
                                    <Feather name="search" size={wp(5.5)} color={"#ff0"} />
                                </RightIcon>
                                ):(
                                <RightIcon disabled={true}>
                                    <ActivityIndicator size={hp(2.5)} color="#ff0" />
                                </RightIcon>
                            )}
                        </View>
                        {message && (
                            <View style={styles.msgContainer}>
                                <MsgBox>{message}</MsgBox>
                            </View>
                        )} 
                        
                        {invNumber && (
                        <View style={{flexDirection: "row", marginTop: hp(1)}}>
                            <View style={{
                                    borderRadius: wp(50),
                                    height: hp(3.5),
                                    width: hp(3.5),
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginRight: wp(2),
                                    backgroundColor: "rgba(255,255,0,0.5)",
                                    marginTop: hp(1)
                                    }}>
                                <MaterialCommunityIcons 
                                    name="beer-outline" 
                                    size={wp(3.5)} 
                                    color={"#000"} 
                                />
                            </View>

                            <TouchableOpacity 
                                style={styles.invNumberTouch}
                                onPress={() => setExtend(true)}
                            >
                                <Text style={{color: "#ff0"}}>Inventurni broj:  </Text>
                                <Text style={{color: "#fff"}}>{invNumber}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => {
                                setInvNumber(null);
                                setExtend(false)
                                }
                            }>
                                <View style={{
                                        borderRadius: wp(50),
                                        height: hp(3.5),
                                        width: hp(3.5),
                                        justifyContent: "center",
                                        alignItems: "center", 
                                        marginLeft: wp(2),
                                        backgroundColor: "rgba(255,255,0,0.5)",
                                        marginTop: hp(1)
                                        }}>
                                    <Feather 
                                        name="x-circle"
                                        size={wp(3.5)} 
                                        color={"#000"} 
                                    />
                                </View>
                            </TouchableOpacity>                      
                        </View>
                        )}

                        {extend && (
                        <>
                            <View style={{flexDirection: "row"}}>
                                <View style={{
                                        borderRadius: wp(50),
                                        height: hp(3.5),
                                        width: hp(3.5),
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginRight: wp(2),
                                        backgroundColor: "rgba(255,255,0,0.5)",
                                        marginTop: hp(1)
                                        }}>
                                    <FontAwesome5 
                                        name="warehouse"
                                        size={wp(2.7)} 
                                        color={"#000"} 
                                    />
                                </View>

                                <TouchableOpacity style={styles.invNumberTouch}>
                                    <Text style={{color: "#ff0"}}>Skladište:  </Text>
                                    <Text style={{color: "#fff"}}>{warehouse}</Text>
                                </TouchableOpacity>                      
                            </View>

                            <View style={{flexDirection: "row"}}>
                                <View style={{
                                        borderRadius: wp(50),
                                        height: hp(3.5),
                                        width: hp(3.5),
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginRight: wp(2),
                                        backgroundColor: "rgba(255,255,0,0.5)",
                                        marginTop: hp(1)
                                        }}>
                                    <Feather 
                                        name="edit-3"
                                        size={wp(3.5)} 
                                        color={"#000"} 
                                    />
                                </View>

                                <TouchableOpacity style={styles.invNumberTouch}>
                                    <Text style={{color: "#ff0"}}>Model:  </Text>
                                    <Text style={{color: "#fff"}}>{model}</Text>
                                </TouchableOpacity>                      
                            </View>

                            <View style={{flexDirection: "row"}}>
                                <View style={{
                                        borderRadius: wp(50),
                                        height: hp(3.5),
                                        width: hp(3.5),
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginRight: wp(2),
                                        backgroundColor: "rgba(255,255,0,0.5)",
                                        marginTop: hp(1)
                                        }}>
                                    <Feather 
                                        name="calendar"
                                        size={wp(3.5)} 
                                        color={"#000"} 
                                    />
                                </View>

                                <TouchableOpacity style={styles.invNumberTouch}>
                                    <Text style={{color: "#ff0"}}>Datum Z S:  </Text>
                                    <Text style={{color: "#fff"}}>{dols}</Text>
                                </TouchableOpacity>                      
                            </View>

                            <View style={{flexDirection: "row"}}>
                                <View style={{
                                        borderRadius: wp(50),
                                        height: hp(3.5),
                                        width: hp(3.5),
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginRight: wp(2),
                                        backgroundColor: "rgba(255,255,0,0.5)",
                                        marginTop: hp(1)
                                        }}>
                                    <Feather 
                                        name="clock"
                                        size={wp(3.5)} 
                                        color={"#000"} 
                                    />
                                </View>

                                

                                <TouchableOpacity style={styles.invNumberTouch}>
                                    <Text style={{color: "#ff0"}}>Dana do Sanitacije:  </Text>
                                    <Text style={{color: "#fff"}}>{dts}</Text>
                                </TouchableOpacity>                      
                            </View>

                            <View style={{flexDirection: "row"}}>
                                <View style={{
                                        borderRadius: wp(50),
                                        height: hp(3.5),
                                        width: hp(3.5),
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginRight: wp(2),
                                        backgroundColor: "rgba(255,255,0,0.5)",
                                        marginTop: hp(1)
                                        }}>
                                    <Feather 
                                        name="globe"
                                        size={wp(3.5)} 
                                        color={"#000"} 
                                    />
                                </View>

                                

                                <TouchableOpacity style={styles.invNumberTouch}>
                                    <Text style={{color: "#ff0"}}>Županija:  </Text>
                                    <Text style={{color: "#fff"}}>{region}</Text>
                                </TouchableOpacity>                      
                            </View>

                            <View style={{flexDirection: "row"}}>
                                <View style={{
                                        borderRadius: wp(50),
                                        height: hp(3.5),
                                        width: hp(3.5),
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginRight: wp(2),
                                        backgroundColor: "rgba(255,255,0,0.5)",
                                        marginTop: hp(1)
                                        }}>
                                    <Feather 
                                        name="target"
                                        size={wp(3.5)} 
                                        color={"#000"} 
                                    />
                                </View>

                                

                                <TouchableOpacity style={styles.invNumberTouch}>
                                    <Text style={{color: "#ff0"}}>Grad:  </Text>
                                    <Text style={{color: "#fff"}}>{city}</Text>
                                </TouchableOpacity>                      
                            </View>

                            <View style={{flexDirection: "row"}}>
                                <View style={{
                                        borderRadius: wp(50),
                                        height: hp(3.5),
                                        width: hp(3.5),
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginRight: wp(2),
                                        backgroundColor: "rgba(255,255,0,0.5)",
                                        marginTop: hp(1)
                                        }}>
                                    <Feather 
                                        name="map-pin"
                                        size={wp(3.5)} 
                                        color={"#000"} 
                                    />
                                </View>

                                

                                <TouchableOpacity style={styles.invNumberTouch}>
                                    <Text style={{color: "#ff0"}}>Adresa:  </Text>
                                    <Text style={{color: "#fff"}}>{address}</Text>
                                </TouchableOpacity>                      
                            </View>
                        </>
                        
                        )}

                    </View>
                )}    
                </Formik>     
            </View>

            <View style={styles.scrollContainer}>
                <TouchableOpacity onPress={handleExpiredDispensers}>
                    <Text>Prikazi istekle točionike</Text>
                </TouchableOpacity>
                <Text style={styles.listMessage}>{listMessage}</Text>
                <ScrollView style={styles.scrollView}>
                    {
                        expiredDispensersList.map((dispenser, index) => renderfExpiredDispenser(index))
                    }
                </ScrollView>                                
            </View>

        </LinearGradient>
        </ImageBackground>
    </>
    );
}


const Input = ({ icon, isDate, showDatePicker, ...props }) => {
    return (

        <View style={{ flexDirection: "row" }}>
            <>
                <LeftIcon style={{ marginRight: wp(3.5), marginLeft: 0 }}>
                    <Feather name={icon} size={wp(5.5)} color={"#ff0"} />
                </LeftIcon>
                {!isDate && (
                    <StyledTextInputAddDispenser {...props} />
                )}
                {isDate && (
                    <TouchableOpacity onPress={showDatePicker} >
                        <StyledTextInputAddDispenser {...props} />
                    </TouchableOpacity>
                )}
            </>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "flex-start",
      alignItems: "center"
    },
    topView: {
        flexDirection: "row",
        height: hp(6),
        alignItems: "center",
        justifyContent: "space-around",
        marginVertical: hp(8),
        marginHorizontal: wp(5),
        borderRadius: wp(15),
        width: wp(90),
        marginBottom: hp(4)
    },
    bottomView: {
        position: "absolute",
        alignItems: "center",
        borderRadius: wp(100),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255,255,255, 0.5)",
        width: wp(80),
        bottom: hp(8)
    },
    profileLogo: {
        borderRadius: wp(100),
        height: hp(3.5),
        width: hp(3.5),
        backgroundColor: "rgba(255,255,0,0.5)",
        borderWidth: wp(0.6),
        borderColor: "#fff",
        justifyContent: "center",
        alignItems: "center"
    },
    backgroundMenu: {
        minWidth: wp(100),
        minHeight: hp(100)
    },
    userView: {
        right: wp(4),
        flexDirection: "row",
        alignItems: "center",
        maxWidth: wp(40),
    },
    logoutLogo: {
        borderRadius: wp(100),
        height: hp(3.5),
        width: hp(3.5),
        backgroundColor: "rgba(255,255,0,0.5)",
        borderWidth: wp(0.6),
        borderColor: "#fff",
        justifyContent: "center",
        alignItems: "center"
    },
    logoutView: {
        left: wp(4),
        flexDirection: "row",
        alignItems: "center"
    },
    iconView: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    iconBox: {
        margin: wp(3),
        backgroundColor: "#000",
        padding: wp(4),
        borderRadius: wp(100),
    },
    formikContainer: {
        marginBottom: hp(1)
    },
    searchView: {
        flexDirection: "row"
    },
    searchContainer: {
        backgroundColor: "rgba(255,255,255, 0.5)",
        padding: wp(2),
        paddingHorizontal: wp(2),
        borderRadius: wp(7)
    },
    msgContainer: {
        
    },
    invNumberTouch: {
        backgroundColor: "#000",
        borderRadius: wp(50),
        marginTop: hp(1),
        flexDirection: "row",
        padding: wp(0.5),
        justifyContent: "center",
        width: wp(60),
        maxWidth: wp(60),
        alignSelf: "center",
        paddingVertical: wp(1)
    },
    scrollContainer: {
        backgroundColor: "rgba(255,255,255, 0.5)",
        borderRadius: wp(3),
        width: wp(80),
        marginTop: hp(4),
        padding: wp(4)
    },
    scrollView: {
        padding: wp(4)
    },
    listMessage: {
        marginTop: hp(2),
        color: "green"
    },
    dispenserContainer: {
        alignItems: "center",
        borderRadius: wp(3),
        borderColor: "#fff",
        borderWidth: wp(0.2),
        padding: wp(5),
        paddingVertical: wp(3),
        marginTop: hp(3)
    },

    centeredView2: {
        position: "relative",
        marginTop: hp(38)
    },

    modalView2: {
        backgroundColor: "rgba(0,0,0,0.9)",
        borderTopLeftRadius: wp(7),
        borderTopRightRadius: wp(7),
        padding: wp(5),
        alignItems: "center",
        shadowColor: "#000",
        elevation: 0,
        width: wp(100),
        height: hp(54)
    }
  });

export default Menu;
