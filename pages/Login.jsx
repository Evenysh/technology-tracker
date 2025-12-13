import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../src/contexts/AuthContext";
import { useLanguage } from "../src/contexts/LanguageContext";
import { translations } from "../src/i18n/translations";
import "./Login.css";

function Login() {
  const { login } = useAuth();
  const { language } = useLanguage();
  const t = translations[language];

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/home";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const result = login(username, password);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(
        language === "ru"
          ? "Неверный логин или пароль"
          : "Invalid login or password"
      );
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>{language === "ru" ? "Вход" : "Login"}</h1>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>
              {language === "ru" ? "Логин" : "Username"}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              required
            />
          </div>

          <div className="form-group">
            <label>
              {language === "ru" ? "Пароль" : "Password"}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="1234"
              required
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="login-btn">
            {language === "ru" ? "Войти" : "Sign in"}
          </button>
        </form>

        <div className="login-hint">
          <p>
            {language === "ru"
              ? "Учебная авторизация"
              : "Educational login"}
          </p>
          <p>
            <strong>admin / 1234</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
