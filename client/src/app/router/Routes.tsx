import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../features/home/HomePage";
import Catalog from "../features/catalog/Catalog";
import ProductDetalis from "../features/catalog/ProductDetalis";
import AboutPage from "../features/about/AboutPage";
import ContactPage from "../features/contact/ContactPage";
import ServerError from "../error/ServerError";
import NotFound from "../error/NotFound";
import BasketPage from "../features/basket/BasketPage";
import CheckoutPage from "../features/checkout/CheckoutPage";
import Login from "../features/account/Login";
import Register from "../features/account/Register";
import RequireAuth from "./RequireAuth";
import Orders from "../features/orders/Order";
import OrderDetailed from "../features/orders/OrderDetailed";

export const router = createBrowserRouter([
    {
        path : '/',
        element: <App />,
        children :[
            {
                element : <RequireAuth/> , children : [
                    {path : 'checkout' , element : <CheckoutPage/>},
                    {path : 'orders' , element : <Orders/>}
                ]
            },  

            {path:'' , element : <HomePage/>},
            {path:'catalog' , element : <Catalog/>},
            {path:'catalog/:id' , element : <ProductDetalis/>},
            {path:'about' , element : <AboutPage/>},
            {path:'contact' , element : <ContactPage/>},
            {path:'server-error' , element : <ServerError/>},
            {path:'checkout' , element : <CheckoutPage/>},
            {path:'Orders/:id' , element : <OrderDetailed/>},
            {path:'login' , element : <Login/>},
            {path:'register' , element : <Register/>},
            {path:'not-found' , element : <NotFound/>},
            {path:'basket' , element:<BasketPage/>},
            {path:'*' , element :<Navigate replace to={"/not-found"}/>},
        ]
    }
])