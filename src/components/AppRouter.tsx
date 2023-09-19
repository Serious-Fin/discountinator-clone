import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import Login from "./auth/login/Login";
import Register from "./auth/register/Register";
import Home from "./../components/home/Home";
import pb from "./../lib/pocketbase";

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/login" Component={Login} />
        <Route path="/register" Component={Register} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  );
}

function RequireAuth({ children }: { children: JSX.Element }) {
  const location = useLocation();

  if (!pb.authStore.isValid) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default AppRouter;
