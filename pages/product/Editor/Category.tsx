import classes from "./../product.module.css";
import DeleteIcon from "./../../../icons/delete";

const Category = ({ category, deleteC }) => {
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
