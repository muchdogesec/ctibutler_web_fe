import React, { createContext, useState } from 'react';
import { ITeam } from '../services/types';

export const TeamContext = createContext<{
    activeTeam?: ITeam, setActiveTeam: (team?: ITeam) => void,
    reloadTeamListIndex: number, setReloadTeamListIndex: (index: number) => void
}>({
    activeTeam: undefined,
    setActiveTeam: (team?: ITeam) => null,
    reloadTeamListIndex: 0,
    setReloadTeamListIndex: (index: number) => null,
});

export const TeamProvider = ({ children }) => {
    const [activeTeam, setActiveTeam] = useState<ITeam>();
    const [reloadTeamListIndex, setReloadTeamListIndex] = useState(0)

    return (
        <TeamContext.Provider value={{ activeTeam, setActiveTeam, reloadTeamListIndex, setReloadTeamListIndex }}>
            {children}
        </TeamContext.Provider>
    );
};
