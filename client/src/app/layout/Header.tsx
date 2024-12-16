import { AppBar, Badge, Box, IconButton, List, ListItem, Switch, Toolbar, Typography } from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import { useAppSelector } from "../store/configureStore";
import SignedInMenu from "./SignedInMenu";

const midLinks = [
    { title: "catalog", path: "/catalog" },
    { title: "about", path: "/about" },
    { title: "contact", path: "/contact" },
];

const rightLinks = [
    { title: "login", path: "/login" },
    { title: "register", path: "/register" },
];

const navStyles = {
    color: "inherit",
    typography: "h6",
    textDecoration: "none",
    "&:hover": { color: "grey.500" },
    "&:active": { color: "text.secondary" },
};

interface Props {
    darkMode: boolean;
    handleTheneChange: () => void;
}

export default function Header({ darkMode, handleTheneChange }: Props) {

    const {basket} = useAppSelector(state => state.basket );
    const {user}= useAppSelector(state => state.account );
    const itemCount = basket?.items.reduce((sum,item)=> sum + item.quantity ,0)

    return (
        <AppBar>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
  {/* Ostatak sadržaja */}
                <Typography
                            variant="h6"
                            component={NavLink}
                            to="/"
                            sx={navStyles}
                        >
                            Re-Store
                        </Typography>
                        <Switch checked={darkMode} onChange={handleTheneChange} sx={{ ml: 2 }} />
            </Box>
              

                {/* Srednji linkovi */}
                <List sx={{ display: "flex" }}>
                    {midLinks.map(({ title, path }) => (
                        <ListItem
                            component={NavLink}
                            to={path}
                            key={path}
                            sx={{ ...navStyles, mx: 2 }}
                        >
                            {title.toUpperCase()}
                        </ListItem>
                    ))}
                </List>
                <IconButton component={Link}  to={"/basket"} size="large" edge="start" color="inherit" sx={{ mr: 2 }}>
                        <Badge badgeContent={itemCount} color="secondary">
                            <ShoppingCart />
                        </Badge>
                    </IconButton>
                  {user ? (
                    <SignedInMenu/>
                  ) : (
                    <List sx={{ display: "flex" }}>
                    {rightLinks.map(({ title, path }) => (
                        <ListItem
                            component={NavLink}
                            to={path}
                            key={path}
                            sx={{ color: "inherit", typography: "h6", mx: 1 }}
                        >
                            {title.toUpperCase()}
                        </ListItem>
                    ))}
                </List>
                  )}
                <Box>

               
                </Box>
              
            </Toolbar>
        </AppBar>
    );
}
