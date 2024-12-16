import { Remove, Add, Delete } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { TableContainer, Paper, Table, TableHead, TableRow, TableBody, Box, tableCellClasses, TableCell, styled } from "@mui/material";
import { removeBasketItemAsync, AddBasketItemAsync } from "./basketSlice";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import { BasketItem } from "../../model/basket";

interface Props{
    items : BasketItem[], 
    isBasket?: boolean

}

export function BasketTable({items , isBasket=true} : Props){

    const { basket , status } = useAppSelector(state => state.basket);
    const dispatch = useAppDispatch()
  
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
      [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
      },
      [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
      },
    }));
  
    const StyledTableRow = styled(TableRow)(({ theme }) => ({
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
      '&:last-child td, &:last-child th': {
        border: 0,
      },
    }));
  
      if (!basket || basket.items.length === 0){ return <h3>Basket is empty</h3>;}
  
    return (
        <TableContainer component={Paper} sx={{ mt: 10 }}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Product</StyledTableCell>
                <StyledTableCell align="right">Price</StyledTableCell>
                <StyledTableCell align="right">Quantity</StyledTableCell>
                <StyledTableCell align="right">Subtotal</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <StyledTableRow key={item.id}>
                  <StyledTableCell>
                    <Box display="flex" alignItems="center">
                      <img
                        src={item.pictureUrl}
                        alt={item.name}
                        style={{ height: 50, marginRight: 20 }}
                      />
                      {item.name}
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    ${(item.price / 100).toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <Box display="flex" alignItems="center" justifyContent="flex-end">
                        {isBasket &&
                      <LoadingButton
                            loading={status.includes('pendingRemoveItem' +  item.id + 'rem')}
                            onClick={() => dispatch(removeBasketItemAsync({productId : item.id , quantity:1 , name:'rem'}))
                        }
                        color="error"
                      >
                        <Remove />
                      </LoadingButton>}
                      {item.quantity}
                      {isBasket &&
                      <LoadingButton
                            loading={status === 'pendingAddItem' +  item.id}
                            onClick={() =>  dispatch(AddBasketItemAsync({productId:item.id}))
                        }
                        color="secondary"
                      >
                        <Add />
                      </LoadingButton>}
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    ${(item.price * item.quantity / 100).toFixed(2)}
                  </StyledTableCell>
                  {isBasket &&
                  <StyledTableCell align="right">
                    <LoadingButton
                            loading={status === 'pendingRemoveItemdItem' +  item.id + 'del'}
                            onClick={() =>  dispatch(removeBasketItemAsync({productId:item.id,quantity:item.quantity,name:'del'}))
                      }
                      color="error"
                    >
                      <Delete />
                    </LoadingButton>
                  </StyledTableCell>}
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
    )
}