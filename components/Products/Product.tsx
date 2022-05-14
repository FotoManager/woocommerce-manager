/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import classes from "./products.module.css";
import { useRouter } from "next/router";

export const Product = ({ product }) => {
    //console.log(product)
    const router = useRouter();

    const handleClick = (event) => {
        event.preventDefault();
        const product = event.target.getAttribute("data-product-id");
        router.push(`/product/${product}`);
    }

    return (
        <div className={classes.product}>
            <div className={classes.image}>
                <Image src={product.images[0].src}  alt={product.id}  layout="fill"/>
            </div>
            <div className={classes.content}>
                <div className={classes.title}>
                    <h2 className={classes.category}>{product.categories[0].name}</h2>
                    <h1 title={product.name}>{product.name}</h1>
                    <span className={classes.id}>ID {product.id}</span>
                </div>
                <div className={classes.actions}>
                    <button className={classes.button} data-product-id={product.id} onClick={handleClick}>Editar producto</button>
                </div>
            </div>
        </div>
    );
};