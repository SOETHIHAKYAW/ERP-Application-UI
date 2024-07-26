import React, { createContext, useState } from 'react';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [data, setData] = useState({});

    const setDataByKey = (key, value) => {
        setData(prevData => ({ ...prevData, [key]: value }));
    };

    return (
        <DataContext.Provider value={{ data, setDataByKey }}>
            {children}
        </DataContext.Provider>
    );
};
