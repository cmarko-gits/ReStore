import { createAsyncThunk, createEntityAdapter, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product, ProductParams } from "../../model/product";
import agent from "../../api/agent";
import { RootState } from "../../store/configureStore";
import { MetaData } from "../../model/pagination";
const productsAdapter = createEntityAdapter<Product>();

interface CatalogState {
    productsLoaded : boolean;
    filtersLoaded : boolean; 
    status : string ;
    brands : string[];
    types : string[];
    productParams : ProductParams;
    metaData : MetaData | null
}

function getAxiosParams(productParams : ProductParams){
    const params =  new URLSearchParams()

    params.append("pageNumber" , productParams.pageNumber.toString())
    params.append("pageSize" , productParams.pageSize.toString())
    params.append("orderBy" , productParams.orderBy.toString())

    if(productParams.searchTerm) params.append('searchTerm' , productParams.searchTerm)

    if(productParams.brands.length > 0) params.append('brands' , productParams.brands.toString())

    if(productParams.types.length >0) params.append('types' , productParams.types.toString())

    return params;
}

export const fetchProductsAsync = createAsyncThunk<Product[], void, { state: RootState }>(
    "catalog/fetchProductsAsync",
    async (_, thunkAPI) => {
        const params = getAxiosParams(thunkAPI.getState().catalog.productParams);

        try {
            const response = await agent.Catalog.list(params);
            console.log("Fetched Response:", response); // Log entire response to check for metaData

                    console.log("MetaData:", response.metaData); // Log metaData separately
                thunkAPI.dispatch(setMetaData(response.metaData)); // Dispatch setMetaData with metaData
           

            return response.items; // Ensure response.items contains product data
        } catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    }
);

 
export const fetchFilters = createAsyncThunk(
    'catalog/fetchFilters',
    async (_, thunkApi) => {
        try {
            return await agent.Catalog.fetchFilters(); // Dodato return
        } catch (error: any) {
            return thunkApi.rejectWithValue({ error: error.data });
        }
    }
);

function initParamas(){
    return{
        pageNumber : 1 ,
        pageSize : 6, 
        orderBy : 'name',
        brands : [],
        types : []
    }
}

export const fetchProductAsync = createAsyncThunk<Product, number>(
    "catalog/fetchProductAsync",
    async (productId: number , thunkAPI) => {
      try {
        const product = await agent.Catalog.details(productId);
        return product;
      } catch (error : any) {
        throw thunkAPI.rejectWithValue({error : error.data})
      }
    }
  );
  
export const catalogSlice = createSlice({
    name : 'catalog' , 
    initialState : productsAdapter.getInitialState<CatalogState>({
        productsLoaded : false,
        filtersLoaded : false,
        status : 'idle',
        brands : [] ,
        types : [],
        productParams : initParamas(),
        metaData : null
    }),
    reducers :{
     

        
        setProductParamas:(state , action)=>{
            state.productsLoaded = false
            state.productParams = {...state.productParams, ...action.payload , pageNumber:1}
        },

        setPageNumber : (state , action) =>{
            state.productsLoaded = false
            state.productParams = {...state.productParams, ...action.payload }
        },
        setMetaData: (state, action: PayloadAction<any>) => {
            state.metaData = action.payload; // Store the metaData in state
        },  
        resetProductParams : (state) =>{
            state.productParams = initParamas()
        }
    },

    extraReducers : (builder => {
        builder.addCase(fetchProductsAsync.pending, (state) =>{
            state.status = 'pendingFetchProducts'
        })

        builder.addCase(fetchProductsAsync.fulfilled , (state , action)=>{
                productsAdapter.setAll(state , action.payload)
                state.status = 'idle'
                state.productsLoaded = true
        })

        builder.addCase(fetchProductsAsync.rejected , (state,action)=>{
            console.log(action)
            state.status = 'idle'
        })

        builder.addCase(fetchProductAsync.pending , (state)=>{
            state.status = 'pendingFetchProduct'
        })

        builder.addCase(fetchProductAsync.fulfilled , (state,action)=>{
            productsAdapter.upsertOne(state,action.payload)
            state.status = 'idle'
        })


        builder.addCase(fetchProductAsync.rejected, (state, action) => {
            state.status = "idle";
            console.log(action)
          });
          
        builder.addCase(fetchFilters.pending , (state)=>{
            state.status = 'pendingFetchFilters'
        })

        builder.addCase(fetchFilters.fulfilled, (state, action) => {
            if (action.payload) { // Proverava da li payload postoji
                state.brands = action.payload.brands
                state.types = action.payload.types 
                state.filtersLoaded = true;
            } else {
                console.error("Action payload is undefined");
            }
        });
        

        builder.addCase(fetchFilters.rejected , (state , action)=>{
            state.status = 'idle';
            console.log(action.payload)
        })
    })

})

export const productSelectors = productsAdapter.getSelectors((state : RootState) => state.catalog)
export const{setProductParamas , resetProductParams , setMetaData , setPageNumber} = catalogSlice.actions;