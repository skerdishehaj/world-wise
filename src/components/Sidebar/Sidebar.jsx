import AppNav from '../Navs/AppNav';
import Footer from '../Footer';
import Logo from '../Logo';
import styles from './Sidebar.module.css';
import { Outlet } from 'react-router-dom';
function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <Logo />
      <AppNav />
      <Outlet /> {/*  This is where the child routes will be rendered */}
      <Footer />
    </div>
  );
}

export default Sidebar;
