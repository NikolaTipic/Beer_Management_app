import React, { useContext, useState } from "react";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";

//components
import {
    StyleSheet, View, Animated, Easing, Text, Switch, ActivityIndicator,
    TouchableOpacity, TouchableHighlight, Modal
} from 'react-native';
//styled components
import { MsgBox, SuccessMsgBox, SubmitButton, SubmitButtonText, LeftIcon, StyledTextInputAddDispenser } from "../components/Styles";
//linearGradient
import { LinearGradient } from 'expo-linear-gradient';
//dimensions
import { widthPercentToDp as wp, heightPercentToDp as hp } from '../components/Dimensions';
//colors
import { Colors } from '../components/Styles';
//icons
import { Feather, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons"
//asyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage"
//credential context
import { CredentailsContext } from '../components/CredentialsContext';
//Style android bottom nav bar
import * as NavigationBar from 'expo-navigation-bar';
//radio buttons (switch selector)
import SwitchSelector from "react-native-switch-selector";
//form
import { Formik } from "formik";
//date time picker modal
import DateTimePickerModal from "react-native-modal-datetime-picker";
//Keyboard avoiding view
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
//axios
import axios from 'axios';



export default function Transfers({ navigation }) {

    //context
    const { storedCredentials, setStoredCredentials } = useContext(CredentailsContext)
    const { name, email, administrator, dispensers, parts } = storedCredentials

    const [modalPartsVisible, setModalPartsVisible] = useState(false);
    const [modalServicerVisible, setModalServicerVisible] = useState(false);
    const [modalExpenseVisible, setExpenseVisible] = useState(false);

    //modal visible
    const [selected, setSelected] = useState(null);

    const [message, setMessage] = useState();
    const [successMessage, setSuccessMessage] = useState();

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [date, setDate] = useState(new Date(2022, 0, 1));
    const [dols, setDols] = useState();

    const handleConfirm = (selectedDate) => {
        const currentDate = selectedDate || date;

        setDate(currentDate);
        setDols(currentDate);
        setDatePickerVisibility(false);
    }

    const quantityUnit = [
        { label: "Komada", value: "kom" },
        { label: "Metara", value: "m" },
        { label: "Litara", value: "l" }
    ];

    const clearLogin = () => {
        AsyncStorage
            .removeItem("beer")
            .then(() => {
                setStoredCredentials("");
            })
            .catch(error => console.log(error))
    }


    const addItem = (credentials, setSubmitting) => {
        const url = "https://salty-river-31434.herokuapp.com/part/addPart";

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

    const handleMessage = (message) => {
        setMessage(message)
    }

    const handleSuccessMessage = (message) => {
        setSuccessMessage(message)
    }

    const addFacility = (credentials, setSubmitting) => {
        const url = "https://salty-river-31434.herokuapp.com/facility/addFacility"

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
            });
    }

    const deleteFacility = (credentials, setSubmitting) => {
        const url = "https://salty-river-31434.herokuapp.com/facility/deleteFacility"

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
            });
    }

    const fromServicerToFacility = (credentials, setSubmitting) => {
        const url = "https://salty-river-31434.herokuapp.com/part/fromServicerToFacility"

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
            });
    }


    const fromServicerToCentral = (credentials, setSubmitting) => {
        const url = "https://salty-river-31434.herokuapp.com/part/fromServicerToCentral"

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
            });
    }

    const fromServicerToExpense = (credentials, setSubmitting) => {
        const url = "https://salty-river-31434.herokuapp.com/part/fromServicerToExpense"

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
            });
    }

    const fromFacilityToServicer = (credentials, setSubmitting) => {
        const url = "https://salty-river-31434.herokuapp.com/part/fromServicerToFacility"

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
            });
    }

    return (
        <>
            <StatusBar style="dark" />
            <LinearGradient colors={[Colors.brown, Colors.yellow, Colors.brown]} style={styles.container}>

                {/* Top view */}
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

                {/*Modal Add Facilitie */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={selected === 0}
                    onRequestClose={() => {
                        setSelected(null);
                        setMessage(null);
                        setSuccessMessage(null);
                    }}
                >
                    <KeyboardAvoidingWrapper>
                        <View style={styles.centeredView2}>
                            <View style={styles.modalView2}>

                                <Formik
                                    initialValues={{
                                        name: "",
                                        location: {
                                            city: "",
                                            address: ""
                                        },
                                        comment: ""
                                    }}
                                    onSubmit={(values, { setSubmitting }) => {
                                        values = { ...values };
                                        addFacility(values, setSubmitting);
                                    }}
                                >
                                    {
                                        ({ handleChange, handleBlur, handleSubmit, setFieldValue, values, isSubmitting, handleReset }) => (
                                            <View style={{ alignItems: "center" }}>
                                                <View style={styles.dispenserContainer}>
                                                    <Input
                                                        icon="clipboard"
                                                        placeholder="Ime objekta"
                                                        placeholderTextColor="#888"
                                                        onChangeText={handleChange("name")}
                                                        onBlur={handleBlur("name")}
                                                        value={values.name}
                                                        returnKeyType="next"
                                                    />

                                                    <Input
                                                        icon="target"
                                                        placeholder="Grad"
                                                        placeholderTextColor="#888"
                                                        onChangeText={handleChange("location.city")}
                                                        onBlur={handleBlur("location.city")}
                                                        value={values.location.city}
                                                        returnKeyType="next"
                                                    />

                                                    <Input
                                                        icon="map-pin"
                                                        placeholder="Adresa i mijesto"
                                                        placeholderTextColor="#888"
                                                        onChangeText={handleChange("location.address")}
                                                        onBlur={handleBlur("location.address")}
                                                        value={values.location.address}
                                                        returnKeyType="next"
                                                    />

                                                    <Input
                                                        icon="alert-circle"
                                                        placeholder="Komentar"
                                                        placeholderTextColor="#888"
                                                        onChangeText={handleChange("comment")}
                                                        onBlur={handleBlur("comment")}
                                                        value={values.comment}
                                                        returnKeyType="next"
                                                    />
                                                </View>

                                                <MsgBox style={{ marginTop: hp(0.5) }}>{message}</MsgBox>
                                                <SuccessMsgBox>{successMessage}</SuccessMsgBox>

                                                {!isSubmitting ? (
                                                    <SubmitButton style={{ marginTop: hp(1) }} onPress={() => {
                                                        handleSubmit();
                                                        setSuccessMessage(null);
                                                        setMessage(null);
                                                    }}>
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

                {/*Modal Remove Facilitie */}
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
                                        name: "",
                                    }}
                                    onSubmit={(values, { setSubmitting }) => {
                                        values = { ...values };
                                        deleteFacility(values, setSubmitting);
                                    }}
                                >
                                    {
                                        ({ handleChange, handleBlur, handleSubmit, setFieldValue, values, isSubmitting, handleReset }) => (
                                            <View style={{ alignItems: "center" }}>
                                                <View style={styles.dispenserContainer}>
                                                    <Input
                                                        icon="clipboard"
                                                        placeholder="Ime objekta"
                                                        placeholderTextColor="#888"
                                                        onChangeText={handleChange("name")}
                                                        onBlur={handleBlur("name")}
                                                        value={values.name}
                                                    />
                                                </View>

                                                <MsgBox style={{ marginTop: hp(0.5) }}>{message}</MsgBox>
                                                <SuccessMsgBox>{successMessage}</SuccessMsgBox>

                                                {!isSubmitting ? (
                                                    <SubmitButton style={{ marginTop: hp(1) }} onPress={() => {
                                                        handleSubmit();
                                                        setSuccessMessage(null);
                                                        setMessage(null);
                                                    }}>
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

                {/* Modal from Servicer to Facility*/}
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
                        <View style={styles.centeredView2}>
                            <View style={styles.modalView2}>

                                <Formik
                                    initialValues={{
                                        productCode: "",
                                        name: "",
                                        facilityName: "",
                                        quantity: ""
                                    }}
                                    onSubmit={(values, { setSubmitting }) => {
                                        values = { ...values };
                                        fromServicerToFacility(values, setSubmitting);
                                        setMessage(null);
                                        setSuccessMessage(null);
                                    }}
                                >
                                    {
                                        ({ handleChange, handleBlur, handleSubmit, setFieldValue, values, isSubmitting, handleReset }) => (
                                            <View style={{ alignItems: "center" }}>

                                                <View style={styles.dispenserContainer}>
                                                    <Input
                                                        icon="hash"
                                                        placeholder="Šifra proizvoda"
                                                        placeholderTextColor="#888"
                                                        onChangeText={handleChange("productCode")}
                                                        onBlur={handleBlur("productCode")}
                                                        value={values.productCode}
                                                        enterKeyHint="next"
                                                    />

                                                    <Input
                                                        icon="user"
                                                        placeholder="Ime servisera"
                                                        placeholderTextColor="#888"
                                                        onChangeText={handleChange("name")}
                                                        onBlur={handleBlur("name")}
                                                        value={values.name}
                                                        returnKeyType="next"
                                                    />

                                                    <Input
                                                        icon="clipboard"
                                                        placeholder="Ime objekta"
                                                        placeholderTextColor="#888"
                                                        onChangeText={handleChange("facilityName")}
                                                        onBlur={handleBlur("facilityName")}
                                                        value={values.facilityName}
                                                        returnKeyType="next"
                                                    />

                                                    <Input
                                                        icon="plus"
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

                {/* Modal from Servicer to Central Storage*/}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={selected === 4}
                    onRequestClose={() => {
                        setSelected(null);
                        setMessage(null);
                        setSuccessMessage(null);
                    }}
                >
                    <KeyboardAvoidingWrapper>
                        <View style={styles.centeredView3}>
                            <View style={styles.modalView3}>

                                <Formik
                                    initialValues={{
                                        productCode: "",
                                        name: "",
                                        quantity: ""
                                    }}
                                    onSubmit={(values, { setSubmitting }) => {
                                        values = { ...values };
                                        fromServicerToCentral(values, setSubmitting);
                                        setMessage(null);
                                        setSuccessMessage(null);
                                    }}
                                >
                                    {
                                        ({ handleChange, handleBlur, handleSubmit, setFieldValue, values, isSubmitting, handleReset }) => (
                                            <View style={{ alignItems: "center" }}>

                                                <View style={styles.dispenserContainer}>
                                                    <Input
                                                        icon="hash"
                                                        placeholder="Šifra proizvoda"
                                                        placeholderTextColor="#888"
                                                        onChangeText={handleChange("productCode")}
                                                        onBlur={handleBlur("productCode")}
                                                        value={values.productCode}
                                                        enterKeyHint="next"
                                                    />

                                                    <Input
                                                        icon="user"
                                                        placeholder="Ime servisera"
                                                        placeholderTextColor="#888"
                                                        onChangeText={handleChange("name")}
                                                        onBlur={handleBlur("name")}
                                                        value={values.name}
                                                        returnKeyType="next"
                                                    />

                                                    <Input
                                                        icon="plus"
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

                {/* Modal from Servicer to Expense */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={selected === 3}
                    onRequestClose={() => {
                        setSelected(null);
                        setMessage(null);
                        setSuccessMessage(null);
                    }}
                >
                    <KeyboardAvoidingWrapper>
                        <View style={styles.centeredView3}>
                            <View style={styles.modalView3}>

                                <Formik
                                    initialValues={{
                                        productCode: "",
                                        name: "",
                                        quantity: ""
                                    }}
                                    onSubmit={(values, { setSubmitting }) => {
                                        values = { ...values };
                                        fromServicerToExpense(values, setSubmitting);
                                        setMessage(null);
                                        setSuccessMessage(null);
                                    }}
                                >
                                    {
                                        ({ handleChange, handleBlur, handleSubmit, setFieldValue, values, isSubmitting, handleReset }) => (
                                            <View style={{ alignItems: "center" }}>

                                                <View style={styles.dispenserContainer}>
                                                    <Input
                                                        icon="hash"
                                                        placeholder="Šifra proizvoda"
                                                        placeholderTextColor="#888"
                                                        onChangeText={handleChange("productCode")}
                                                        onBlur={handleBlur("productCode")}
                                                        value={values.productCode}
                                                        returnKeyType="next"
                                                    />

                                                    <Input
                                                        icon="user"
                                                        placeholder="Ime servisera"
                                                        placeholderTextColor="#888"
                                                        onChangeText={handleChange("name")}
                                                        onBlur={handleBlur("name")}
                                                        value={values.name}
                                                        returnKeyType="next"
                                                    />

                                                    <Input
                                                        icon="plus"
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

                {/* Modal from Facility to Servicer*/}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={selected === 8}
                    onRequestClose={() => {
                        setSelected(null);
                        setMessage(null);
                        setSuccessMessage(null);
                    }}
                >
                    <KeyboardAvoidingWrapper>
                        <View style={styles.centeredView2}>
                            <View style={styles.modalView2}>

                                <Formik
                                    initialValues={{
                                        productCode: "",
                                        name: "",
                                        facilityName: "",
                                        quantity: ""
                                    }}
                                    onSubmit={(values, { setSubmitting }) => {
                                        values = { ...values };
                                        fromFacilityToServicer(values, setSubmitting);
                                        setMessage(null);
                                        setSuccessMessage(null);
                                    }}
                                >
                                    {
                                        ({ handleChange, handleBlur, handleSubmit, setFieldValue, values, isSubmitting, handleReset }) => (
                                            <View style={{ alignItems: "center" }}>

                                                <View style={styles.dispenserContainer}>
                                                    <Input
                                                        icon="hash"
                                                        placeholder="Šifra proizvoda"
                                                        placeholderTextColor="#888"
                                                        onChangeText={handleChange("productCode")}
                                                        onBlur={handleBlur("productCode")}
                                                        value={values.productCode}
                                                        enterKeyHint="next"
                                                    />

                                                    <Input
                                                        icon="clipboard"
                                                        placeholder="Ime objekta"
                                                        placeholderTextColor="#888"
                                                        onChangeText={handleChange("facilityName")}
                                                        onBlur={handleBlur("facilityName")}
                                                        value={values.facilityName}
                                                        returnKeyType="next"
                                                    />

                                                    <Input
                                                        icon="user"
                                                        placeholder="Ime servisera"
                                                        placeholderTextColor="#888"
                                                        onChangeText={handleChange("name")}
                                                        onBlur={handleBlur("name")}
                                                        value={values.name}
                                                        returnKeyType="next"
                                                    />

                                                    <Input
                                                        icon="plus"
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

                {/* Menu touchables */}
                <View style={styles.touchablesContainer}>
                    <View style={styles.iconContainer}>
                        <View style={styles.iconBottomLabel}>
                            <Text style={{ fontFamily: "Montserrat" }}>Dodaj/Izbriši Objekt</Text>
                        </View>
                    </View>
                    <View style={styles.iconContainer}>
                        <View style={styles.menuBottomContainerLeft}>
                            <TouchableOpacity onPress={() => setSelected(0)} style={styles.iconBox}>
                                <MaterialCommunityIcons name="domain-plus" size={wp(5)} color={"#ff0"} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.menuBottomContainerRight}>
                            <TouchableOpacity onPress={() => setSelected(1)} style={styles.iconBox}>
                                <MaterialCommunityIcons name="domain-remove" size={wp(5)} color={"#ff0"} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={styles.touchablesContainer}>
                    <View style={styles.iconLabel1}>
                        <Text style={{ fontFamily: "Montserrat" }}>Dijelovi</Text>
                    </View>
                    <View style={styles.iconContainer}>
                        <View style={styles.menuContainer}>
                            <TouchableOpacity onPress={() => setSelected(2)} style={styles.iconBox}>
                                <MaterialCommunityIcons name="map-marker-plus-outline" size={wp(5)} color={"#ff0"} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.menuContainer}>
                            <TouchableOpacity onPress={() => setSelected(3)} style={styles.iconBox}>
                                <Feather name="folder-minus" size={wp(5)} color={"#ff0"} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.menuContainer}>
                            <TouchableOpacity onPress={() => setSelected(4)} style={styles.iconBox}>
                                <MaterialCommunityIcons name="database-plus" size={wp(5)} color={"#ff0"} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.iconLabel}>
                        <Text style={{ fontFamily: "Montserrat" }}>Prebaci sa sevisera na :</Text>
                    </View>
                    <View style={styles.iconContainer}>
                        <View style={styles.menuContainer}>
                            <TouchableOpacity onPress={() => setModalPartsVisible(true)} style={styles.iconBox}>
                                <MaterialCommunityIcons name="map-marker-plus-outline" size={wp(5)} color={"#ff0"} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.menuContainer}>
                            <TouchableOpacity onPress={() => setModalPartsVisible(true)} style={styles.iconBox}>
                                <Feather name="folder-minus" size={wp(5)} color={"#ff0"} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.menuContainer}>
                            <TouchableOpacity onPress={() => setModalPartsVisible(true)} style={styles.iconBox}>
                                <MaterialCommunityIcons name="database-plus" size={wp(5)} color={"#ff0"} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.iconLabel2}>
                        <Text style={{ fontFamily: "Montserrat" }}>Točionici</Text>
                    </View>
                </View>

                <View style={styles.iconContainer}>
                    <View style={styles.iconBottomLabel}>
                        <Text style={{ fontFamily: "Montserrat" }}>S objekta na servisera</Text>
                    </View>
                </View>
                <View style={styles.iconContainer}>
                    <View style={styles.menuBottomContainerLeft}>
                        <TouchableOpacity onPress={() => setSelected(8)} style={styles.iconBox}>
                            <Feather name="settings" size={wp(5)} color={"#ff0"} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.menuBottomContainerRight}>
                        <TouchableOpacity onPress={() => setModalPartsVisible(true)} style={styles.iconBox}>
                            <MaterialCommunityIcons name="beer-outline" size={wp(5)} color={"#ff0"} />
                        </TouchableOpacity>
                    </View>
                </View>


                {/* Bottom Navigator */}
                <View style={styles.bottomViewMenu}>
                    <TouchableOpacity onPress={() => navigation.navigate("Menu")} style={styles.iconBoxMenu}>
                        <Feather name="home" size={wp(5)} color={"#fff"} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("Inventory")} style={styles.iconBoxMenu}>
                        <Feather name="bar-chart-2" size={wp(5)} color={"#fff"} />
                    </TouchableOpacity>



                    <TouchableOpacity onPress={() => navigation.navigate("AddMenu")} style={styles.iconBoxMenu}>
                        <MaterialCommunityIcons name="database" size={wp(5)} color={"#fff"} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBoxMenu}>
                        <Feather name="repeat" size={wp(5)} color={"yellow"} />
                    </TouchableOpacity>
                </View>
            </LinearGradient>
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
                <StyledTextInputAddDispenser {...props} />
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
    touchablesContainer: {
        marginBottom: hp(1.3)
    },
    iconContainer: {
        width: wp(80),
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    menuContainer: {
        display: "flex",
        width: wp(25),
        alignItems: "center",
        borderRadius: wp(1),
        marginBottom: hp(1),
        justifyContent: "center",
        backgroundColor: "rgba(250,250,250,0.5)",
    },
    menuBottomContainerLeft: {
        display: "flex",
        width: wp(38.7),
        alignItems: "center",
        borderRadius: wp(1),
        marginBottom: hp(1),
        justifyContent: "center",
        backgroundColor: "rgba(250,250,250,0.5)",
        borderBottomLeftRadius: 15
    },
    menuBottomContainerRight: {
        display: "flex",
        width: wp(38.7),
        alignItems: "center",
        borderRadius: wp(1),
        marginBottom: hp(1),
        justifyContent: "center",
        backgroundColor: "rgba(250,250,250,0.5)",
        borderBottomRightRadius: 15
    },
    iconLabel: {
        alignItems: "center",
        borderRadius: wp(1),
        marginBottom: hp(1),
        backgroundColor: "rgba(250,250,250,0.8)",
        paddingTop: hp(0.5),
        paddingBottom: hp(0.5),
        width: wp(80)
    },
    iconLabel1: {
        alignItems: "center",
        borderRadius: wp(1),
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        marginBottom: hp(1),
        backgroundColor: "rgba(250,250,250,0.5)",
        paddingTop: hp(0.5),
        paddingBottom: hp(0.5),
        width: wp(80)
    },
    iconLabel2: {
        alignItems: "center",
        borderRadius: wp(1),
        marginBottom: hp(1),
        backgroundColor: "rgba(250,250,250,0.5)",
        paddingTop: hp(0.5),
        paddingBottom: hp(0.5),
        width: wp(80),
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
    },
    iconBottomLabel: {
        alignItems: "center",
        marginBottom: hp(1),
        backgroundColor: "rgba(250,250,250,0.8)",
        paddingTop: hp(0.5),
        paddingBottom: hp(0.5),
        width: wp(80),
        borderRadius: wp(1),
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20
    },
    topView: {
        flexDirection: "row",
        height: hp(6),
        alignItems: "center",
        justifyContent: "space-around",
        marginVertical: hp(8),
        borderRadius: wp(15),
        width: wp(90),
        marginBottom: hp(5)

    },
    bottomView: {
        alignItems: "center",
        borderRadius: wp(5),
        marginHorizontal: wp(5),
        marginTop: hp(35)
    },
    bottomViewMenu: {
        display: "flex",
        position: "relative",
        alignItems: "center",
        borderRadius: wp(100),
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: "rgba(255,255,255, 0.5)",
        width: wp(80),
        bottom: hp(-4)
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
        marginLeft: "auto",
        marginRight: "auto"
    },
    iconBox: {
        padding: wp(4),
        borderRadius: wp(100),
        backgroundColor: "rgba(0,0,0,1)",
        marginVertical: hp(1.5)
    },
    iconBoxMenu: {
        margin: wp(3),
        backgroundColor: "rgba(0,0,0,0.9)",
        padding: wp(4),
        borderRadius: wp(100),
    },
    centeredView: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        marginTop: hp(13.7)
    },
    modalView: {
        backgroundColor: "rgba(0,0,0,0.93)",
        borderTopLeftRadius: wp(7),
        borderTopRightRadius: wp(7),
        padding: wp(5),
        alignItems: "center",
        shadowColor: "#000",
        elevation: 0,
        width: wp(100),
        height: hp(78)
    },

    centeredView2: {
        position: "relative",
        marginTop: hp(40)
    },

    modalView2: {
        backgroundColor: "rgba(0,0,0,0.93)",
        borderTopLeftRadius: wp(7),
        borderTopRightRadius: wp(7),
        padding: wp(5),
        alignItems: "center",
        shadowColor: "#000",
        elevation: 0,
        width: wp(100),
        height: hp(51)
    },

    centeredView3: {
        position: "relative",
        marginTop: hp(50)
    },

    modalView3: {
        backgroundColor: "rgba(0,0,0,0.93)",
        borderTopLeftRadius: wp(7),
        borderTopRightRadius: wp(7),
        padding: wp(5),
        alignItems: "center",
        shadowColor: "#000",
        elevation: 0,
        width: wp(100),
        height: hp(43)
    },

    centeredView4: {
        position: "relative",
        marginTop: hp(57)
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
        height: hp(35)
    },

    dispenserContainer: {
        alignItems: "center",
        borderRadius: wp(3),
        borderColor: "#fff",
        borderWidth: wp(0.2),
        padding: wp(5),
        paddingVertical: wp(3)
    }
});
