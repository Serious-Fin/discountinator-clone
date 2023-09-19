import { useState } from "react";
import pb from "../../../lib/pocketbase";
import { useNavigate, useLocation } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // TODO Check if passwords match BEFORE sending to server

    try {
      // Create a new user record
      await pb.collection("users").create({
        email: email,
        password: password,
        passwordConfirm: confirmPassword,
      });

      // Log new user in
      await pb.collection("users").authWithPassword(email, password);

      // redirect user to page they were visiting before
      navigate(from, { replace: true });
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  const handleLogout = () => {
    pb.authStore.clear();
    navigate("/login");
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
      {isLoading && <p>Loading...</p>}

      <p>REGISTER NOW AND WIN MANY</p>

      <form onSubmit={handleRegister}>
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
        <input
          type="password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          placeholder="Confirm Password"
          required
        />
        <button type="submit">Register</button>
      </form>
    </>
  );
}
