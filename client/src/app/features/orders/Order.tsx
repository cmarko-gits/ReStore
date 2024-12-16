import { useEffect, useState } from "react";
import agent from "../../api/agent";
import LoadingComponent from "../../layout/LoadingComponent";
import { Order } from "../../model/order";
import OrderDetailed from "./OrderDetailed";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button } from "@mui/material";
import { currencyFormat } from "../../util/util";
export default function Orders(){

    const [orders , setOrders] = useState<Order[] | null>(null)
    const [loading , setLoading] = useState(true)
    const [selectOrderNumber , setSelectOrderNumber] = useState(1)

    useEffect(()=>{
        agent.Orders.list()
            .then(orders => setOrders(orders))
            .catch(error => console.log(error))
            .finally(()=> setLoading(false))

    }, [])

    if(loading) <LoadingComponent message="Loading ordes ..." />

    if(selectOrderNumber > 0) return (
<OrderDetailed
    order={orders?.find(o => o.id === selectOrderNumber) || null}
    setSelectedNumber={setSelectOrderNumber}
  />    
    )

    return (
        <TableContainer component={Paper} sx={{mt:10}}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Order number</TableCell>
                <TableCell align="right">Order</TableCell>
                <TableCell align="right">Order Date</TableCell>
                <TableCell align="right">Order status</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders?.map((order) => (
                <TableRow
                  key={order.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {order.id}
                  </TableCell>
                  <TableCell align="right">{currencyFormat(order.total)}</TableCell>
                  <TableCell align="right">{order.orderDate.split('T')[0]}</TableCell>
                  <TableCell align="right">{order.orderStatus}</TableCell>
                  <TableCell align="right"><Button onClick={()=>setSelectOrderNumber(order.id)}> View </Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
}