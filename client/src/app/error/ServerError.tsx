import { Container, Divider, Paper, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";

export default function ServerError() {
    const { state } = useLocation();

    return (
        <Container component={Paper} sx={{mt:20}}>
            {state?.error ? (
                <>
                    <Typography variant="h3" gutterBottom color="secondary">
                        {state.error.title}
                    </Typography>
                    <Divider />
                    <Typography variant="body1" gutterBottom color="secondary">
                        {state.error.detail || "Internal server error"}
                    </Typography>
                </>
            ) : (
                <Typography variant="h5" gutterBottom color="secondary">
                    Server Error
                </Typography>
            )}
        </Container>
    );
}
