import { Button, ButtonGroup, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import { increment, decrement } from "../contact/counterSlice"; // Import actions from the slice

export default function ContactPage() {
    const dispatch = useAppDispatch();
    const { title, data } = useAppSelector((state) => state.counter); // Access state from the slice

    return (
        <>
            <Typography variant="h2">{title}</Typography>
            <Typography variant="h6">Data: {data}</Typography>
            <ButtonGroup>
                <Button
                    onClick={() => dispatch(decrement(1))} // Dispatch the slice's decrement action
                    variant="contained"
                    color="error"
                >
                    Decrement
                </Button>
                <Button
                    onClick={() => dispatch(increment(1))} // Dispatch the slice's increment action
                    variant="contained"
                    color="secondary"
                >
                    Increment
                </Button>
            </ButtonGroup>
        </>
    );
}
