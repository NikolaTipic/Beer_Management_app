import React from "react";

//keyboard avoiding view
import { KeyboardAvoidingView, ScrollView, Keyboard, TouchableWithoutFeedback } from "react-native";


const KeyboardAvoidingWrapper = ({children}) => {
    return (
        <KeyboardAvoidingView>
            <ScrollView fadingEdgeLength={0} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    {children}
                </TouchableWithoutFeedback>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default KeyboardAvoidingWrapper;
