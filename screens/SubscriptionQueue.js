import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Alert,
    BackHandler,
    ActivityIndicator,
} from "react-native";
import {
    setClearQueue,
    setEventName,
    setPasswordApprove,
    setQueue,
    setSendEmails,
} from "../store/subscriptionQueue";
import {
    useDispatch,
    useSelector,
} from "react-redux";
import React, {
    useEffect,
    useState,
} from "react";
import { Ionicons } from "@expo/vector-icons";
import { sendEmail } from "../utils/email";
// import axios from "axios";
import Input from "../components/Forms/components/Input";
import Button from "../components/Forms/components/Button";
import Constants from "expo-constants";
import { md5 } from 'js-md5'
import IconButton from "../components/Forms/components/IconButton";


const SubscriptionQueue = () => {
    const clearCode =
        Constants.expoConfig.extra.clearCode;
    const { queue, sendEmails, eventName, clearQueue, passwordApproval } = useSelector(
        (state) => state.subscriptionQueue
    );


    const dispatch = useDispatch();
    const [passwordEntry, setPasswordEntry] =
        useState(null);


    BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
            dispatch(setClearQueue(false));
            dispatch(setSendEmails(false));
            dispatch(setEventName(""))

        }
    );

    // if (passwordApproval) {
    //     return (
    //         <View
    //             style={[
    //                 styles.screen,
    //                 styles.prompt,
    //             ]}
    //         >
    //             <Text>
    //                 Click "Clear Queue" again
    //             </Text>
    //         </View>
    //     );
    // }

    if (clearQueue) {
        return (
            <>
                <View
                    style={{
                        alignItems: 'flex-start'
                    }}>
                    <IconButton
                        icon="arrow-back-outline"
                        label="Go Back"
                        onPress={() => {
                            dispatch(
                                setClearQueue(
                                    !clearQueue
                                )
                            );
                        }}
                    ></IconButton>
                </View>
                <View
                    style={[
                        styles.screen,
                        styles.prompt,
                    ]}
                >

                    <View style={styles.prompt}>
                        <Input
                            label='Password'
                            style={styles.input}
                            textInputConfig={{
                                type: "password",
                                onChangeText: (e) => {
                                    setPasswordEntry(
                                        e
                                    );
                                },
                            }}
                        />
                        <Button
                            android_ripple={{
                                color: "blue",
                            }}
                            style={styles.input}
                            onPress={() => {
                                if (
                                    passwordEntry ==
                                    clearCode
                                ) {
                                    dispatch(
                                        setPasswordApprove(
                                            true
                                        )
                                    );
                                    dispatch(
                                        setQueue([])
                                    )
                                }
                            }}
                        >
                            Submit
                        </Button>
                    </View>
                </View>
            </>

        );
    }

    return (
        <ScrollView
            style={styles.screen}
            contentContainerStyle={
                styles.innerScreen
            }
        >
            {queue.map((el, i) => {
                return (
                    <Card
                        sendEmails={sendEmails}
                        info={el}
                        key={el.email}
                        isOdd={i % 2 !== 0}
                    />
                );
            })}
        </ScrollView>
    );
};

function Card({ info, isOdd, sendEmails }) {
    // console.log(sendEmails);

    // console.log("ALERT", info);
    // const [isUploading, setIsUploading] = useState(false)

    return (
        <View
            style={[
                styles.card,
                isOdd && styles.oddCard,
            ]}
        >
            <View style={styles.spinner}>
                {info.status == "pending" &&
                    sendEmails && (
                        <Ionicons
                            name='paper-plane'
                            size={30}
                        />
                    )}
            </View>
            <View>
                <Text>{info.name}</Text>
                <Text>{info.email}</Text>
            </View>
        </View>
    );
}

export default SubscriptionQueue;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    prompt: {
        // flex: 1,
        height: 100,
        justifyContent: "center",
        alignItems: "center",
    },
    input: {
        width: 300,
    },
    innerScreen: {
        justifyContent: "center",
        alignItems: "center",
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: 40,
        paddingVertical: 10,
    },
    oddCard: {
        backgroundColor: "#f5e0e0",
    },
    spinner: {
        marginRight: 40,
    },
});
