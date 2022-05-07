import { Product } from "./Product";
import classes from "./products.module.css";

const Products = ({ products }) => {
    console.log(products) 

    return (
        <div className={classes.products}>
        {
            products.map(product => {
                return (
                    <Product key={product.id} product={product} />
                )
            })
        }
       </div>
    )

}

export default Products;
