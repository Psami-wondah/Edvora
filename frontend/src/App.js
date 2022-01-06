
import './App.css';
import './Styles.css'
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router";
import Signin from './auth/SignIn';
import Signup from './auth/SignUp';
import Feed from './feed/Feed';
import { ProtectedRoutes } from './ProtectedRoutes';
function App() {
  return (
<>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signin />} />

          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />

          <Route exact path='/feed' element={<ProtectedRoutes/>}>
              <Route exact path='/feed' element={<Feed/>}/>
        </Route>  
        </Routes>
        
      </BrowserRouter>
    </>
  );
}

export default App;
