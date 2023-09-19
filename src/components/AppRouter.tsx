import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./auth/login/Login";
import Register from "./auth/register/Register";
import Home from "./../components/home/Home";

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/login" Component={Login} />
        <Route path="/register" Component={Register} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
