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
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, ActivityIndicator, ScrollView, Modal } from "react-native"
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


const Menu = ({ navigation }) => {

    //context
    const { storedCredentials, setStoredCredentials } = useContext(CredentailsContext)
    const { name, email, administrator, dispensers, parts } = storedCredentials

    const [message, setMessage] = useState(null);
    const [listMessage, setListMessage] = useState(null);

    const [selectedDispenser, setSelectedDispenser] = useState(null);
    const [selectedFacility, setSelectedFacility] = useState(null);

    const [extend, setExtend] = useState(null);
    const [facilityExtend, setFacilityExtend] = useState(null);

    const [expiredDispensersList, setExpiredDispenserList] = useState([]);

    const [sending, setSending] = useState(null);
    const [successMail, setSuccessMail] = useState(null);
    const [current, setCurrent] = useState(0);

    const [selected, setSelected] = useState(null);

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
        setMessage(message);

        const url = "https://salty-river-31434.herokuapp.com/dispenser/findDispenser";

        axios
            .post(url, invNumber)
            .then((response) => {
                const result = response.data;
                const { status, message, data } = result;

                if (status !== "SUCCESS") {
                    setMessage(message);
                    setSubmitting(false);

                    return;
                }

                //why state cannot accept object from data? and why data has to be stored in variable to setState?
                const dispenser = data;
                setSelectedDispenser(dispenser);

                setSubmitting(false);
            })
            .catch(err => {
                setSubmitting(false);
                handleMessage("Error, provijeri svoju internetsku vezu, pa pokusaj ponovno!")
            });

    }

    const handleFacilitySearch = (name, setSubmitting) => {
        setMessage(message);

        const url = "https://salty-river-31434.herokuapp.com/facility/getFacilities";

        axios
            .post(url, name)
            .then((response) => {
                const result = response.data;
                const { status, message, data } = result;

                if (status !== "SUCCESS") {
                    setMessage(message);
                    setSubmitting(false);

                    return;
                }

                //why state cannot accept object from data? and why data has to be stored in variable to setState?
                const facility = data;
                setSelectedFacility(facility);

                setSubmitting(false);
            })
            .catch(err => {
                setSubmitting(false);
                handleMessage("Error, provijeri svoju internetsku vezu, pa pokusaj ponovo!");
            })

    }


    const dateToString = (date) => {
        const typeDate = new Date(date);

        return typeDate.toDateString();
    }


    const handleExpiredDispensers = () => {
        const url = "https://salty-river-31434.herokuapp.com/dispenser/checkForExpiredSanitation"
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

                    let arrayOfExpiredDispensers = [];

                    for (let i = 0; i < data.length; i++) {
                        arrayOfExpiredDispensers.push(data[i].invNumber, data[i].dts);
                    }

                    setExpiredDispenserList(arrayOfExpiredDispensers);
                    setListMessage(message);
                }
            })
    }


    const renderfExpiredDispenser = (index) => {
        if (index % 2 == 0)
            return (
                <>
                    <View key={index}>
                        <Text key={index}>{expiredDispensersList[index]} - {
                            (index < expiredDispensersList.length - 1) ? expiredDispensersList[index + 1] : ''
                        }</Text>
                    </View>
                </>
            );
    }

    const exportFacilityReportXlsx = () => {
        axios
            .get("https://salty-river-31434.herokuapp.com/excel/exportFacilityReportXlsx")
            .then((response) => {
                const result = response.data;
                const { status, message, data } = result;

                if (status !== "SUCCESS") {
                    setSuccessMail(0);
                    setSending(null);

                    return;
                }

                setSuccessMail(1);
                setSending(null);
            })
            .catch(err => {
                handleMessage("Error, provijeri svoju internetsku vezu, pa pokusaj ponovno!");
                setSuccessMail(0);
                setSending(null);
            });
    }

    const exportFacilities = () => {
        axios
            .get("https://salty-river-31434.herokuapp.com/excel/exportFacilityXlsx")
            .then((response) => {
                const result = response.data;
                const { status, message, data } = result;

                if (status !== "SUCCESS") {
                    setSuccessMail(0);
                    setSending(null);

                    return;
                }

                setSuccessMail(1);
                setSending(null);
            })
            .catch(err => {
                handleMessage("Error, provijeri svoju internetsku vezu, pa pokusaj ponovno!");
                setSuccessMail(0);
                setSending(null);
            });
    }

    const exportDispensersCentralXlsx = () => {
        axios
            .get("https://salty-river-31434.herokuapp.com/excel/exportDispensersCentralXlsx")
            .then((response) => {
                const result = response.data;
                const { status, message, data } = result;

                if (status !== "SUCCESS") {
                    setSuccessMail(0);
                    setSending(null);

                    return;
                }

                setSuccessMail(1);
                setSending(null);
            })
            .catch(err => {
                handleMessage("Error, provijeri svoju internetsku vezu, pa pokusaj ponovno!");
                setSuccessMail(0);
                setSending(null);
            });
    }

    const exportDispensersExpenseXlsx = () => {
        axios
            .get("https://salty-river-31434.herokuapp.com/excel/exportDispensersExpenseXlsx")
            .then((response) => {
                const result = response.data;
                const { status, message, data } = result;

                if (status !== "SUCCESS") {
                    setSuccessMail(0);
                    setSending(null);

                    return;
                }

                setSuccessMail(1);
                setSending(null);
            })
            .catch(err => {
                handleMessage("Error, provijeri svoju internetsku vezu, pa pokusaj ponovno!");
                setSuccessMail(0);
                setSending(null);
            });
    }

    const exportPartsXlsx = () => {
        axios
            .get("https://salty-river-31434.herokuapp.com/excel/exportPartsXlsx")
            .then((response) => {
                const result = response.data;
                const { status, message, data } = result;

                if (status !== "SUCCESS") {
                    setSuccessMail(0);
                    setSending(null);

                    return;
                }

                setSuccessMail(1);
                setSending(null);
            })
            .catch(err => {
                handleMessage("Error, provijeri svoju internetsku vezu, pa pokusaj ponovno!");
                setSuccessMail(0);
                setSending(null);
            });
    }

    const exportPartsExpenseXlsx = () => {
        axios
            .get("https://salty-river-31434.herokuapp.com/excel/exportPartsExpenseXlsx")
            .then((response) => {
                const result = response.data;
                const { status, message, data } = result;

                if (status !== "SUCCESS") {
                    setSuccessMail(0);
                    setSending(null);

                    return;
                }

                setSuccessMail(1);
                setSending(null);
            })
            .catch(err => {
                handleMessage("Error, provijeri svoju internetsku vezu, pa pokusaj ponovno!");
                setSuccessMail(0);
                setSending(null);
            });
    }

    const addCommentToDispenser = (credentials, setSubmitting) => {
        setMessage(message);

        const url = "https://salty-river-31434.herokuapp.com/comment/addCommentToDispenser";

        axios
            .post(url, credentials)
            .then((response) => {
                const result = response.data;
                const { status, message } = result;

                if (status !== "SUCCESS") {
                    setMessage(message);
                    setSubmitting(false);

                    return;
                }

                setSuccessMessage(message);
                setSubmitting(false);
            })
            .catch(err => {
                setSubmitting(false);
                handleMessage("Error, provijeri svoju internetsku vezu, pa pokusaj ponovo!");
            })

    }

    const addCommentToFacility = (credentials, setSubmitting) => {
        setMessage(message);

        const url = "https://salty-river-31434.herokuapp.com/comment/addCommentToFacility";

        axios
            .post(url, credentials)
            .then((response) => {
                const result = response.data;
                const { status, message } = result;

                if (status !== "SUCCESS") {
                    setMessage(message);
                    setSubmitting(false);

                    return;
                }

                setSuccessMessage(message);
                setSubmitting(false);
            })
            .catch(err => {
                setSubmitting(false);
                handleMessage("Error, provijeri svoju internetsku vezu, pa pokusaj ponovo!");
            })

    }

    return (
        <>
            <StatusBar style="light" />
            <ImageBackground source={require("../assets/MenuBackground.jpg")} resizeMode="cover" style={styles.backgroundMenu}>
                <LinearGradient colors={["rgba(200,200,200,0.4)", "rgba(200,200,200,0.4)", "rgba(200,200,200,0.4)"]} style={styles.container}>

                    {/* profile and logout */}
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

                    {/* bottom navigator */}
                    <View style={styles.bottomView}>

                        <TouchableOpacity style={styles.iconBox}>
                            <Feather name="home" size={wp(5)} color={"yellow"} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("Inventory")} style={styles.iconBox}>
                            <Feather name="bar-chart-2" size={wp(5)} color={"#fff"} />
                        </TouchableOpacity>



                        <TouchableOpacity onPress={() => navigation.navigate("AddMenu")} style={styles.iconBox}>
                            <MaterialCommunityIcons name="database" size={wp(5)} color={"#fff"} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("Transfers")} style={styles.iconBox}>
                            <Feather name="repeat" size={wp(5)} color={"#fff"} />
                        </TouchableOpacity>

                    </View>

                    {/* search scrool wiew */}
                    <View style={{ height: hp(44), overflow: "scroll", marginBottom: hp(1) }}>
                        <ScrollView>
                            {/*Search dispensers*/}
                            <View style={styles.formikContainer}>
                                <Formik
                                    initialValues={{ invNumber: "" }}
                                    onSubmit={(values, { setSubmitting }) => {
                                        if (values.invNumber == "") {
                                            handleMessage("Unos inventurnog broja je obavezan!");
                                            setSubmitting(false);
                                        }
                                        else {
                                            handleSearch(values, setSubmitting);
                                            values.invNumber = "";
                                        }
                                    }}
                                >
                                    {({ handleChange, handleBlur, handleSubmit, values, isSubmitting }) => (
                                        <View style={styles.searchContainer}>
                                            <View style={styles.searchView}>
                                                <StylesTextInputSearchBar
                                                    placeholder="Unesite inventurni broj..."
                                                    placeholderTextColor={"#888"}
                                                    onChangeText={handleChange("invNumber")}
                                                    onBlur={handleBlur("invNumber")}
                                                    value={values.invNumber}
                                                />
                                                {!isSubmitting ? (
                                                    <RightIcon onPress={() => {
                                                        handleSubmit();
                                                        setMessage(null);
                                                        setSuccessMessage(null);
                                                    }}>
                                                        <Feather name="search" size={wp(5.5)} color={"#ff0"} />
                                                    </RightIcon>
                                                ) : (
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

                                            {selectedDispenser && (
                                                <View style={{ flexDirection: "row", marginTop: hp(1) }}>
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
                                                            name="clipboard"
                                                            size={wp(3.5)}
                                                            color={"#000"}
                                                        />
                                                    </View>

                                                    <TouchableOpacity
                                                        style={styles.invNumberTouch}
                                                        onPress={() => setExtend(true)}
                                                    >
                                                        <Text style={{ color: "#ff0" }}>Inventurni broj:  </Text>
                                                        <Text style={{ color: "#fff" }}>{selectedDispenser.invNumber}</Text>
                                                    </TouchableOpacity>

                                                    <TouchableOpacity onPress={() => {
                                                        setSelectedDispenser(null);
                                                        setExtend(null)
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
                                                    <View style={{ flexDirection: "row" }}>
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
                                                                name="hash"
                                                                size={wp(3.5)}
                                                                color={"#000"}
                                                            />
                                                        </View>

                                                        <TouchableOpacity style={styles.invNumberTouch}>
                                                            <Text style={{ color: "#ff0" }}>Serijski broj:  </Text>
                                                            <Text style={{ color: "#fff" }}>{selectedDispenser.serialNum}</Text>
                                                        </TouchableOpacity>
                                                    </View>

                                                    <View style={{ flexDirection: "row" }}>
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
                                                                name="activity"
                                                                size={wp(3.5)}
                                                                color={"#000"}
                                                            />
                                                        </View>

                                                        <TouchableOpacity style={styles.invNumberTouch}>
                                                            <Text style={{ color: "#ff0" }}>status:  </Text>
                                                            <Text style={{ color: "#fff" }}>{selectedDispenser.status}</Text>
                                                        </TouchableOpacity>
                                                    </View>

                                                    <View style={{ flexDirection: "row" }}>
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
                                                                name="engine-outline"
                                                                size={wp(3.5)}
                                                                color={"#000"}
                                                            />
                                                        </View>

                                                        <TouchableOpacity style={styles.invNumberTouch}>
                                                            <Text style={{ color: "#ff0" }}>Model:  </Text>
                                                            <Text style={{ color: "#fff" }}>{selectedDispenser.model}</Text>
                                                        </TouchableOpacity>
                                                    </View>

                                                    <View style={{ flexDirection: "row" }}>
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
                                                            <Text style={{ color: "#ff0" }}>Datum Z S:  </Text>
                                                            <Text style={{ color: "#fff" }}>{dateToString(selectedDispenser.dateOfLastSanitation)}</Text>
                                                        </TouchableOpacity>
                                                    </View>

                                                    <View style={{ flexDirection: "row" }}>
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
                                                            <Text style={{ color: "#ff0" }}>Dana do Sanitacije:  </Text>
                                                            <Text style={{ color: "#fff" }}>{selectedDispenser.dts}</Text>
                                                        </TouchableOpacity>
                                                    </View>

                                                    <View style={{ flexDirection: "row" }}>
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
                                                            <Text style={{ color: "#ff0" }}>Lokacija:  </Text>
                                                            <Text style={{ color: "#fff" }}>{selectedDispenser.location}</Text>
                                                        </TouchableOpacity>
                                                    </View>

                                                    <View style={{ flexDirection: "row" }}>
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
                                                                name="alert-circle"
                                                                size={wp(3.5)}
                                                                color={"#000"}
                                                            />
                                                        </View>



                                                        <TouchableOpacity style={styles.invNumberTouch}>
                                                            <Text style={{ color: "#ff0" }}>Komentar:  </Text>
                                                            <View>
                                                                {selectedDispenser.comment.map((comment, index) => {
                                                                    return (
                                                                        <Text key={index} style={{ color: "#fff" }}>- {comment}</Text>
                                                                    );
                                                                })}
                                                            </View>
                                                        </TouchableOpacity>
                                                    </View>
                                                </>

                                            )}

                                        </View>
                                    )}
                                </Formik>
                            </View>

                            {/*Search facilities */}
                            <View style={styles.formikContainer}>
                                <Formik
                                    initialValues={{ name: "" }}
                                    onSubmit={(values, { setSubmitting }) => {
                                        if (values.name == "") {
                                            handleMessage("Unos imena objekta je obavezan!");
                                            setSubmitting(false);
                                        }
                                        else {
                                            handleFacilitySearch(values, setSubmitting);
                                            values.name = "";
                                        }
                                    }}
                                >
                                    {({ handleChange, handleBlur, handleSubmit, values, isSubmitting }) => (
                                        <View style={styles.searchContainer}>
                                            <View style={styles.searchView}>
                                                <StylesTextInputSearchBar
                                                    placeholder="Unesite ime objekta..."
                                                    placeholderTextColor={"#888"}
                                                    onChangeText={handleChange("name")}
                                                    onBlur={handleBlur("name")}
                                                    value={values.name}
                                                />
                                                {!isSubmitting ? (
                                                    <RightIcon onPress={() => {
                                                        handleSubmit();
                                                        setMessage(null);
                                                        setSuccessMessage(null);
                                                    }}>
                                                        <MaterialCommunityIcons name="home-search-outline" size={wp(6)} color={"#ff0"} />
                                                    </RightIcon>
                                                ) : (
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

                                            {selectedFacility && (
                                                <View style={{ flexDirection: "column", marginTop: hp(1) }}>

                                                    {selectedFacility.map((facility, index) => {
                                                        return (
                                                            <View>
                                                                <View key={index} style={{ flexDirection: "row", marginTop: hp(1) }}>
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
                                                                            name="home"
                                                                            size={wp(3.5)}
                                                                            color={"#000"}
                                                                        />
                                                                    </View>

                                                                    <TouchableOpacity
                                                                        style={styles.invNumberTouch}
                                                                        onPress={() => setFacilityExtend(index)}
                                                                    >
                                                                        <Text style={{ color: "#ff0" }}> Ime Objekta:  </Text>
                                                                        <Text key={index} style={{ color: "#fff" }}>{facility.name}</Text>
                                                                    </TouchableOpacity>

                                                                    <TouchableOpacity onPress={() => {
                                                                        setSelectedFacility(null);
                                                                        setFacilityExtend(null)
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

                                                                {facilityExtend === index && (
                                                                    <>
                                                                        <View style={{ flexDirection: "row" }}>
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
                                                                                    name="hash"
                                                                                    size={wp(3.5)}
                                                                                    color={"#000"}
                                                                                />
                                                                            </View>

                                                                            <TouchableOpacity style={styles.invNumberTouch}>
                                                                                <Text style={{ color: "#ff0" }}>ID objekta:  </Text>
                                                                                <Text style={{ color: "#fff" }}>{facility.id}</Text>
                                                                            </TouchableOpacity>
                                                                        </View>

                                                                        <View style={{ flexDirection: "row" }}>
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
                                                                                <Text style={{ color: "#ff0" }}>Grad:  </Text>
                                                                                <Text style={{ color: "#fff" }}>{facility.location.city}</Text>
                                                                            </TouchableOpacity>
                                                                        </View>

                                                                        <View style={{ flexDirection: "row" }}>
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
                                                                                <Text style={{ color: "#ff0" }}>Adresa:  </Text>
                                                                                <Text style={{ color: "#fff" }}>{facility.location.address}</Text>
                                                                            </TouchableOpacity>
                                                                        </View>

                                                                        <View style={{ flexDirection: "row" }}>
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
                                                                                    name="alert-circle"
                                                                                    size={wp(3.5)}
                                                                                    color={"#000"}
                                                                                />
                                                                            </View>

                                                                            <TouchableOpacity style={styles.invNumberTouch}>
                                                                                <Text style={{ color: "#ff0" }}>Komentar:  </Text>
                                                                                <View>
                                                                                    {facility.comment.map((comment, index) => {
                                                                                        return (
                                                                                            <Text key={index} style={{ color: "#fff" }}>- {comment}</Text>
                                                                                        );
                                                                                    })}
                                                                                </View>
                                                                            </TouchableOpacity>
                                                                        </View>

                                                                        <View style={{ flexDirection: "row" }}>
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
                                                                                    name="water-pump"
                                                                                    size={wp(3.5)}
                                                                                    color={"#000"}
                                                                                />
                                                                            </View>

                                                                            <TouchableOpacity style={styles.invNumberTouch}>
                                                                                <View>
                                                                                    <Text style={{ color: "#ff0", alignSelf: "center" }}>Točionici:  </Text>
                                                                                    <View>
                                                                                        {facility.dispensers.map((dispenser, index) => {
                                                                                            return (
                                                                                                <Text key={index} style={{ color: "#fff" }}>- {dispenser.invNumber} - {dispenser.status}</Text>
                                                                                            );
                                                                                        })}
                                                                                    </View>
                                                                                </View>
                                                                            </TouchableOpacity>
                                                                        </View>
                                                                    </>

                                                                )}
                                                            </View>
                                                        );
                                                    })}
                                                </View>
                                            )}

                                        </View>
                                    )}
                                </Formik>
                            </View>
                        </ScrollView>
                    </View>

                    {/*Add comment */}
                    {extend == facilityExtend && (
                        <View style={styles.commentContainer}>
                            <TouchableOpacity onPress={() => {
                                setSelected(1);
                            }}>
                                <View style={[styles.exportIconContainer, styles.borderLeftComment]}>
                                    <MaterialCommunityIcons name="water-pump" size={wp(5)} color={"#000"} />
                                </View>
                            </TouchableOpacity>
                            <View style={styles.textContainer}>
                                <Text style={{ color: Colors.white }}>Dodaj Komentar</Text>
                            </View>
                            <TouchableOpacity onPress={() => {
                                setSelected(2);
                            }}>
                                <View style={[styles.exportIconContainer, styles.borderRightComment]}>
                                    <MaterialIcons name="location-pin" size={wp(5)} color={"#000"} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Modal Add comment to Dispenser */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={selected === 1}
                        onRequestClose={() => {
                            setSelected(null);
                            setMessage(null);
                            setSuccessMessage(null);
                        }}
                    >
                        <KeyboardAvoidingWrapper>
                            <View style={styles.centeredView4}>
                                <View style={styles.modalView4}>

                                    <Formik
                                        initialValues={{
                                            comment: "",
                                            invNumber: ""
                                        }}
                                        onSubmit={(values, { setSubmitting }) => {
                                            values = { ...values };
                                            addCommentToDispenser(values, setSubmitting);
                                            setMessage(null);
                                            setSuccessMessage(null);
                                        }}
                                    >
                                        {
                                            ({ handleChange, handleBlur, handleSubmit, setFieldValue, values, isSubmitting, handleReset }) => (
                                                <View style={{ alignItems: "center" }}>

                                                    <View style={styles.dispenserContainer}>
                                                        <Input
                                                            icon="user"
                                                            placeholder="Unesi komentar..."
                                                            placeholderTextColor="#888"
                                                            onChangeText={handleChange("comment")}
                                                            onBlur={handleBlur("comment")}
                                                            value={values.comment}
                                                            returnKeyType="next"
                                                        />

                                                        <Input
                                                            icon="clipboard"
                                                            placeholder="Inventurni broj"
                                                            placeholderTextColor="#888"
                                                            onChangeText={handleChange("invNumber")}
                                                            onBlur={handleBlur("invNumber")}
                                                            value={values.invNumber}
                                                            returnKeyType="next"
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
                                            setSelected(null);
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

                    {/* Modal Add comment to Facility */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={selected === 2}
                        onRequestClose={() => {
                            setSelected(null);
                            setMessage(null);
                            setSuccessMessage(null);
                        }}
                    >
                        <KeyboardAvoidingWrapper>
                            <View style={styles.centeredView4}>
                                <View style={styles.modalView4}>

                                    <Formik
                                        initialValues={{
                                            comment: "",
                                            id: ""
                                        }}
                                        onSubmit={(values, { setSubmitting }) => {
                                            values = { ...values };
                                            addCommentToFacility(values, setSubmitting);
                                            setMessage(null);
                                            setSuccessMessage(null);
                                        }}
                                    >
                                        {
                                            ({ handleChange, handleBlur, handleSubmit, setFieldValue, values, isSubmitting, handleReset }) => (
                                                <View style={{ alignItems: "center" }}>

                                                    <View style={styles.dispenserContainer}>
                                                        <Input
                                                            icon="user"
                                                            placeholder="Unesi komentar..."
                                                            placeholderTextColor="#888"
                                                            onChangeText={handleChange("comment")}
                                                            onBlur={handleBlur("comment")}
                                                            value={values.comment}
                                                            returnKeyType="next"
                                                        />

                                                        <Input
                                                            icon="clipboard"
                                                            placeholder="ID objekta"
                                                            placeholderTextColor="#888"
                                                            onChangeText={handleChange("id")}
                                                            onBlur={handleBlur("id")}
                                                            value={values.id}
                                                            returnKeyType="next"
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
                                            setSelected(null);
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

                    {/* export */}
                    <View style={styles.exportContainer}>
                        <View style={styles.exportItemsContainer}>
                            <View style={[styles.exportItemContainer, styles.borderLeftRadious, styles.LeftBorderRightRadious]}>
                                <TouchableOpacity onPress={() => {
                                    setSuccessMail(null);
                                    setCurrent(1);
                                    setSending(1);
                                    exportFacilityReportXlsx();
                                }}>
                                    {sending === 1 ? (
                                        <View style={[styles.exportIconContainer, styles.borderLeftRadious]}>
                                            <ActivityIndicator size={hp(2.5)} color="#000" />
                                        </View>
                                    ) : (
                                        <View style={[styles.exportIconContainer, styles.borderLeftRadious]}>
                                            {current !== 1 && (<MaterialCommunityIcons name="email-send-outline" size={wp(5.5)} color={"#000"} />)}
                                            {successMail === 0 && current === 1 && (<MaterialCommunityIcons name="email-send-outline" size={wp(5.5)} color={"red"} />)}
                                            {successMail === 1 && current === 1 && (<MaterialCommunityIcons name="email-send-outline" size={wp(5.5)} color={"green"} />)}
                                        </View>
                                    )}
                                </TouchableOpacity>
                                <Text style={[styles.marginRight, { color: Colors.white }]}>
                                    Dnevno Izvješće
                                </Text>
                            </View>
                            <View style={[styles.exportItemContainer, styles.borderRightRadious, styles.RightBorderLeftRadious]}>
                                <Text style={[styles.marginLeft, { color: Colors.white }]}>
                                    Tjedno Izvješće
                                </Text>
                                <TouchableOpacity onPress={() => {
                                    setSuccessMail(null);
                                    setCurrent(2);
                                    setSending(2);
                                    exportFacilities();
                                }}>
                                    {sending === 2 ? (
                                        <View style={[styles.exportIconContainer, styles.borderRightRadious]}>
                                            <ActivityIndicator size={hp(2.5)} color="#000" />
                                        </View>
                                    ) : (
                                        <View style={[styles.exportIconContainer, styles.borderRightRadious]}>
                                            {current !== 2 && (<MaterialCommunityIcons name="email-send-outline" size={wp(5.5)} color={"#000"} />)}
                                            {successMail === 0 && current === 2 && (<MaterialCommunityIcons name="email-send-outline" size={wp(5.5)} color={"red"} />)}
                                            {successMail === 1 && current === 2 && (<MaterialCommunityIcons name="email-send-outline" size={wp(5.5)} color={"green"} />)}
                                        </View>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.exportItemsContainer}>
                            <View style={[styles.exportItemContainer, styles.borderLeftRadious, styles.LeftBorderRightRadious]}>
                                <TouchableOpacity onPress={() => {
                                    setSuccessMail(null);
                                    setCurrent(3);
                                    setSending(3);
                                    exportDispensersCentralXlsx();
                                }}>
                                    {sending === 3 ? (
                                        <View style={[styles.exportIconContainer, styles.borderLeftRadious]}>
                                            <ActivityIndicator size={hp(2.5)} color="#000" />
                                        </View>
                                    ) : (
                                        <View style={[styles.exportIconContainer, styles.borderLeftRadious]}>
                                            {current !== 3 && (<MaterialCommunityIcons name="email-send-outline" size={wp(5.5)} color={"#000"} />)}
                                            {successMail === 0 && current === 3 && (<MaterialCommunityIcons name="email-send-outline" size={wp(5.5)} color={"red"} />)}
                                            {successMail === 1 && current === 3 && (<MaterialCommunityIcons name="email-send-outline" size={wp(5.5)} color={"green"} />)}
                                        </View>
                                    )}
                                </TouchableOpacity>
                                <Text style={[styles.marginRight, { color: Colors.white }]}>
                                    Točionici Centr
                                </Text>
                            </View>
                            <View style={[styles.exportItemContainer, styles.borderRightRadious, styles.RightBorderLeftRadious]}>
                                <Text style={[styles.marginLeft, { color: Colors.white }]}>
                                    Točionici Rashod
                                </Text>
                                <TouchableOpacity onPress={() => {
                                    setSuccessMail(null);
                                    setCurrent(4);
                                    setSending(4);
                                    exportDispensersExpenseXlsx();
                                }}>
                                    {sending === 4 ? (
                                        <View style={[styles.exportIconContainer, styles.borderRightRadious]}>
                                            <ActivityIndicator size={hp(2.5)} color="#000" />
                                        </View>
                                    ) : (
                                        <View style={[styles.exportIconContainer, styles.borderRightRadious]}>
                                            {current !== 4 && (<MaterialCommunityIcons name="email-send-outline" size={wp(5.5)} color={"#000"} />)}
                                            {successMail === 0 && current === 4 && (<MaterialCommunityIcons name="email-send-outline" size={wp(5.5)} color={"red"} />)}
                                            {successMail === 1 && current === 4 && (<MaterialCommunityIcons name="email-send-outline" size={wp(5.5)} color={"green"} />)}
                                        </View>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.exportItemsContainer}>
                            <View style={[styles.exportItemContainer, styles.borderLeftRadious, styles.LeftBorderRightRadious]}>
                                <TouchableOpacity onPress={() => {
                                    setSuccessMail(null);
                                    setCurrent(5);
                                    setSending(5);
                                    exportPartsXlsx();
                                }}>
                                    {sending === 5 ? (
                                        <View style={[styles.exportIconContainer, styles.borderLeftRadious]}>
                                            <ActivityIndicator size={hp(2.5)} color="#000" />
                                        </View>
                                    ) : (
                                        <View style={[styles.exportIconContainer, styles.borderLeftRadious]}>
                                            {current !== 5 && (<MaterialCommunityIcons name="email-send-outline" size={wp(5.5)} color={"#000"} />)}
                                            {successMail === 0 && current === 5 && (<MaterialCommunityIcons name="email-send-outline" size={wp(5.5)} color={"red"} />)}
                                            {successMail === 1 && current === 5 && (<MaterialCommunityIcons name="email-send-outline" size={wp(5.5)} color={"green"} />)}
                                        </View>
                                    )}
                                </TouchableOpacity>
                                <Text style={[styles.marginRight, { color: Colors.white }]}>
                                    Djelovi Centr
                                </Text>
                            </View>
                            <View style={[styles.exportItemContainer, styles.borderRightRadious, styles.RightBorderLeftRadious]}>
                                <Text style={[styles.marginLeft, { color: Colors.white }]}>
                                    Djelovi Rashod
                                </Text>
                                <TouchableOpacity onPress={() => {
                                    setSuccessMail(null);
                                    setCurrent(6);
                                    setSending(6);
                                    exportPartsExpenseXlsx();
                                }}>
                                    {sending === 6 ? (
                                        <View style={[styles.exportIconContainer, styles.borderRightRadious]}>
                                            <ActivityIndicator size={hp(2.5)} color="#000" />
                                        </View>
                                    ) : (
                                        <View style={[styles.exportIconContainer, styles.borderRightRadious]}>
                                            {current !== 6 && (<MaterialCommunityIcons name="email-send-outline" size={wp(5.5)} color={"#000"} />)}
                                            {successMail === 0 && current === 6 && (<MaterialCommunityIcons name="email-send-outline" size={wp(5.5)} color={"red"} />)}
                                            {successMail === 1 && current === 6 && (<MaterialCommunityIcons name="email-send-outline" size={wp(5.5)} color={"green"} />)}
                                        </View>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>


                    {/* <SubmitButton onPress={exportFacilities} style={{}}>
                        <Text>Export Facility</Text>
                    </SubmitButton> */}


                    {/* <View style={styles.scrollContainer}>
                        <TouchableOpacity onPress={handleExpiredDispensers}>
                            <Text>Prikazi istekle točionike</Text>
                        </TouchableOpacity>
                        <Text style={styles.listMessage}>{listMessage}</Text>
                        <ScrollView style={styles.scrollView}>
                            {
                                expiredDispensersList.map((dispenser, index) => renderfExpiredDispenser(index))
                            }
                        </ScrollView>
                    </View> */}

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
        borderRadius: wp(1.5),
        marginTop: hp(1),
        flexDirection: "row",
        padding: wp(0.5),
        justifyContent: "center",
        width: wp(60),
        maxWidth: wp(60),
        alignSelf: "center",
        paddingVertical: wp(1),
        flexWrap: "wrap"
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
    },

    exportContainer: {
        backgroundColor: "rgba(255,255,255, 0.5)",
        padding: wp(2),
        borderRadius: wp(2)
    },

    exportItemsContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
    },

    exportItemContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.9)",
        width: wp(38),
        height: hp(4),
        margin: wp(1)
    },

    exportIconContainer: {
        backgroundColor: "rgba(255,255,0,0.9)",
        height: hp(4),
        width: wp(10),
        alignItems: "center",
        justifyContent: "center"
    },

    borderLeftRadious: {
        borderTopLeftRadius: wp(10),
        borderBottomLeftRadius: wp(10)
    },

    borderRightRadious: {
        borderTopRightRadius: wp(10),
        borderBottomRightRadius: wp(10)
    },

    RightBorderLeftRadious: {
        borderTopLeftRadius: wp(2),
        borderBottomLeftRadius: wp(2)
    },

    LeftBorderRightRadious: {
        borderTopRightRadius: wp(2),
        borderBottomRightRadius: wp(2)
    },

    marginRight: {
        marginRight: wp(2)
    },

    marginLeft: {
        marginLeft: wp(2)
    },

    commentContainer: {
        display: "flex",
        flexDirection: "row",
        backgroundColor: "rgba(255,255,255, 0.5)",
        padding: wp(2),
        borderRadius: wp(2),
        position: "absolute",
        bottom: hp(43)
    },

    textContainer: {
        backgroundColor: "rgba(0,0,0,0.9)",
        justifyContent: "center",
        padding: wp(2)
    },

    borderLeftComment: {
        borderTopLeftRadius: wp(1),
        borderBottomLeftRadius: wp(1)
    },

    borderRightComment: {
        borderTopRightRadius: wp(1),
        borderBottomRightRadius: wp(1)
    },

    centeredView4: {
        position: "relative",
        marginTop: hp(54)
    },

    modalView4: {
        backgroundColor: "rgba(0,0,0,0.93)",
        borderTopLeftRadius: wp(7),
        borderTopRightRadius: wp(7),
        padding: wp(5),
        alignItems: "center",
        shadowColor: "#000",
        elevation: 0,
        width: wp(100),
        height: hp(37)
    }
});

export default Menu;
