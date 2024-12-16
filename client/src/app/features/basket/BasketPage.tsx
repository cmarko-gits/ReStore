import BasketSummary from "./BasketSummary";
import { Link } from 'react-router-dom';
import {useAppSelector } from "../../store/configureStore";
import { Button, Grid } from "@mui/material";
import { BasketTable } from "./BasketTable";

export default function BasketPage() {
  const { basket  } = useAppSelector(state => state.basket);

  if (!basket || basket.items.length === 0) return <h3>Basket is empty</h3>;

  return (
    <>
     <BasketTable items={basket.items} />
      <Grid container justifyContent="flex-end" spacing={2}>
        <Grid item xs={6} />
        <Grid item xs={6}>
          <BasketSummary />
          <Button
            component={Link}
            to="/checkout"
            variant="contained"
            size="large"
            fullWidth
          >
            Checkout
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
