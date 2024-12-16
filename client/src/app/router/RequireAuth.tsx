import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/configureStore";

export default function RequireAuth() {
    const { user } = useAppSelector((state) => state.account);
    const location = useLocation();

    // Redirect to login if user is not authenticated
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} />;
    }

    // Render child components if authenticated
    return <Outlet />;
}
