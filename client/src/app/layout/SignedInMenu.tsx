import { Button, Menu, MenuItem } from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../store/configureStore";
import { signOut } from "../model/accountSlice";
import { clearBasket } from "../features/basket/basketSlice";
import { Link } from "react-router-dom";

export default function SignedInMenu(){
    const dispatch = useDispatch()
    const {user} = useAppSelector(state => state.account)  
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    return (
      <div>
        <Button
          color="inherit"
          onClick={handleClick}
          sx={{typography:'h6'}}
        >
          {user?.email}
        </Button>
        <Menu

          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>Profile</MenuItem>
          <MenuItem component={Link} to='orders'>My orders</MenuItem>
          <MenuItem onClick={()=>{
            
              dispatch(signOut(),
              dispatch(clearBasket())
            
            )}}>Logout</MenuItem>
        </Menu>
      </div>)
}