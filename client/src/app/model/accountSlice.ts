import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { User } from "./user";
import { FieldValues } from "react-hook-form";
import agent from "../api/agent";
import { router } from "../router/Routes";
import { toast } from "react-toastify";
import { setBasket } from "../features/basket/basketSlice";
;

interface AccountState {
    user : User | null
}

export const signInUser = createAsyncThunk<User, FieldValues>(
    'account/signInUser',
    async (data, thunkApi) => {
      try {
        const userDto = await agent.Account.login(data);
        const {basket , ...user} = userDto;

        if(basket) thunkApi.dispatch(setBasket(basket))

        localStorage.setItem('user', JSON.stringify(user)); // Sačuvaj korisnika kao JSON string
        return user;
      } catch (error: any) {
        return thunkApi.rejectWithValue({ error: error.data });
      }
    }
  );
  

export const fetchCurrentUser = createAsyncThunk<User>(
    'account/fetchCurrentUser', // Promeni naziv akcije za fetchCurrentUser
    
    async (_, thunkApi) => {

        thunkApi.dispatch(setUser(JSON.parse(localStorage.getItem('user')!)))

        try {
            const userDto = await agent.Account.currentUser();

            const {basket , ...user} = userDto;

            if(basket) thunkApi.dispatch(setBasket(basket))
            localStorage.setItem('user', JSON.stringify(user)); // Sačuvaj korisnika kao JSON string
            return user;
        } catch (error: any) {
            return thunkApi.rejectWithValue({ error: error.data });
        }
    },{
        condition : () => {
            if(!localStorage.getItem('user'))return false;
        }
    }
);


const initialState : AccountState = {
    user : null
}

export const accountSlice = createSlice({
    name : 'account',
    initialState,
    reducers : {
        signOut : (state) =>{
            state.user = null
            localStorage.removeItem('user')
            router.navigate('/')
        },
        setUser : (state , action) =>{
            state.user = action.payload
        }
    },
    extraReducers: (builder) => {

        builder.addCase(fetchCurrentUser.rejected , (state)=>{
            state.user = null 
            localStorage.removeItem('user')
            toast.error('Session expired - please login again')
            router.navigate('/')
        })


        builder.addMatcher(
            isAnyOf(signInUser.fulfilled, fetchCurrentUser.fulfilled),
            (state, action) => {
                state.user = action.payload;
            }
        );
    
    
        builder.addMatcher(
            isAnyOf(signInUser.rejected, fetchCurrentUser.rejected),
            (state , action) => {

                throw action.payload
            }
        );
    }
})

export const {signOut,setUser} = accountSlice.actions;