/* eslint-disable react-hooks/rules-of-hooks */
import { GetStaticProps, GetStaticPaths } from "next";
import classes from "./../../styles/product.module.css";
import { useRef, useState } from "react";
import Add from "../../icons/add";
import Category from "../../components/Editor/Category";
import ModalCategories from "../../components/Editor/ModalCategories";
import Variations from "../../components/Editor/Variations";
import Measures from "../../components/Editor/Measures";
import Checkbox from "../../components/Editor/Checkbox";

const Product = ({ product, validCategories }) => {
  if (!product || !product.found) return <p>Loading...</p>;

  const {
    id,
    name,
    images,
    categories,
    attributes,
    price,
    on_sale,
    stock_quantity,
    description,
  } = product;

  const { options } = attributes[0] || {};

  const [priceValue, setPriceValue] = useState(price);
  const [title, setTitle] = useState(name);
  const [stock, setStock] = useState(stock_quantity);
  const [descriptionContent, setDescription] = useState(description);
  const [listCategories, setListCategories] = useState(categories);
  const [openCategories, setOpenCategories] = useState(false);
  const [onSale, setOnSale] = useState(on_sale);
  const [measures, setMeasures] = useState(options);

  const addCategory = (category) => {
    setListCategories([...listCategories, category]);
  }

  const selectCategory = () => setOpenCategories(true);

  const deleteCategory = (category) => () => {
        setListCategories(listCategories.filter((cat) => cat.id !== category));
  }

  const updateSale = () => {
    setOnSale(!onSale);
  }

  return (
    <div className={classes.container}>
      <main className={classes.main}>
        <div className={classes.product}>
          <div className={classes.image}>
            <img src={images[0].src} alt={id} />
          </div>
          <div className={classes.content}>
            <div className={classes.title}>
              <div className={classes.col_1}>Nombre de producto</div>
              <div className={classes.col_2}>
                <input type="text" value = {title} onChange={(event) => setTitle(event.target.value)} />
              </div>
            </div>
            <div className={classes.description}>
              <div className={classes.col_1}>Descripcion</div>
              <div className={classes.col_2}>
                <textarea value={descriptionContent} onChange={(e) => setDescription(e.target.value)} />
              </div>
            </div>
            <div className={classes.categories}>
              <div className={classes.col_1}>Categorias</div>
              <div className={classes.col_2}>
                <div className={classes.tags}>
                    {listCategories.map((category) => (
                    <Category key={category.id} category={category} deleteC={deleteCategory(category.id)} />
                    ))}
                </div>
                <span className={classes.add} onClick={selectCategory}>
                    <Add />
                </span>
              </div>
            </div>

            <div className={classes.price}>
              <div className={classes.col_1}>Precio</div>
              <div className={classes.col_2}>
                <span className={classes.bill}>
                  <input
                    type="text"
                    value={priceValue}
                    onChange={(event) => setPriceValue(event.target.value)}
                  />
                </span>
              </div>
            </div>

            <div className={classes.sale}>
              <div className={classes.col_1}>En venta</div>
              <div className={classes.col_2}>
                <Checkbox state={onSale} updateState={updateSale} />
              </div>
            </div>

            <div className={classes.stock}>
              <div className={classes.col_1}>Stock</div>
              <div className={classes.col_2}>
                <span className={classes.stock_quantity}>
                  <input
                    type="text"
                    value={stock}
                    onChange={(event) => setStock(event.target.value)}
                  />
                </span>
              </div>
            </div>

            <div className={classes.measures}>
              <div className={classes.col_1}>Medidas</div>
              <div className={`${classes.col_2} mx-h-45`}>
                <Measures measures={measures} />
              </div>
            </div>

            <div className={classes.variations}>
              <div className={classes.col_1}>Variaciones</div>
              <div className={`${classes.col_2} mx-h-45`}>
                <Variations parentId={id}/>
              </div> 
            </div>
          </div>
        </div>
        { openCategories && <ModalCategories setCategories={addCategory} closeModal={() => setOpenCategories(false)} categories={listCategories} useCategories={validCategories}/> }
      </main>
    </div>
  );
};
 
export default Product;

export const getServerSideProps: GetStaticProps = async (context) => {
  const { id } = context.params;
  
  const product = await (
    await fetch(`${process.env.API_HOST}/product/${id}`)
  ).json();
  const validCategories = await ( await fetch(`${process.env.API_HOST}/categories`) ).json();

  return {
    props: {
      product:{ found: product !== undefined, ...product },
      validCategories
    },
  };
};

// export const getStaticPaths: GetStaticPaths = async () => {
//   return {
//     paths: [
//       {
//         params: {
//           id: "9672",
//         },
//       },
//     ],
//     fallback: true, // false or 'blocking' 
//   };
// };
