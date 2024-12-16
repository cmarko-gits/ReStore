import { Box, Button, Grid, Typography } from "@mui/material";
import { Order } from "../../model/order";
import { BasketTable } from "../basket/BasketTable";
import { BasketItem } from "../../model/basket";
import BasketSummary from "../basket/BasketSummary";

interface Props {
  order: Order | null; // Allow `null` to handle initial loading state
  setSelectedNumber: (id: number) => void;
}

export default function OrderDetailed({ order, setSelectedNumber }: Props) {
  if (!order) return <Typography variant="h6">Order not found</Typography>;

  const subTotal =
    order.orderItems.reduce((sum, item) => sum + item.quantity * item.price, 0) ?? 0;

  return (
    <>
      <Box display={"flex"} justifyContent={"space-between"}>
        <Typography variant="h4" gutterBottom sx={{ p: 2 }}>
          Order #{order.id} - {order.orderStatus}
        </Typography>

        <Button
          onClick={() => setSelectedNumber(0)}
          sx={{ m: 2 }}
          size="large"
          variant="contained"
        >
          Back
        </Button>
      </Box>

      <BasketTable items={order.orderItems as BasketItem[]} isBasket={false} />

      <Grid container>
        <Grid item xs={6}>
          <BasketSummary subtotal={subTotal} />
        </Grid>
      </Grid>
    </>
  );
}
