import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Product } from '../../model/product';
import { Avatar, CardHeader } from '@mui/material';
import { Link } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import { currencyFormat } from '../../util/util';
import { useAppDispatch, useAppSelector } from '../../store/configureStore';
import { AddBasketItemAsync } from '../basket/basketSlice';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.basket);

  if (!product || !product.name) {
    console.error("Product data is missing or incomplete", product);
    return <Typography color="error">Invalid Product Data</Typography>;
  }

  return (
    <Card sx={{ mt: 10 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: 'secondary.main' }}>
            {product.name.charAt(0).toUpperCase()}
          </Avatar>
        }
        title={product.name}
        titleTypographyProps={{
          sx: { fontWeight: 'bold', color: 'primary.main' },
        }}
      />
      <CardMedia
        sx={{ height: 140, backgroundSize: 'contain', bgcolor: 'primary.light' }}
        image={product.pictureUrl || "/placeholder.png"}
        title={product.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" color="secondary" component="div">
          {currencyFormat(product.price)}
        </Typography>
        <Typography variant="body2" sx={{ color: 'white' }}>
          {product.brand} / {product.type}
        </Typography>
      </CardContent>
      <CardActions>
        <LoadingButton
          loading={status.includes('pendingAddItem' + product.id)}
          size="small"
          color="secondary"
          onClick={() => dispatch(AddBasketItemAsync({ productId: product.id }))}
        >
          Add To Cart
        </LoadingButton>
        <Button component={Link} to={`/catalog/${product.id}`} size="small" color="secondary">
          View Product
        </Button>
      </CardActions>
    </Card>
  );
}
