import Add from "../../icons/add";
import { Product } from "./Product";
import classes from "./products.module.css";
import { useRouter } from "next/router";
import TagsIcon from "../../icons/tags";

const Products = ({ products }) => {
  //console.log(products)
  const router = useRouter();

  return (
    <div className={classes.container}>
      <div className={classes.actions}>
        <button
          className={classes.new}
          onClick={() => router.push("/new/product")}
        >
          <Add />
          <span>Agregar Producto</span>
        </button>
        <button
          className={classes.new}
          onClick={() => router.push("/config/tags")}
        >
          <TagsIcon />
          <span>Administrar Tags</span>
        </button>
      </div>

      {products.length > 0 ? (
        <div className={classes.products}>
          {products.map((product) => {
            return <Product key={product.id} product={product} />;
          })}
        </div>
      ) : (
        <div className={classes.noProducts}> No hay productos </div>
      )}
    </div>
  );
};

export default Products;
