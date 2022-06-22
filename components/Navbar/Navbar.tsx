import classes from "./Navbar.module.css";
import MenuIcon from "./../../icons/menu";
import Link from "next/link";
import HomeIcon from "../../icons/home";
import NewIcon from "../../icons/new";
import ReactDOM from "react-dom";
import { useState } from "react";

const Menu = ({ isOpen }) => {
    return ReactDOM.createPortal(
        (
            <div className={`${classes.menu} ${ isOpen ? classes.open: ''}`}>
                <div className={classes.body}>
                    <h2>Navegación</h2>

                    <ul className={classes.items}>
                        <li>
                            <Link href="/">
                                <a><HomeIcon /> Inicio</a>
                            </Link>
                        </li>
                        <li>
                            <Link href="/new/product">
                                <a><NewIcon />Crear producto</a>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        ),
        document.getElementById("__next")
    );
}

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={classes.Navbar}>
            <Menu isOpen={isOpen} />

            <div className={`${classes.menuCollapser} ${ isOpen ? classes.collapsed: ''}`} onClick={
                () => setIsOpen(!isOpen)
            }>
                <MenuIcon />
            </div>
        </div>
    );
}

export default Navbar;