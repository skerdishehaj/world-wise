import { useEffect, useState } from 'react';
import styles from './Login.module.css';
import PageNav from '../../components/Navs/PageNav';
import { useAuth } from '../../contexts/FakeAuthContext';
import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('jack@example.com');
  const [password, setPassword] = useState('qwerty');

  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (email && password) login(email, password);
  };

  useEffect(() => {
    if (isAuthenticated) navigate('/app/cities', { replace: true }); // replace: true prevents the login page from being added to the browser history
  }, [isAuthenticated, navigate]);

  return (
    <main className={styles.login}>
      <PageNav />

      <form
        className={styles.form}
        onSubmit={handleLoginSubmit}
      >
        <div className={styles.row}>
          <label htmlFor='email'>Email address</label>
          <input
            type='email'
            id='email'
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            id='password'
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <Button
            type='primary'
            disabled={isAuthenticated}
          >
            Login
          </Button>
        </div>
      </form>
    </main>
  );
}

