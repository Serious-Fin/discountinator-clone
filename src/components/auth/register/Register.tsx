import { useState } from "react";
import pb from "../../../lib/pocketbase";
import { useNavigate, useLocation, Link } from "react-router-dom";
import styles from "./Register.module.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

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

  const handleGithubAuth = async () => {
    setLoading(true);
    await pb
      .collection("users")
      .authWithOAuth2({ provider: "github" })
      .then(() => {
        navigate(from, { replace: true });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // TODO Check if passwords match BEFORE sending to server
    if (password !== confirmPassword) {
      setErrorText("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      // Create a new user record
      await pb.collection("users").create({
        email: email,
        password: password,
        passwordConfirm: confirmPassword,
      });

      // Send email verification link
      await pb.collection("users").requestVerification(email);
      alert("Verification email sent. Please check your inbox.");

      // Log new user in
      await pb.collection("users").authWithPassword(email, password);

      // redirect user to page they were visiting before
      navigate(from, { replace: true });
    } catch (error) {
      console.log(error.response);

      if (error.response.code < 500) {
        setErrorText("User with this email already exists");
      } else {
        setErrorText("A server error occured. Try again later.");
      }
    }

    setLoading(false);
  };

  const handleLogout = () => {
    pb.authStore.clear();
    navigate("/login");
  };

  if (pb.authStore.isValid && pb.authStore.model) {
    return (
      <div className={styles.outer}>
        <div className={styles.inner}>
          <p className={styles.underTitle}>
            Logged in as{" "}
            <span className={styles.bold}>{pb.authStore.model.email}</span>
          </p>
          <button className={styles.exitBtn} onClick={handleLogout}>
            Log out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.outer}>
      <div className={styles.inner}>
        <p className={styles.title}>Register</p>
        <p className={styles.underTitle}>As a new user</p>

        <form onSubmit={handleRegister} className={styles.form}>
          <input
            className={styles.inputField}
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Email"
            required
          />
          <input
            className={styles.inputField}
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Password"
            minLength={5}
            required
          />
          <input
            className={styles.inputField}
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="Confirm Password"
            minLength={5}
            required
          />
          <p className={styles.error}>{errorText}</p>
          <button
            type="submit"
            className={styles.confirmBtn}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Register"}
          </button>
        </form>
        <button onClick={handleGithubAuth} className={styles.github}>
          Login via GitHub
        </button>
        <p>
          Already have an account?{" "}
          <Link to="/login" className={styles.link}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
