import Add from "../../icons/add";
import { Product } from "./Product";
import classes from "./products.module.css";
import { useRouter } from "next/router";

const Products = ({ products }) => {
    //console.log(products) 
    const router = useRouter();

    return (
        <div className={classes.container}>

            <div className={classes.actions}>
                <button className={classes.new} onClick={() => router.push("/new/product")}> 
                    <Add />
                    <span>Agregar Producto</span>
                </button>
            </div>

            <div className={classes.products}>
                {
                    products.map(product => {
                        return (
                            <Product key={product.id} product={product} />
                        )
                    })
                }
            </div>
        </div>
    )

}

export default Products;
