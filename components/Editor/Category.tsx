import classes from "./../../styles/product.module.css";
import DeleteIcon from "../../icons/delete";

const Category = ({ category, deleteC }) => {

  if(!category) return <p>Loading...</p>;

  const { id, name } = category;

  return (
    <div className={classes.category}>
      <span>{name.toUpperCase()}</span>
      <span onClick={deleteC}>
        <DeleteIcon />
      </span>
    </div>
  );
};

export default Category;
