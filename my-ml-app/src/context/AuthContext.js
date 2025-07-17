import React, { createContext, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';

import { supabase } from '../lib/supabase.js';

const AuthContext = createContext(null);

export const AuthContextProvider = ({children}) => {
    const auth = useAuth();
    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
};
    export const useAuthContext = () => {
        const context = useContext(AuthContext)
        if (!context) {
            throw new Error('Context not properly used')
        }
        return context;
    };

export {AuthContext};

