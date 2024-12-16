import { Avatar, Box, Container, Grid, Paper, TextField, Typography } from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {  FieldValues, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { useDispatch } from "react-redux";
import { signInUser } from "../../model/accountSlice";


export default function Login(){

    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()

    const {register , handleSubmit , formState : {isSubmitting,errors,isValid}} = useForm(
{        mode : 'onTouched'
}    )

    async function submitForm(data:FieldValues) {
          try{
            dispatch(signInUser(data)) 
            navigate(location.state?.from || '/catalog')
   
          }catch(error:any){
            console.log(error)
          }
    }


    return(
        <Container component={Paper} maxWidth="sm"  sx={{display:'flex' , alignItems:'center' , flexDirection:'column' , p:4 , mt:10}}>
            <Avatar sx={{m:1,bgcolor:'secondary.main'}}>
                <LockOutlinedIcon/>
            </Avatar>
            <Typography component="h1" variant="h5">Sign In</Typography>
            <Box component="form" noValidate sx={{mt:1}} onSubmit={handleSubmit(submitForm)}>
            <TextField
                margin="normal"
                fullWidth
                id="username"
                label="Username"
                autoFocus

                {...register('username', { required: "Username is required" })}
                error = {!!errors.username}
                helperText = {errors?.username?.message as string}
            />

<TextField
    margin="normal"
    fullWidth
    id="password"
    label="Password"
    type="password"
    autoComplete="current-password"

 
    {...register('password', { required: "Password is required" })}
    error = {!!errors.password}
    helperText = {errors?.password?.message as string}
/>
                <LoadingButton loading={isSubmitting} type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={!isValid} >
                    Sign In
                </LoadingButton>
                <Grid container>
                    <Grid item>
                        <Link to="/register">
        {"Don't have an account? Sign up"}
    </Link>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    )
}