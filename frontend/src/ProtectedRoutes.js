import { Outlet , Navigate} from "react-router";


export const ProtectedRoutes = (props) => {
  const data  = localStorage.getItem("userDetails");

  console.log(data);

  return data ? (
    <Outlet/>
  ) : (<Navigate to="/signin" />

  );
};