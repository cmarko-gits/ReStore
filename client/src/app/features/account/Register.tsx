import { Avatar, Box, Container, Grid, Paper, TextField, Typography } from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import agent from "../../api/agent";
import { toast } from "react-toastify";


export default function Login(){

    const navigate = useNavigate()

    const {register , handleSubmit , setError , formState : {isSubmitting,errors,isValid}} = useForm(
        {        mode : 'all'
        }    
    )

    function handleApiErrors(errors : any){
        if(errors){
            errors.forEach( (error : string) =>{ 
               if(error.includes('Password')){
                setError('password' , {message : error})
               }else if(error.includes("Email")){
                setError('email' , {message : error})
               }else if(error.includes("Username")){
                setError('username' , {message : error})
               }
            })
        }
    }

    return(
        <Container component={Paper} maxWidth="sm"  sx={{display:'flex' , alignItems:'center' , flexDirection:'column' , p:4 , mt:10}}>
            <Avatar sx={{m:1,bgcolor:'secondary.main'}}>
                <LockOutlinedIcon/>
            </Avatar>
            <Typography component="h1" variant="h5">Register</Typography>
            <Box component="form" noValidate sx={{mt:1}} onSubmit={handleSubmit(data => agent.Account.register(data).then(()=>{
                    toast.success('Registration successful - you can now login')
                    navigate('login')}
                )
                
                .catch(error => handleApiErrors(error)))}>
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
                id="email"
                label="Email"
                

                {...register('email', { required: "Email is required" ,
                    pattern : {
                        value :/^\w+[\w-.]*@\w+((-\w+)|(\w*))\.[a-z]{2,3}$/,
                        message : 'Not a valid email address'
                    }
                })}
                error = {!!errors.email}
                helperText = {errors?.email?.message as string}
            />

            <TextField
                margin="normal"
                fullWidth
                id="password"
                label="Password"
                type="password"
                autoComplete="current-password"

            
                {...register('password', { required: "Password is required" ,
                                           pattern : {
                                                value : /(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/,
                                                message : 'Password does not meet complexety requirements'
                                           }
                },)}
                error = {!!errors.password}
                helperText = {errors?.password?.message as string}
            />


            
            <LoadingButton loading={isSubmitting} type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={!isValid} >
                     Register
            </LoadingButton>
                <Grid container>
                    <Grid item>
                        <Link to="/login">
                            {"I alredy have an account!      Sign In"}
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    )
}