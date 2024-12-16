import { Button, Container, Divider, Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function NotFound (){
    return(
        <Container component={Paper} sx={{height:20}}>
            <Typography gutterBottom variant="h3">Oops - we can't find you are looking for</Typography>
            <Divider/>
            <Button component={Link} to={'/catalog'} fullWidth >Go back to shop</Button>
        </Container>
    )
}