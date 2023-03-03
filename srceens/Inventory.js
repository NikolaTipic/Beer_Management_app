import React, { useContext, useState } from "react";
import { StatusBar } from "expo-status-bar";

//linearGradient
import { LinearGradient } from 'expo-linear-gradient';
//colors
import { Colors } from '../components/Styles';
//dimensions
import { widthPercentToDp as wp, heightPercentToDp as hp } from '../components/Dimensions';
//icons
import { MaterialIcons, Feather, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons"
//Style android bottom nav bar
import * as NavigationBar from 'expo-navigation-bar';
//components
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native"
//asyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage"
//credential context
import { CredentailsContext } from '../components/CredentialsContext';
//form
import { Formik } from "formik";
//custom components
import { StylesTextInputSearchBar, RightIcon, MsgBox } from "../components/Styles";
//axios
import axios from 'axios';

const Inventory = ({ navigation }) => {

    //context
    const { storedCredentials, setStoredCredentials } = useContext(CredentailsContext)
    const { name, email, administrator, dispensers, parts } = storedCredentials

    const [listMessage, setListMessage] = useState(null);
    const [listServicerMessage, setListServicerMessage] = useState(null);
    const [expenseMessage, setExpenseMessage] = useState(null);

    const [InventoryList, setInventoryList] = useState([]);
    const [servicersDocList, setServicersDocList] = useState([]);
    const [expenseInventoryList, setExpenseInventoryList] = useState([]);

    const [selected, setSelected] = useState(null);

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


    const handleInventory = () => {
        const url = "https://salty-river-31434.herokuapp.com/part/getInventory"
        const list = true;

        axios
            .post(url, list)
            .then((response) => {
                const result = response.data;
                const { status, message, data } = result;

                if (status !== "SUCCESS") {
                    setListMessage(message);
                }
                else {

                    let arrayOfPartsInInventory = [];

                    for (let i = 0; i < data.length; i++) {
                        arrayOfPartsInInventory.push(data[i].productName, data[i].quantity);
                    }

                    setInventoryList(arrayOfPartsInInventory);
                    setListMessage(message);
                }
            });
    }


    const handleServicerInventory = () => {
        const url = "https://salty-river-31434.herokuapp.com/part/getServicerInventory"
        const list = true;

        axios
            .post(url, list)
            .then((response) => {
                const result = response.data;
                const { status, message, data } = result;

                if (status !== "SUCCESS") {
                    setListServicerMessage(message);
                }
                else {

                    let arrayOfServicersDoc = [];

                    for (let i = 0; i < data.length; i++) {
                        arrayOfServicersDoc.push(data[i]);
                    }

                    setServicersDocList(arrayOfServicersDoc);
                    setListServicerMessage(message);
                }
            })
    }


    const handleExpenseInventory = () => {
        const url = "https://salty-river-31434.herokuapp.com/part/getExpenseInventory"
        const list = true;

        axios
            .post(url, list)
            .then((response) => {
                const result = response.data;
                const { status, message, data } = result;

                if (status !== "SUCCESS") {
                    setExpenseMessage(message);
                }
                else {

                    let arrayOfPartsInExpenseInventoryy = [];

                    for (let i = 0; i < data.length; i++) {
                        arrayOfPartsInExpenseInventoryy.push(data[i].productName, data[i].quantity);
                    }

                    setExpenseInventoryList(arrayOfPartsInExpenseInventoryy);
                    setExpenseMessage(message);
                }
            })
    }


    const renderInventoryList = (index) => {
        if (index % 2 == 0)
            return (
                    <TouchableOpacity key={index}>
                        <Text key={index}>{InventoryList[index]} - {
                            (index < InventoryList.length - 1) ? InventoryList[index + 1] : ''
                        }</Text>
                    </TouchableOpacity>
            );
    }


    const renderServicersDocList = (index) => {
        return (
            <>
            <TouchableOpacity key={index} onPress={() => {
                setSelected(index);
            }}>
                <Text key={index} style={{marginTop: hp(1)}}>{servicersDocList[index].name}</Text>
            </TouchableOpacity>
            {selected === index && (
                <View style={{paddingBottom: hp(1)}}>
                    {servicersDocList[index].parts.map((part, index) => <Text>{part.productName} - {part.quantity}</Text>)}
                </View>)}
            </>
        );
    }


    const renderExpenseInventoryList = (index) => {
        if (index % 2 == 0)
            return (
                    <TouchableOpacity key={index}>
                        <Text key={index}>{expenseInventoryList[index]} - {
                            (index < expenseInventoryList.length - 1) ? expenseInventoryList[index + 1] : ''
                        }</Text>
                    </TouchableOpacity>
            );
    }

    const deleteExpanseInventory = () => {
        const url = "https://salty-river-31434.herokuapp.com/part/deleteExpenseInventory"
        const list = true;

        axios
            .post(url, list)
            .then((response) => {
                const result = response.data;
                const { status, message, data } = result;

                if (status !== "SUCCESS") {
                    setExpenseMessage(message);
                }
                else {
                    setExpenseInventoryList([]);
                    setExpenseMessage(message);
                }
            });
    }


    return (
        <>
            <StatusBar style="light" />
            <ImageBackground source={require("../assets/MenuBackground.jpg")} resizeMode="cover" style={styles.backgroundMenu}>
                <LinearGradient colors={["rgba(200,200,200,0.4)", "rgba(200,200,200,0.4)", "rgba(200,200,200,0.4)"]} style={styles.container}>
                    <View style={styles.topView}>
                        <View style={styles.userView}>
                            <TouchableOpacity style={styles.profileLogo}>
                                <Feather name="user" size={wp(5)} color={"#fff"} />
                            </TouchableOpacity>
                            <Text style={{ fontFamily: "Montserrat", marginHorizontal: wp(2), fontWeight: "bold", color: "#fff", fontSize: hp(1.7) }}>{name}</Text>
                        </View>
                        <View style={styles.logoutView}>
                            <Text style={{ fontFamily: "Montserrat", marginHorizontal: wp(2), fontWeight: "bold", color: "#fff", fontSize: hp(1.7) }}>Logout</Text>
                            <TouchableOpacity onPress={clearLogin} style={styles.logoutLogo}>
                                <MaterialIcons name="logout" size={wp(5)} color={"#fff"} />
                            </TouchableOpacity>
                        </View>
                    </View >


                    {/* get Main Storage */}
                    <View style={styles.scrollContainer}>
                        <TouchableOpacity onPress={handleInventory}>
                            <Text>Prikaži trenutno stanje Centralnog skladišta</Text>
                        </TouchableOpacity>
                        <Text style={styles.listMessage}>{listMessage}</Text>
                        <ScrollView style={styles.scrollView}>
                            {
                                InventoryList.map((part, index) => renderInventoryList(index))
                            }
                        </ScrollView>
                    </View>

                    {/* get Servicers storage */}
                    <View style={styles.scrollContainer}>
                        <TouchableOpacity onPress={handleServicerInventory}>
                            <Text>Prikaži trenutno stanje Servisera</Text>
                        </TouchableOpacity>
                        <Text style={styles.listMessage}>{listServicerMessage}</Text>
                        <ScrollView style={styles.scrollView}>
                            {
                                servicersDocList.map((doc, index) => renderServicersDocList(index))
                            }
                        </ScrollView>
                    </View>

                    {/* get Expenese Storage */}
                    <View style={styles.scrollContainerExpense}>
                        <TouchableOpacity onPress={handleExpenseInventory}>
                            <Text>Prikaži trenutno stanje skladišta Rashoda</Text>
                        </TouchableOpacity>

                        <Text style={styles.listMessage}>{expenseMessage}</Text>
                        <ScrollView style={styles.scrollView}>
                            {
                                expenseInventoryList.map((part, index) => renderExpenseInventoryList(index))
                            }
                        </ScrollView>
                        <TouchableOpacity onPress={deleteExpanseInventory} style={styles.deleteIconBox}>
                            <Feather name="trash-2" size={wp(4)} color={"#fff"} />
                        </TouchableOpacity>
                    </View>

                </LinearGradient>

                <View style={styles.bottomView}>

                    <TouchableOpacity onPress={() => { navigation.navigate("Menu") }} style={styles.iconBox}>
                        <Feather name="home" size={wp(5)} color={"#fff"} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBox}>
                        <Feather name="bar-chart-2" size={wp(5)} color={"yellow"} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("AddMenu")} style={styles.iconBox}>
                        <Feather name="plus" size={wp(5)} color={"#fff"} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBox}>
                        <Feather name="trash" size={wp(5)} color={"#fff"} />
                    </TouchableOpacity>

                </View>

            </ImageBackground>
        </>
    );
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
        bottom: hp(8),
        left: wp(10)
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
    deleteIconBox: {
        backgroundColor: "#000",
        borderRadius: wp(100),
        width: wp(10),
        height: wp(10),
        position: "absolute",
        right: wp(1.5),
        top: wp(1.5),
        alignItems: "center",
        justifyContent: "center",
        borderColor: "yellow",
        borderWidth: 1
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
        height: hp(17),
        marginTop: hp(4),
        padding: wp(4)
    },
    scrollContainerExpense: {
        backgroundColor: "rgba(255,255,255, 0.5)",
        borderRadius: wp(3),
        width: wp(80),
        height: hp(17),
        marginTop: hp(4),
        padding: wp(4),
        position: "relative"
    },
    scrollView: {
        paddingLeft: wp(2)
    },
    listMessage: {
        marginTop: hp(2),
        color: "green"
    }
});

export default Inventory;
