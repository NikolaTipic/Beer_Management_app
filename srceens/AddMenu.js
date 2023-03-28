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

export default function AddMenu({ navigation }) {

    //context
    const { storedCredentials, setStoredCredentials } = useContext(CredentailsContext)
    const { name, email, administrator, dispensers, parts } = storedCredentials

    const [selected, setSelected] = useState(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [modalPartsVisible, setModalPartsVisible] = useState(false);
    const [modalServicerVisible, setModalServicerVisible] = useState(false);
    const [modalExpenseVisible, setExpenseVisible] = useState(false);

    const [message, setMessage] = useState();
    const [successMessage, setSuccessMessage] = useState();

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [date, setDate] = useState(new Date(2022, 0, 1));
    const [dols, setDols] = useState();

    //const [active, setActive] = useState(true);

    const handleConfirm = (selectedDate) => {
        const currentDate = selectedDate || date;

        setDate(currentDate);
        setDols(currentDate);
        setDatePickerVisibility(false);
    }

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    }

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const statusOptions = [
        { label: "Aktivan", value: "active" },
        { label: "Neaktivan", value: "inactive" },
    ];

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

    const addDispenser = (credentials, setSubmitting) => {
        handleMessage(null);
        const url = "https://salty-river-31434.herokuapp.com/dispenser/addDispenser";

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

    const addDispenserToServicer = (credentials, setSubmitting) => {
        const url = "https://salty-river-31434.herokuapp.com/dispenser/dispenerfromCentralToServicer"

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


    const addToServicer = (credentials, setSubmitting) => {
        const url = "https://salty-river-31434.herokuapp.com/part/addToServicer"

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

    const addToExpense = (credentials, setSubmitting) => {
        const url = "https://salty-river-31434.herokuapp.com/part/addToExpense"

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
                {/* Modal for adding Dispensers */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                        setMessage(null);
                        setSuccessMessage(null);
                    }}
                >
                    <KeyboardAvoidingWrapper>
                        <View style={styles.centeredView2}>
                            <View style={styles.modalView2}>

                                <DateTimePickerModal
                                    isVisible={isDatePickerVisible}
                                    mode="date"
                                    onConfirm={handleConfirm}
                                    onCancel={hideDatePicker}
                                    themeVariant=""
                                />


                                <Formik
                                    initialValues={{
                                        //status: "active",
                                        serialNum: "",
                                        invNumber: "",
                                        model: "",
                                        //dateOfLastSanitation: "",
                                        comment: ""
                                    }}
                                    onSubmit={(values, { setSubmitting }) => {
                                        values = { ...values/*, dateOfLastSanitation: dols*/ };
                                        addDispenser(values, setSubmitting);
                                        setMessage(null);
                                        setSuccessMessage(null);
                                    }}
                                >
                                    {
                                        ({ handleChange, handleBlur, handleSubmit, setFieldValue, values, isSubmitting, handleReset }) => (
                                            <View style={{ alignItems: "center" }}>
                                                {/* <Text style={{ color: "#fff", alignSelf: "center", marginBottom: hp(1), fontFamily: "Montserrat" }}>Status opreme</Text>
                                                <SwitchSelector
                                                    options={statusOptions}
                                                    initial={0}
                                                    onPress={value => {
                                                        setFieldValue("status", value);
                                                        setActive(!active);
                                                    }}
                                                    style={{ width: wp(80), marginBottom: hp(3) }}
                                                    buttonColor="#ff0"
                                                    selectedColor="#000"
                                                    height={hp(3.5)}
                                                /> */}

                                                <View style={styles.dispenserContainer}>
                                                    <Input
                                                        icon="hash"
                                                        placeholder="Serijski broj"
                                                        placeholderTextColor="#888"
                                                        onChangeText={handleChange("serialNum")}
                                                        onBlur={handleBlur("serialNum")}
                                                        value={values.serialNum}
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

                                                    <Input
                                                        icon="edit-3"
                                                        placeholder="Model"
                                                        placeholderTextColor="#888"
                                                        onChangeText={handleChange("model")}
                                                        onBlur={handleBlur("model")}
                                                        value={values.model}
                                                        returnKeyType="next"
                                                    />

                                                    {/* {active && (
                                                         <Input
                                                         icon="calendar"
                                                         placeholder="Datum zadnje sanitacije"
                                                         placeholderTextColor="#888"
                                                         onChangeText={handleChange("dateOfLastSanitation")}
                                                         onBlur={handleBlur("dateOfLastSanitation")}
                                                         value={dols ? dols.toDateString() : ""}
                                                         isDate={true}
                                                         editable={false}
                                                         showDatePicker={showDatePicker}
                                                     />
                                                    )} */}

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
                                        setModalVisible(false);
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

                {/* Modal for adding Dispenser to servicer*/}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={selected === 1}
                    onRequestClose={() => {
                        setSelected(null)
                        setMessage(null);
                        setSuccessMessage(null);
                    }}
                >
                    <KeyboardAvoidingWrapper>
                        <View style={styles.centeredView3}>
                            <View style={styles.modalView3}>

                                <Formik
                                    initialValues={{
                                        invNumber: "",
                                        name: ""
                                    }}
                                    onSubmit={(values, { setSubmitting }) => {
                                        values = { ...values };
                                        addDispenserToServicer(values, setSubmitting);
                                        setMessage(null);
                                        setSuccessMessage(null);
                                    }}
                                >
                                    {
                                        ({ handleChange, handleBlur, handleSubmit, setFieldValue, values, isSubmitting, handleReset }) => (
                                            <View style={{ alignItems: "center" }}>
                                                <View style={styles.dispenserContainer}>
                                                    <Input
                                                        icon="clipboard"
                                                        placeholder="inventurni broj"
                                                        placeholderTextColor="#888"
                                                        onChangeText={handleChange("invNumber")}
                                                        onBlur={handleBlur("invNumber")}
                                                        value={values.invNumber}
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

                {/* Modal for adding Parts */}
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
                                        quantityUnit: "kom",
                                        productName: "",
                                        productCode: "",
                                        quantity: ""
                                    }}
                                    onSubmit={(values, { setSubmitting }) => {
                                        values = { ...values };
                                        addItem(values, setSubmitting);
                                        setMessage(null);
                                        setSuccessMessage(null);
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
                                                        enterKeyHint="next"
                                                    />


                                                    <Text style={{ color: "#fff", alignSelf: "center", marginBottom: hp(1), fontFamily: "Montserrat" }}>Odaberite mjernu jedinicu</Text>
                                                    <SwitchSelector
                                                        options={quantityUnit}
                                                        initial={0}
                                                        onPress={value => {
                                                            setFieldValue("quantityUnit", value);
                                                        }}
                                                        style={{ width: wp(80), marginBottom: hp(3) }}
                                                        buttonColor="#ff0"
                                                        selectedColor="#000"
                                                        height={hp(3.5)}
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


                {/* Modal for adding part to servicer */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalServicerVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalServicerVisible);
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
                                        addToServicer(values, setSubmitting);
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
                                        setModalServicerVisible(false);
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

                {/* Modal for adding to Expense */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalExpenseVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalExpenseVisible);
                        setMessage(null);
                        setSuccessMessage(null);
                    }}
                >
                    <KeyboardAvoidingWrapper>
                        <View style={styles.centeredView4}>
                            <View style={styles.modalView4}>

                                <Formik
                                    initialValues={{
                                        productCode: "",
                                        quantity: ""
                                    }}
                                    onSubmit={(values, { setSubmitting }) => {
                                        values = { ...values };
                                        addToExpense(values, setSubmitting);
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
                                        setExpenseVisible(false);
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
                <View style={styles.menuContainer}>
                    <View style={styles.iconView}>
                        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.iconBox}>
                            <MaterialCommunityIcons name="water-pump" size={wp(6)} color={"#ff0"} />
                        </TouchableOpacity>
                        <Text style={{ fontFamily: "Montserrat" }}>Dodaj točionik</Text>
                    </View>
                </View>
                <View style={styles.menuContainer}>
                    <View style={styles.iconView}>
                        <TouchableOpacity onPress={() => setSelected(1)} style={styles.iconBox}>
                            <Feather name="user-plus" size={wp(6)} color={"#ff0"} />
                        </TouchableOpacity>
                        <Text style={{ fontFamily: "Montserrat" }}>Dodaj serviseru</Text>
                    </View>
                </View>
                <View style={styles.menuContainer}>
                    <View style={styles.iconView}>
                        <TouchableOpacity onPress={() => setModalPartsVisible(true)} style={styles.iconBox}>
                            <Feather name="settings" size={wp(6)} color={"#ff0"} />
                        </TouchableOpacity>
                        <Text style={{ fontFamily: "Montserrat" }}>Dodaj dijelove</Text>
                    </View>
                </View>
                <View style={styles.menuContainer}>
                    <View style={styles.iconView}>
                        <TouchableOpacity onPress={() => setModalServicerVisible(true)} style={styles.iconBox}>
                            <Feather name="user-plus" size={wp(6)} color={"#ff0"} />
                        </TouchableOpacity>
                        <Text style={{ fontFamily: "Montserrat" }}>Dodaj serviseru</Text>
                    </View>
                </View>
                <View style={styles.menuContainer}>
                    <View style={styles.iconView}>
                        <TouchableOpacity onPress={() => setExpenseVisible(true)} style={styles.iconBox}>
                            <Feather name="folder-minus" size={wp(6)} color={"#ff0"} />
                        </TouchableOpacity>
                        <Text style={{ fontFamily: "Montserrat" }}>Dodaj rashod</Text>
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
                        <MaterialCommunityIcons name="database" size={wp(5)} color={"yellow"} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("Transfers")} style={styles.iconBoxMenu}>
                        <Feather name="repeat" size={wp(5)} color={"#fff"} />
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
    menuContainer: {
        width: wp(65),
        alignItems: "center",
        borderRadius: wp(10),
        marginBottom: hp(1),
        justifyContent: "flex-start",
        backgroundColor: "rgba(250,250,250,0.5)",
        flexDirection: "column",
    },
    topView: {
        flexDirection: "row",
        height: hp(6),
        alignItems: "center",
        justifyContent: "space-around",
        marginVertical: hp(8),
        borderRadius: wp(15),
        width: wp(90),
        marginBottom: hp(10)

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
        bottom: hp(-5.5)
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
        justifyContent: "space-around",
        alignItems: "center",
    },
    iconBox: {
        marginVertical: wp(3),
        marginHorizontal: wp(0),
        padding: wp(5),
        borderRadius: wp(100),
        backgroundColor: "rgba(0,0,0,1)",
        left: wp(-8)
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
