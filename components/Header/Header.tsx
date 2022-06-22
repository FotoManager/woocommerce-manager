import Logout from "../../icons/logout";
import Navbar from "../Navbar/Navbar";
import styles from "./Header.module.css";

const Header = ({ handleLogout, name, lastname }) => {
    return (
        <div className={styles.header}>
          <div className={styles.navbar}>
            <Navbar />
          </div>
          <div className={styles.header_left}>
            Bienvenido, <span className={styles.username}>{name} {lastname}</span>
          </div>
          <div className={styles.header_right}>
            <button onClick={handleLogout} className={styles.logout}> Cerrar Sesión <Logout /></button>
          </div>
        </div>
    )
}

export default Header;