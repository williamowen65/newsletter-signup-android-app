import {
    StyleSheet,
    Text,
    View,
} from "react-native";
import { TextInput } from "react-native-paper";
import React from "react";
import Colors from "../../../constants/colors";

const Input = ({
    label,
    invalid,
    textInputConfig,
    style,
}) => {
    const inputStyles = [styles.input];

    if (textInputConfig?.multiline) {
        inputStyles.push(styles.inputMultiline);
    }

    if (invalid) {
        inputStyles.push(styles.invalidText);
    }

    return (
        <View
            style={[styles.inputContainer, style]}
        >
            {/* <Text style={[styles.label, invalid && styles.invalidText]}>{label}</Text> */}
            <TextInput
                {...textInputConfig}
                autoComplete='off'
                autoCorrect={false}
                mode='outlined'
                label={label}
            />
        </View>
    );
};

export default Input;

const styles = StyleSheet.create({
    inputContainer: {
        marginHorizontal: 4,
        marginBottom: 8,

        // flex: 1 // breaks multiline
    },
    // label: {
    //   fontSize: 12,
    //   color: Colors.primary500,
    //   marginBottom: 4,
    // },
    input: {
        backgroundColor: Colors.primary500,
        padding: 6,
        borderRadius: 6,
        fontSize: 18,
        color: "white",

    },
    inputMultiline: {
        minHeight: 100,
        textAlignVertical: "top",
    },
    invalidText: {
        backgroundColor: "#f04242",
    },
});
