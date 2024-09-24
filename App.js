import { StatusBar } from "expo-status-bar";
import {
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import Input from "./components/Forms/components/Input";

import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    Image,
    Keyboard,
    ScrollView,
    BackHandler,
    Linking,
    Alert,
    DrawerLayoutAndroid
} from "react-native";

import {
    Provider,
    useDispatch,
    useSelector,
} from "react-redux";
import { store } from "./store/store";
import {
    NavigationContainer,
    useNavigation,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { createDrawerNavigator } from '@react-navigation/drawer'
import { Ionicons } from "@expo/vector-icons";
import IconButton from "./components/Forms/components/IconButton";
// import ManageBackground from "./screens/ManageBackground";
import SubscriptionQueue from "./screens/SubscriptionQueue";
import {
    setClearQueue,
    setPasswordApprove,
    setQueue,
    setSendEmails,
    setEventName
} from "./store/subscriptionQueue";
// import { setShowSettings } from "./store/app";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Dropdown } from "react-native-element-dropdown";
import { submitQueueAndClear } from "./store/subscriptionQueue";
import Form from "./components/Forms/Form";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import { ActivityIndicator } from "react-native-paper";
// import RNFS from 'react-native-fs'

function NavigationStacks() {
    const dispatch = useDispatch();
    const Stack = createNativeStackNavigator();
    const [showHeader, setShowHeader] =
        useState(true);
    const drawer = useRef(null);

    const [value, setValue] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isFocus, setIsFocus] = useState(false);
    const { queue, eventName } = useSelector(
        (state) => state.subscriptionQueue
    );

    const [
        clicked,
        setClicked,
    ] = useState(false);
    const {
        sendEmails,
        passwordApproval,
        clearQueue,
    } = useSelector(
        (state) =>
            state.subscriptionQueue
    );

    useEffect(() => {

        console.log({ eventName })
    }, [eventName])

    BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
            setFeedback('')
        })

    // const Drawer = createDrawerNavigator()

    const handleOpenWebsite = async () => {
        await Linking.openURL(
            "https://www.bethowenwatercolors.com/"
        );
    };

    useEffect(() => {
        AsyncStorage.getItem("SubscriptionQueue")
            .then((res) => {
                dispatch(
                    setQueue(JSON.parse(res))
                );
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);


    function sendEmailsAction() {
        console.log("sendEmailsAction", { eventName })
        if (!eventName) {
            // show warning
            setFeedback("Submission requires an event tag")
        }

        if (queue.length && eventName) {
            // If the user click submit emails
            setIsSubmitting(true)

            // get a the event name (the mailchimp tag)
            console.log({ eventName })

            //  Call a firebase function
            // Add emails to mail chimp
            fetch("https://us-central1-bethowenwatercolors.cloudfunctions.net/mailchimp-gfc-2", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    eventName: eventName,
                    queue
                })
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    // report success
                    setFeedback(`Success\nAdded: ${data.mailchimpResponse.new_members_count}\nUpdated: ${data.mailchimpResponse.updated_member_count}`)
                    setIsSubmitting(false)
                })
                .catch(err => {
                    console.log("error: ", err)
                    // report error
                    setFeedback("Something went wrong")
                    setIsSubmitting(false)
                })
        }

    }


    return (
        <>
            <DrawerLayoutAndroid
                ref={drawer}
                drawerWidth={300}
                drawerPosition='right'
                renderNavigationView={() => {

                    if (isSubmitting) {
                        return (
                            <View
                                style={[styles.drawer]}>
                                <View style={{
                                    marginTop: 50
                                }}>

                                    <ActivityIndicator></ActivityIndicator>
                                </View>
                            </View>
                        )
                    }

                    return (
                        <View
                            style={[styles.drawer]}>
                            <View style={[styles.drawerTop]}>

                                <View>
                                    <IconButton
                                        icon='add'
                                        label='Submit Queue'
                                        onPress={() => {
                                            dispatch(
                                                submitQueueAndClear()
                                            );
                                            setClicked(
                                                true
                                            );

                                            dispatch(
                                                setSendEmails(
                                                    true
                                                )
                                            );
                                            sendEmailsAction()
                                        }}
                                    />
                                </View>

                                <View
                                    style={[styles.row]}>

                                    <Input
                                        label={"Event Tag"}
                                        textInputConfig={{
                                            style: {
                                                width: 220
                                            },
                                            value: eventName,
                                            onChangeText: (e) => {
                                                // console.log("event tag changed", e)
                                                dispatch(setEventName(e))
                                            }
                                        }}></Input>
                                    <IconButton
                                        style={{
                                            width: 10,

                                        }}
                                        icon='close'
                                        onPress={() => {
                                            setClicked(false)
                                            dispatch(setEventName(""))
                                        }}
                                    />
                                </View>

                                {feedback && (
                                    <View
                                        style={[styles.row]}>
                                        <Text
                                            style={{
                                                width: 230
                                            }}
                                        >
                                            {feedback}
                                        </Text>

                                        <IconButton
                                            icon='close'
                                            onPress={() => {
                                                setFeedback("")
                                            }}
                                        />
                                    </View>
                                )}

                                <View style={[styles.horizontalLine, {
                                    marginVertical: 50
                                }]}></View>

                                <View
                                    style={{
                                        backgroundColor: 'grey',
                                        borderWidth: 1,
                                        borderRadius: 5,
                                    }}>

                                    <IconButton
                                        icon=''
                                        label="Select Random"
                                        onPress={() => {
                                            const num = Math.floor(Math.random() * queue.length)
                                            const randomPerson = queue[num]
                                            Alert.alert(`Random Selection: #${num + 1}`,
                                                `${randomPerson.name}\n${randomPerson.email}`
                                            )
                                        }}
                                    />
                                </View>
                            </View>

                            <View
                                style={[styles.drawerBottom]}
                            >


                                <IconButton
                                    icon=''
                                    label='Clear Queue'
                                    onPress={() => {
                                        if (
                                            passwordApproval
                                        ) {
                                            console.log(
                                                "pass word approved"
                                            );

                                            dispatch(
                                                setPasswordApprove(
                                                    false
                                                )
                                            );

                                        }
                                        dispatch(
                                            setClearQueue(
                                                !clearQueue
                                            )
                                        );
                                        drawer.current.closeDrawer()
                                    }}
                                />
                            </View>
                        </View>
                    )
                }}
            >
                <NavigationContainer>
                    <Stack.Navigator>
                        <Stack.Screen
                            name='home'
                            component={MainScreen}
                            options={{
                                headerShown: showHeader,
                                headerTitle: () => {
                                    const navigation =
                                        useNavigation();
                                    // const [
                                    //     drawerOpen,
                                    //     setDrawerOpen,
                                    // ] = useState(false);
                                    return (
                                        <>
                                            <ScrollView
                                                horizontal={
                                                    true
                                                }
                                                style={
                                                    styles.reset
                                                }
                                            >
                                                <View
                                                    style={[
                                                        styles.scroll,
                                                        styles.reset,
                                                    ]}
                                                >
                                                    {/* <View
                                                style={
                                                    styles.headerButton
                                                }
                                            >
                                                <IconButton
                                                    icon='image-outline'
                                                    label='Manage Background'
                                                    onPress={() =>
                                                        navigation.navigate(
                                                            "ManageBackground"
                                                        )
                                                    }
                                                />
                                            </View> */}
                                                    <View
                                                        style={
                                                            styles.headerButton
                                                        }
                                                    >
                                                        <IconButton
                                                            icon='rose-outline'
                                                            label='My website'
                                                            onPress={
                                                                handleOpenWebsite
                                                            }
                                                        />
                                                    </View>
                                                    <View
                                                        style={
                                                            styles.headerButton
                                                        }
                                                    >
                                                        <IconButton
                                                            icon='cloud-upload-outline'
                                                            label='Subscription Queue'
                                                            onPress={() =>
                                                                navigation.navigate(
                                                                    "SubscriptionQueue"
                                                                )
                                                            }
                                                        />
                                                    </View>
                                                    <View
                                                        style={
                                                            styles.headerButton
                                                        }
                                                    >
                                                        <IconButton
                                                            icon='remove-circle-outline'
                                                            label='Hide header'
                                                            onPress={() =>
                                                                setShowHeader(
                                                                    !showHeader
                                                                )
                                                            }
                                                        />
                                                    </View>
                                                    {/* <View
                                                style={[
                                                    styles.headerButton,
                                                    styles.dropdown,
                                                ]}
                                            >
                                                <IconButton
                                                    icon='remove-circle-outline'
                                                    label='Settings'
                                                    onPress={() =>
                                                        dispatch(
                                                            setShowSettings()
                                                        )
                                                    }
                                                />
                                            </View> */}
                                                </View>
                                            </ScrollView>
                                        </>
                                    );
                                },
                            }}
                        />

                        {/* <Stack.Screen
                    name='ManageBackground'
                    component={ManageBackground}
                    options={{
                        headerLeft: () => <></>,
                        headerTitle:
                            "Backgrounds",
                    }}
                /> */}
                        <Stack.Screen
                            name='SubscriptionQueue'
                            component={SubscriptionQueue}
                            options={{
                                headerLeft: () => <></>,
                                headerTitle:
                                    "Subscription Queue",
                                headerRight: () => {
                                    const [
                                        clicked,
                                        setClicked,
                                    ] = useState(false);
                                    const {
                                        sendEmails,
                                        passwordApproval,
                                        clearQueue,
                                        queue,
                                    } = useSelector(
                                        (state) =>
                                            state.subscriptionQueue
                                    );

                                    if (!queue.length) {
                                        return (
                                            <Text>
                                                Empty List
                                            </Text>
                                        );
                                    }

                                    if (isSubmitting) {
                                        return (
                                            <ActivityIndicator></ActivityIndicator>
                                        )
                                    }

                                    return (
                                        <View>
                                            <View
                                                style={{
                                                    flexDirection: 'row'
                                                }}>

                                                <IconButton
                                                    icon="menu-outline"
                                                    onPress={() => {
                                                        drawer.current.openDrawer()
                                                    }}
                                                />



                                            </View>




                                        </View>
                                    );


                                },
                            }}
                        />
                        {/* <Stack.Screen name='DrawerNav' component={DrawerNavigation} /> */}
                    </Stack.Navigator>
                </NavigationContainer>


            </DrawerLayoutAndroid>
        </>
    );
}

