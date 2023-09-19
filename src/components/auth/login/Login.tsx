import { useState } from "react";
import pb from "../../../lib/pocketbase";
import { useNavigate, useLocation } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setLoading] = useState(false);
  const [_dummy, _setDummy] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Try to log in
    try {
      await pb.collection("users").authWithPassword(email, password);
      navigate(from, { replace: true }); // redirect user to page they were visiting before
    } catch (error) {
      alert(error);
    }

    setLoading(false);
  };

  const handleLogout = () => {
    pb.authStore.clear();
    _setDummy(!_dummy);
  };

  if (pb.authStore.isValid && pb.authStore.model) {
    return (
      <div>
        <p>Logged in as {pb.authStore.model.email}</p>
        <button onClick={handleLogout}>Log out</button>
      </div>
    );
  }

  return (
    <>
      {isLoading && <p>Trying to log in...</p>}

      <p>Please please please log in</p>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
    </>
  );
}
