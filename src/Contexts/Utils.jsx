import React, { createContext, useContext, useState } from "react";

const UtilsContext = createContext({});

export const UtilsProvider = ({ children }) => {
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(0); // 0 = error, 1 = warning, 2 = success
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState();

    function showNotification(message, alertType){
        clearTimeout(timer);
        setMessage(message);
        setMessageType(alertType);
        setTimer(setTimeout(() => {
            setMessage('');
        }, 5000));
    }

    function closeNotification(){
        clearTimeout(timer);
        setMessage('');
    }

    return (
        <UtilsContext.Provider value={{
            message,
            showNotification,
            closeNotification,
            messageType,
            setLoading,
            loading
        }}>
            { children }
        </UtilsContext.Provider>
    );
};

export function useUtils(){
    const context = useContext(UtilsContext);
    return context;
}