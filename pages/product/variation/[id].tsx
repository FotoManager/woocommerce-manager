/* eslint-disable react-hooks/rules-of-hooks */
import { GetStaticProps } from "next";
import dynamic from 'next/dynamic'
import classes from "./../../../styles/product.module.css";
import {  useState, useEffect, Fragment } from "react";
import Add from "../../../icons/add";
import Category from "../../../components/Editor/Category";
import ModalCategories from "../../../components/Editor/ModalCategories";
import { updateVariation } from "./../../api/helpers/api";
//import Variations from "../../components/Editor/Variations";
import Measures from "../../../components/Editor/Measures";
import Checkbox from "../../../components/Editor/Checkbox";
import ModalConfirmation from "../../../components/Confirmation/Confirmation";
import { useQuery, gql, useMutation, useApolloClient } from "@apollo/client";
import { useRouter } from "next/router";
import Header from "../../../components/Header/Header";
import LoaderPage from "../../../components/loader/LoaderPage";

const ViewerQuery = gql`
  query ViewerQuery {
    viewer {
      username
      name
      lastname
    }
  }
`;

const SignOutMutation = gql`
  mutation SignOutMutation{
    signOut
  }
`;

const Product = ({ product, validCategories, attributes }) => {
  if (!product || !product.found) return <LoaderPage text={"Cargando variacion"} />

  const {
    id,
    name,
    images,
    categories,
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
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  
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

  const handleSave = () => {
    setLoading(true);
    const updatedProduct = {
      id,
      name: title,
      categories: listCategories,
      attributes: [ { ...attributes[0], option: measures[0] || ""} ],
      regular_price: priceValue,
      on_stock: onSale,
      stock_quantity: stock,
      description: descriptionContent,
    };
    console.log(product, updatedProduct)
    updateVariation(product.parent_id, updatedProduct).then(
      () => {
        setLoading(false);
      }
    )
  }

  const selectMeasure = (id) => {
    const newData = [measures[id]];
    
    for(let i = 0; i < measures.length; i++){
        if(i !== id){
            newData.push(measures[i])
        }
    }
    setMeasures(newData);
  }

  const handlerResponse = (response: boolean) => {
    return response ? handleSave() : setShowConfirmation(false);
  }

  if(loading) return <LoaderPage text={"Actualizando variacion"} />

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
                <Measures measures={measures} selectMeasure={selectMeasure}/>
              </div>
            </div>
          </div>
        </div>
        <div className={classes.actions}>
          <button className={classes.save} onClick={() => {
            setShowConfirmation(true);
          }}>Guardar</button>
        </div>
        { openCategories && <ModalCategories setCategories={addCategory} closeModal={() => setOpenCategories(false)} categories={listCategories} useCategories={validCategories}/> }
        {showConfirmation && ( <ModalConfirmation
          messageModal={"¿Estás seguro de actualizar esta variación?"}
          confirmResponse={handlerResponse}
          command={"UPDATE"}
        /> )}
      
      </main>
    </div>
  );
};
 
const Wrapper = ({ product, attributes, validCategories }) => {
  const { data, loading, error } = useQuery(ViewerQuery);
    const { viewer } = data || {};
    const shouldRedirect = !(loading || error || viewer);
    const client = useApolloClient()
    const router = useRouter();
    const [signOut] = useMutation(SignOutMutation);

  useEffect(() => {
    if (shouldRedirect) {
      router.push("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  if(loading || !viewer) {
    return <LoaderPage text={"Cargando"} />
  }

  const handleLogout = async () => {
    try{
      signOut().then(() => {
        client.resetStore().then(() => {
          router.push("/login");
        });
      });
    }catch(error){
      console.log(error);
    }
  }

  return (
    <Fragment>
      <Header  name={viewer.name} lastname={viewer.lastname} handleLogout={handleLogout} />
      <Product validCategories={validCategories} product={product} attributes={attributes}/>
    </Fragment>
  );
}

export default Wrapper;

export const getServerSideProps: GetStaticProps = async (context) => {
  const { id } = context.params;
  
  const product = await (
    await fetch(`${process.env.API_HOST ? process.env.API_HOST : "http://localhost:5000"}/product/${id}`)
  ).json();
  const parent = await (
    await fetch(`${process.env.API_HOST ? process.env.API_HOST : "http://localhost:5000"}/product/${product.parent_id}`)
  ).json();
  const validCategories = await ( await fetch(`${process.env.API_HOST ? process.env.API_HOST : "http://localhost:5000"}/categories`) ).json();

  return {
    props: {
      product:{ found: product !== undefined, ...product },
      validCategories,
      attributes: parent.attributes
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