// function ManageQueue(){

//     return
// }



export default function App() {
    return (
        <Provider store={store}>
            <NavigationStacks />
        </Provider>
    );
}
const styles = StyleSheet.create({
    horizontalLine: {
        height: 1,
        backgroundColor: 'gray',
        marginVertical: 10,

    },
    drawer: {
        padding: 10,
        height: 920,
        // justifyContent: 'center',
        // backgroundColor: 'blue'
    },
    drawerTop: {},
    drawerBottom: {
        marginTop: 'auto'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    headerButton: {
        flexDirection: "row",
        alignItems: "center",
    },
    show: {
        flexDirection: "column",
        // alignItems: 'center'
        // justifyContent: 'center'
    },
    hide: {
        display: 'none'
    },
    showText: {
        position: "absolute",
        bottom: 3,
        // left: 25,
        opacity: 0.5,
        fontSize: 10,
    },
    dropdown: {
        width: 250,
    },
    scroll: {
        flexDirection: "row",
    },
    reset: {
        margin: 0,
        padding: 0,
        transform: [{ translateX: -16 }],
    },
});

const MainScreen = () => {
    const [keyboardStatus, setKeyboardStatus] =
        useState(undefined);
    // const dispatch = useDispatch();

    useLayoutEffect(() => {
        const showSubscription =
            Keyboard.addListener(
                "keyboardDidShow",
                () => {
                    setKeyboardStatus(
                        "Keyboard Shown"
                    );
                }
            );
        const hideSubscription =
            Keyboard.addListener(
                "keyboardDidHide",
                () => {
                    setKeyboardStatus(
                        "Keyboard Hidden"
                    );
                }
            );

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: "#fff",
            // alignItems: 'center',
        },
        bethOwen: {
            // resizeMode: 'contain'
            width: 500,
        },
        header: {
            transform: [
                {
                    translateY:
                        keyboardStatus ==
                            "Keyboard Shown"
                            ? 0
                            : -50,
                },
            ],
        },
        logo: {
            fontSize: 30,
            fontWeight: "bold",
            fontFamily: "sans-serif",
            textAlign: "center",
        },
        title: {
            fontSize: 40,
            fontWeight: "bold",
            // color: 'white',
            marginBottom: 60,
            textAlign: "center",
        },
        img: {
            // width: '100%'
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
        },
    });

    // const [showSetting, setShowSetting] =
    //     useState(false);

    // const { showSettings } = useSelector(
    //     (state) => state.app
    // );

    const handlePress = () => {
        // dispatch(setShowSettings());
    };

    // useEffect(() => {
    //     dispatch(setSendEmails(false));
    // }, []);

    return (
        <>
            <View style={styles.container}>
                <StatusBar style='auto' />

                <ImageBackground
                    source={require("./assets/CafeAuLait-min.jpg")}
                    resizeMode='cover'
                    style={styles.img}
                >
                    {/* <Pressable onPress={(e) => console.log("\n\n\n\n", e)}> */}
                    <View style={styles.header}>
                        <Image
                            source={require("./assets/mom-sig.png")}
                            style={
                                styles.bethOwen
                            }
                            resizeMode='center'
                        />
                        <Text
                            style={styles.title}
                        >
                            Newsletter Signup
                        </Text>
                    </View>
                    {/* </Pressable> */}
                    <Form
                        submitButtonLabel={
                            "SUBMIT"
                        }
                    />
                </ImageBackground>

            </View>
        </>
    );
};

// const styles = StyleSheet.create({})
