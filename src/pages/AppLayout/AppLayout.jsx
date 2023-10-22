import Sidebar from '../../components/Sidebar/Sidebar';
import Map from '../../components/Map/Map';
import styles from './AppLayout.module.css';
import User from '../../components/User/User';
import { useAuth } from '../../contexts/FakeAuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function AppLayout() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  return (
    <div className={styles.app}>
      <Sidebar />
      <Map />
      <User />
    </div>
  );
}

export default AppLayout;
