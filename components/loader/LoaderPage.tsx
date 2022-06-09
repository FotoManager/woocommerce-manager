import classes from "./Loader.module.css";

const LoaderPage = ({ text }) => {
    return (
        <div className={classes.loader_page}>
            <div className={classes.spinner}></div>
            <span>{text || "Loading"}</span>
        </div>
    );
}

export default LoaderPage;