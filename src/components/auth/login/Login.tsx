import { useState } from "react";
import pb from "../../../lib/pocketbase";
import { useNavigate, useLocation, Link } from "react-router-dom";
import styles from "./Login.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setLoading] = useState(false);
  const [_dummy, _setDummy] = useState(false);
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

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Try to log in
    try {
      await pb.collection("users").authWithPassword(email, password);
      navigate(from, { replace: true }); // redirect user to page they were visiting before
    } catch (error) {
      console.log(error.response);
      if (error.response.code < 500) {
        setErrorText("Incorrect email or password.");
      } else {
        setErrorText("A server error occured. Try again later.");
      }
    }

    setLoading(false);
  };

  const handleLogout = () => {
    pb.authStore.clear();
    _setDummy(!_dummy);
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
        <p className={styles.title}>Login</p>
        <p className={styles.underTitle}>As an existing user</p>

        <form onSubmit={handleLogin} className={styles.form}>
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
          <p className={styles.error}>{errorText}</p>
          <button
            className={styles.confirmBtn}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Login"}
          </button>
        </form>
        <button onClick={handleGithubAuth} className={styles.github}>
          Login via GitHub
        </button>
        <p>
          Don't have an account?{" "}
          <Link to="/register" className={styles.link}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
