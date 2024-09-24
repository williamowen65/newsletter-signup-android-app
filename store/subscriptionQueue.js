import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

class Enum {
    constructor(...args) {
        for (
            let i = 0;
            i < args.length - 1;
            i++
        ) {
            const arg = args[i];
            this[arg] = arg;
        }
    }
}
const STATUS = new Enum(
    "queued",
    "pending",
    "success"
);
export class Subscriber {
    constructor(name, email, show) {
        this.name = name;
        this.email = email;

        this.status = STATUS.queued;
    }
}

// STATUS.create("TEST")

// console.log(STATUS.TEST);

export class Card extends Subscriber {
    constructor(name, email, show) {
        super(name, email, show);

        this.status = STATUS.waiting; /// or true? or function?
        // console.log(this);
    }
}

const subscriptionQueueSlice = createSlice({
    name: "subscriptionQueue",
    initialState: {
        clearQueue: false,
        passwordApproval: false,
        queue: [],
        cards: [],
        sendEmails: false,
    },
    reducers: {
        addToQueue: (state, action) => {
            state.queue.push(action.payload);

            // console.log('hi: ', action.payload);
            // AsyncStorage.setItem("queue", state.queue)
        },
        setQueue: (state, action) => {
            if (action.payload.length === 0) {
                // console.log("CLEARING");
                AsyncStorage.clear();
            }
            state.queue = action.payload;
            state.clearQueue = false;

            // console.log(
            //     "setting queue",
            //     action.payload
            // );
            // state.cards = action.payload.map((e) => new Card(...e))
        },
        setPasswordApprove: (state, action) => {
            state.passwordApproval =
                action.payload;
        },
        submitQueueAndClear: (state, action) => {
            // console.log("QUEUE", state.queue);

            state.queue.forEach(
                (el) => (el.status = "pending")
            );
        },
        setClearQueue: (state, action) => {
            // alert(`setqueue ${action.payload}`);
            state.clearQueue = action.payload;
        },
        setSendEmails: (state, action) => {
            state.sendEmails = action.payload;
        },
        setEventName: (state, action) => {
            // console.log('setEventName')
            state.eventName = action.payload
        },
        updateQueue: (state, action) => {
            if (action.payload) {
                // console.log(
                //     "payload from updateQueue",
                //     action.payload,
                //     typeof action.payload
                // );
                state.queue = state.queue.map(
                    (el) => {
                        if (
                            el.email ==
                            action.payload
                                .subscriber.email
                        ) {
                            el.status =
                                "complete";
                        }
                        return el;
                    }
                );
            }
        },
    },
});

export const setPasswordApprove =
    subscriptionQueueSlice.actions
        .setPasswordApprove;
export const setClearQueue =
    subscriptionQueueSlice.actions.setClearQueue;
export const setSendEmails =
    subscriptionQueueSlice.actions.setSendEmails;
export const setEventName =
    subscriptionQueueSlice.actions.setEventName;
export const updateQueue =
    subscriptionQueueSlice.actions.updateQueue;
export const addToQueue =
    subscriptionQueueSlice.actions.addToQueue;
export const setQueue =
    subscriptionQueueSlice.actions.setQueue;
export const submitQueueAndClear =
    subscriptionQueueSlice.actions
        .submitQueueAndClear;
export default subscriptionQueueSlice.reducer;
