import Add from "../../icons/add";
import { Product } from "./Product";
import classes from "./products.module.css";
import { useRouter } from "next/router";
import TagsIcon from "../../icons/tags";

const Products = ({ data }) => {
    //console.log(products) 
    const router = useRouter();

    return (
        <div className={classes.container}>

            <div className={classes.actions}>
                <button className={classes.new} onClick={() => router.push("/new/product")}> 
                    <Add />
                    <span>Agregar Producto</span>
                </button>
                <button className={classes.new} onClick={() => router.push("/config/tags")}> 
                    <TagsIcon />
                    <span>Administrar Tags</span>
                </button>
            </div>

            <div className={classes.products}>
                {
                   data.map(products => {
                        return products.map(product => {
                            return (
                                <Product key={product.id} product={product} />
                            )
                        })
                   })
                }
            </div>
        </div>
    )

}

export default Products;
