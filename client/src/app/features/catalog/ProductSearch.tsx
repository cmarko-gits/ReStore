import { debounce, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import { setProductParamas } from "./catalogSlice";
import { useState } from "react";

export default function ProductSearch(){

    const {productParams} = useAppSelector(state => state.catalog)
    const [searchTerm ,setsearchTerm] = useState(productParams.searchTerm)
    const dispatch = useAppDispatch()

    const debouncedSearch = debounce((event:any)=>{
        dispatch(setProductParamas({searchTerm : event.target.value}))
    },1000)

    return(
        <TextField
        label="Search products"
        variant="outlined"
        fullWidth
        sx={{ mb: 3 }}
        value={searchTerm || ''}
        onChange={(event : any) =>{
            setsearchTerm(event.target.value)
            debouncedSearch(event)
        }}
    />
    )
}