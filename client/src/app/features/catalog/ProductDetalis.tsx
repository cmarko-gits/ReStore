/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NotFound from "../../error/NotFound";
import LoadingComponent from "../../layout/LoadingComponent";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import { AddBasketItemAsync, removeBasketItemAsync } from "../basket/basketSlice";
import { fetchProductAsync, productSelectors } from "./catalogSlice";

export default function ProductDetalis(){

 
        const {status : productStatus} = useAppSelector(state => state.catalog)
        const { id } = useParams<{ id: string }>();
        const product = useAppSelector(state => productSelectors.selectById(state,parseInt(id!)))
        const { basket , status} =  useAppSelector(state => state.basket);
        const  dispach = useAppDispatch()
        const [quantity, setQuantity] = useState(0);
        const item = basket?.items.find((i) => i.id === product?.id);
    
        // Fetch product details
        useEffect(() => {

            if(item) setQuantity(item.quantity)

            if(!product) dispach(fetchProductAsync(parseInt(id!)))

        }, [id, item , dispach , product]);
    
    
        const handleUpdateCart = () => {
            if (!item || quantity > item.quantity) {
              const updateQuantity = item ? quantity - item.quantity : quantity;
              dispach(AddBasketItemAsync({ productId: product?.id!, quantity: updateQuantity }));
            } else {
              const updateQuantity = item.quantity - quantity;
              dispach(removeBasketItemAsync({ productId: product?.id!, quantity: updateQuantity }));
            }
          };
          
    
    
        const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            if (parseInt(event.currentTarget.value) >= 0) {
            setQuantity(parseInt(event.currentTarget.value)); // Postavljanje vrednosti samo ako je veća od 0
        }
    };
    

    if(productStatus.includes('pending')) return <LoadingComponent message='Loading product ...' />

    if(!product) return  <NotFound/>

    return(
        
        <Grid container spacing={6}  sx={{ mt: 10 }} >
            <Grid item xs={6}>
  {/* Sadržaj */}
                <img src={product.pictureUrl} alt={product.name} style={{width:'100%'}}/>
            </Grid>
            <Grid item xs={6}>
                <Typography variant="h3">{product.name} </Typography>
                <Divider sx={{mb:2}}/>
                <Typography variant="h4">{(product.price/100).toFixed(2)}</Typography>
                <TableContainer>
    <Table>
        <TableBody>
            <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>{product.name}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>{product.description}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>{product.type}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell>Brand</TableCell>
                <TableCell>{product.brand}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell>Quantity in stock</TableCell>
                <TableCell>{product.quantityInStock}</TableCell>
            </TableRow>
        </TableBody>
    </Table>
</TableContainer>

                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField 
                        onChange={handleInputChange}
                                variant="outlined"
                                type="number"
                                label="Quantity In Cart" 
                                fullWidth
                                value={quantity}/>
                    </Grid>
                    <Grid item xs={6}>
                        <LoadingButton disabled={item?.quantity === quantity || !item && quantity === 0} sx={{height:'55px'}} loading={status.includes('pending  ' + product.id)} color="primary" size="large" fullWidth variant="contained" onClick={handleUpdateCart}>
                            {item ? 'Update Quantitty' : 'Add to Cart'}

                        </LoadingButton>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}