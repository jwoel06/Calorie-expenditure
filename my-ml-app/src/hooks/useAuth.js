import {useState, useEffect} from "react";
import {supabase} from '../lib/supabase.js';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        const getInitialSession = async () => {
            const {data : {session} }  = await supabase.auth.getSession();
            setUser(session?.user ?? null)
            setLoading(false)            
        };
        
        getInitialSession();

        const {data : {subscription}} = supabase.auth.onAuthStateChange(
            (event, session) => {
                setUser(session?.user ?? null);
                setLoading(false);
                setError(null);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const signUp = async (email, password) => {
        try {
            setLoading(true);
            setError(null);
            const {data, error} = await supabase.auth.signUp({
                email, password,
            });
            if (error) {
                setError(error.message)
                return {success: false, error: error.message};
            }
            return {success: true, data };
        } 
        catch (err) {
            setError(err.message)
            return {success: false, error: err.message}
        }
        finally {
            setLoading(false)
        }
    };

    const signIn = async (email, password) => {
        try {
          setLoading(true);
          setError(null);
          
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (error) {
            setError(error.message);
            return { success: false, error: error.message };
          }
          
          return { success: true, data };
        } 
        catch (err) {
          setError(err.message);
          return { success: false, error: err.message };
        } 
        finally {
          setLoading(false);
        }
    };

    const signOut = async () => {
        try {
          setLoading(true);
          setError(null);
          
          const { data, error } = await supabase.auth.signOut()
          
          if (error) {
            setError(error.message);
            return { success: false, error: error.message };
          }
          
          return {success: true};
        } 
        catch (err) {
          setError(err.message);
          return { success: false, error: err.message };
        } 
        finally {
          setLoading(false);
        }
    };

    const resetPassword = async (email) => {
        try {
          setLoading(true);
          setError(null);
          
          const { data, error } = await supabase.auth.resetPasswordForEmail(email);
          
          if (error) {
            setError(error.message);
            return { success: false, error: error.message };
          }
          
          return {success: true};
        } 
        catch (err) {
          setError(err.message);
          return { success: false, error: err.message };
        } 
        finally {
          setLoading(false);
        }
    };

    return {
        user,
        loading,
        error,
        signUp,
        signIn,
        signOut,
        resetPassword,
        // Helper values
        isAuthenticated: !!user,
        userEmail: user?.email || null,
    };
};