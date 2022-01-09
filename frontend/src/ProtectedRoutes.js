import { Outlet , Navigate} from "react-router";


export const ProtectedRoutes = (props) => {
  const data  = localStorage.getItem("userDetails");



  return data ? (
    <Outlet/>
  ) : (<Navigate to="/signin" />

  );
};