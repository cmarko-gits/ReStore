import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { User } from "./user";
import { FieldValues } from "react-hook-form";
import agent from "../api/agent";
import { router } from "../router/Routes";
import { toast } from "react-toastify";
import { setBasket } from "../features/basket/basketSlice";

interface AccountState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  error: string | null;
}

const initialState: AccountState = {
  user: null,
  token: null,
  refreshToken: null,
  error: null,
};

// Login korisnika - vraća user, token i refreshToken
export const signInUser = createAsyncThunk<
  { user: User; token: string; refreshToken: string },
  FieldValues
>(
  "account/signInUser",
  async (data, thunkApi) => {
    try {
      const userDto = await agent.Account.login(data);
      const { basket, token, refreshToken, ...user } = userDto;

      if (basket) thunkApi.dispatch(setBasket(basket));

      localStorage.setItem(
        "userData",
        JSON.stringify({ user, token, refreshToken })
      );

      return { user, token, refreshToken };
    } catch (error: any) {
      return thunkApi.rejectWithValue(error?.response?.data || "Login failed");
    }
  }
);

// Fetch trenutnog korisnika koristeći token iz localStorage
export const fetchCurrentUser = createAsyncThunk<
  { user: User; token: string; refreshToken: string },
  void,
  { rejectValue: string }
>(
  "account/fetchCurrentUser",
  async (_, thunkApi) => {
    try {
      const userDto = await agent.Account.currentUser();
      const { basket, token, refreshToken, ...user } = userDto;

      if (basket) thunkApi.dispatch(setBasket(basket));

      localStorage.setItem(
        "userData",
        JSON.stringify({ user, token, refreshToken })
      );

      return { user, token, refreshToken };
    } catch (error: any) {
      return thunkApi.rejectWithValue(error?.response?.data || "Session expired");
    }
  },
  {
    condition: () => {
      return !!localStorage.getItem("userData");
    },
  }
);

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    signOut: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.error = null;
      localStorage.removeItem("userData");
      router.navigate("/");
    },
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCurrentUser.rejected, (state, action) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.error = action.payload || "Session expired - please login again";
      localStorage.removeItem("userData");
      toast.error(state.error);
      router.navigate("/");
    });

    builder.addMatcher(
      isAnyOf(signInUser.fulfilled, fetchCurrentUser.fulfilled),
      (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.error = null;
      }
    );

    builder.addMatcher(
      isAnyOf(signInUser.rejected, fetchCurrentUser.rejected),
      (state, action) => {
        state.error = action.payload || "Authentication failed";
        toast.error(state.error);
      }
    );
  },
});

export const { signOut, setUser } = accountSlice.actions;

export default accountSlice.reducer;
