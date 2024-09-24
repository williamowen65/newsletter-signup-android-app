import {
    View,
    Text,
    StyleSheet,
    Alert,
    SafeAreaView,
    StatusBar,
    Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";
import Input from "./components/Input";
import { useState } from "react";
import Button from "./components/Button";
import colors from "../../constants/colors";
import {
    useSelector,
    useDispatch,
    connect,
} from "react-redux";
import {
    addToQueue,
    setQueue,
    Subscriber,
    updateQueue,
    submitQueueAndClear,
} from "../../store/subscriptionQueue";
// import { Button } from 'react-native-paper'

// import axios from "axios";
// import { getAllShows } from "../../utils/https";



const Form = ({
    submitButtonLabel,
    onSubmit,
    onCancel,
    defaultValues,
}) => {
    // const data = useSelector(
    //     (state) => state.subscriptionQueue.queue
    // );

    const dispatch = useDispatch();

    const [values, setValues] = useState({
        name: "",
        email: "",
    });

    const [isValidEmail, setIsValidEmail] = useState(false)
    const [userAttemptedToSubmit, setUserAttemptedToSubmit] = useState(false)

    const handleSubscriber = (res) => {
        // console.log("update queue", res);
        dispatch(setQueue(res));
    };

    const handleSubmit = () => {
        if (!values.name || !values.email) {
            Alert.alert(
                "Requires both fields",
                "Name & Email"
            );
            return;
        }
        if (!validateEmail(values.email)) {
            Alert.alert("Enter a valid email")
            return
        }

        AsyncStorage.getItem(
            "SubscriptionQueue"
        ).then((res) => {
            const newData = Object.assign(
                {},
                entry
            );

            // console.log(
            //     "#1",
            //     "New",
            //     newData,
            //     "RESSS",
            //     res,
            //     typeof res
            // );
            if (!res)
                AsyncStorage.setItem(
                    "SubscriptionQueue",
                    JSON.stringify([newData])
                )
                    .then((res) =>
                        // console.log(res)
                        handleSubscriber([
                            newData,
                        ])
                    )
                    .catch((err) =>
                        console.error(err)
                    );
            else {
                const allData = [
                    newData,
                    ...JSON.parse(res),
                ];
                AsyncStorage.setItem(
                    "SubscriptionQueue",
                    JSON.stringify(allData)
                )
                    .then((res) =>
                        // console.log(res)
                        handleSubscriber(allData)
                    )
                    .catch((err) =>
                        console.error(err)
                    );
            }
        });

        const entry = new Subscriber(
            values.name.trim(),
            values.email.trim()
        );
        // dispatch(
        //     addToQueue(Object.assign({}, entry))
        // );

        setValues({
            name: "",
            email: "",
        });
        Keyboard.dismiss();
        setUserAttemptedToSubmit(false)
    };

    // useEffect(() => {
    //     AsyncStorage.getItem(
    //         "SubscriptionQueue"
    //     ).then((res) => {
    //         // console.log('subQue', res, JSON.parse(res));
    //         if (res) {
    //             dispatch(
    //                 setQueue(JSON.parse(res))
    //             );
    //         }
    //     });
    // }, []);


    function validateEmail(email) {
        const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
        return emailPattern.test(email);
    }

    return (
        <>
            <View style={styles.formContainer}>
                <View style={styles.form}>
                    <Input
                        label={"Full Name"}
                        textInputConfig={{
                            style: { fontSize: 40 },
                            autoCapitalize:
                                "words",
                            value: values.name,
                            onChangeText: (e) =>
                                setValues(
                                    (vals) => ({
                                        ...vals,
                                        name: e,
                                    })
                                )
                        }}
                    />
                    <Input
                        label={"Email"}
                        textInputConfig={{
                            error: userAttemptedToSubmit ? true : false,
                            keyboardType:
                                "email-address",
                            autoCapitalize:
                                "none",
                            value: values.email,
                            onChangeText: (e) => {

                                setValues(
                                    (vals) => ({
                                        ...vals,
                                        email: e,
                                    })
                                )
                                setIsValidEmail(validateEmail(e))
                            },
                            style: !isValidEmail && userAttemptedToSubmit ? {
                                backgroundColor: '#f3b6b6',
                                fontSize: 40
                            } : { fontSize: 40 }
                        }}
                    />
                    {/* <Text>test: {String(isValidEmail)}</Text> */}
                    <Button
                        disabled={!isValidEmail && userAttemptedToSubmit}
                        mode='contained'
                        style={styles.button}
                        onPress={() => {
                            setUserAttemptedToSubmit(true)
                            handleSubmit()
                        }}
                    >
                        <Text style={{ fontSize: 30 }}>
                            {submitButtonLabel}
                        </Text>
                    </Button>
                </View>
            </View>
        </>
    );
};
// const mapDispatchToProps = (dispatch) => ({
//     dispatch,
// });

// export default connect(
//     null,
//     mapDispatchToProps
// )(Form);

export default Form;

const styles = StyleSheet.create({
    form: {
        width: 600,
    },
    button: {
        borderRadius: 4,
        marginHorizontal: 4,
        backgroundColor: colors.primary500,
    },
    formContainer: {
        backgroundColor: "#ffffff88",
        padding: 40,
    },

    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    rowInput: {
        flex: 1,
    },
    buttons: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    button: {
        minWidth: 120,
        marginHorizontal: 4,
    },
});
