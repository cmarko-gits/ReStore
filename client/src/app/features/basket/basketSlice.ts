import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { Basket } from "../../model/basket";
import agent from "../../api/agent";
import { getCookie } from "../../util/util";


interface BasketState {
    basket: Basket | null;
    status : string;
}

const initialState: BasketState = {
    basket: null,
    status : 'idle  '
};

export const fetchBasketAsync = createAsyncThunk<Basket>(
    'basket/fetchBasketAsync' , async (_ , thunkAPI) =>{
        try{
            return agent.Basket.get()
        }
        catch(error:any){
            return thunkAPI.rejectWithValue({error:error.data})
        }
    }, {
        condition : () => {
            if (!getCookie('buyerId')) return false;
        }
    }
)

export const AddBasketItemAsync = createAsyncThunk<
    Basket, // Return type of the async function
    { productId: number; quantity? : number }>(
    'basket/addBasketItemAsync',
    async ({ productId, quantity=1 }, thunkAPI) => {
        try {
            const response = await agent.Basket.addItem(productId, quantity);
            return response; // Ensure response matches the Basket type
        } catch (error:any) {
            console.error(error);
            return thunkAPI.rejectWithValue({error : error.data});
        }
    }
);

export const removeBasketItemAsync = createAsyncThunk<void , {productId : number,quantity:number , name?:string}>(
    'basket/removeBasketItemAsync' ,
    async ({productId, quantity } , thunkAPI) =>{
        try{
            return await agent.Basket.removeItem(productId, quantity)
        }catch(error : any){
            return thunkAPI.rejectWithValue({error:error.data})
        }
    }
)

export const basketSlice = createSlice({
    name: 'basket',
    initialState,
    reducers: {
        setBasket: (state, action) => {
            state.basket = action.payload;
        },

        clearBasket : (state) =>{
            state.basket = null
        }
    },

    extraReducers : (builder => {
            builder.addCase(AddBasketItemAsync.pending , (state , action) => {
                console.log(action)
                state.status = 'pendingAddItem' + action.meta.arg.productId
            });

        

            builder.addCase(removeBasketItemAsync.pending, (state,action) =>{
                 state.status = 'pendingRemoveItem' + action.meta.arg.productId + action.meta.arg.name
            })

            builder.addCase(removeBasketItemAsync.fulfilled , (state,action) =>{
                const {productId , quantity} = action.meta.arg

                const itemIndex = state?.basket!.items.findIndex(i => i.id === productId)
                if(itemIndex === -1 || itemIndex === undefined) return;
    
                state.basket!.items[itemIndex].quantity -= quantity
    
                if(state.basket?.items[itemIndex].quantity === 0 )
                    state.basket?.items.splice(itemIndex,1)    
                
                state.status = 'idle'
             })

             builder.addCase(removeBasketItemAsync.rejected , (state,action)=>{
                    console.log(action.payload)
                    state.status = 'idle'
             })

            builder.addMatcher(isAnyOf(AddBasketItemAsync.fulfilled ,fetchBasketAsync.fulfilled),(state , action) =>{
                state.basket = action.payload
                state.status = 'idle'
            } )
            
            builder.addMatcher(isAnyOf(AddBasketItemAsync.rejected , fetchBasketAsync.rejected), (state , action)=>{
                state.status = 'idle'
                console.log(action.payload)
            })
        }
    )
});

export const { setBasket , clearBasket } = basketSlice.actions;
export default basketSlice.reducer;
