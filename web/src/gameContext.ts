import React from "react";

export interface IGameContextProps {
    isInRoom: boolean;
    setInRoom: (inRoom: boolean) => void;
    ipAddr: string;
};

const defaultState: IGameContextProps = {
    isInRoom: false,
    setInRoom: () => {},
    ipAddr: ""
};

export default React.createContext(defaultState);