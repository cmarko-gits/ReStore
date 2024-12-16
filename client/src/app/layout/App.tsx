import '../../App.css'
import {  createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import Header from './Header';
import { useCallback, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import LoadingComponent from './LoadingComponent';
import { useAppDispatch } from '../store/configureStore';
import { fetchBasketAsync } from '../features/basket/basketSlice';
import { fetchCurrentUser } from '../model/accountSlice';
function App() {

  const dispatch = useAppDispatch()
  const [loading ,setLoading] = useState(true)


    const initApp = useCallback(async () =>   {
    try{
        await dispatch(fetchCurrentUser(  ))
        await dispatch(fetchBasketAsync())

    }catch(error:any){
        console.log(error)
    }
  } , [dispatch])

  useEffect(()=>{
     initApp().then(  () => setLoading(false))
  },[initApp])

  const [darkMode , setDarkMode] = useState(false);
  const palletteType = darkMode ? 'dark' : 'light'; // Popravljeno uslovno grananje

  const theme = createTheme({
    palette : {
      mode :palletteType ,      
      background : {
        default : palletteType === 'light' ? '#eaeaea' : '#121212'
      }
    }
  })

  const handleTheneChange = () =>{
    setDarkMode(!darkMode)
  }

  if(loading) return <LoadingComponent message='Initialising app ...'/>

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position='bottom-right' theme="colored" hideProgressBar/>
      <CssBaseline/>
      <Header darkMode={darkMode} handleTheneChange={handleTheneChange}/>
        <Outlet />
    </ThemeProvider>
  )
}

export default App
