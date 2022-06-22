/* eslint-disable react-hooks/rules-of-hooks */
import { GetStaticProps } from "next";
import dynamic from "next/dynamic";
import classes from "./../../styles/product.module.css";
import { useRef, useState, Suspense, useEffect } from "react";
import Add from "../../icons/add";
import Category from "../../components/Editor/Category";
import ModalCategories from "../../components/Editor/ModalCategories";
import { createProduct } from "../api/helpers/api";
//import Variations from "../../components/Editor/Variations";
import Measures from "../../components/Editor/Measures";
import Checkbox from "../../components/Editor/Checkbox";
import LoaderPage from "../../components/loader/LoaderPage";
import ModalErrors from "../../components/Editor/ModalErrors";
import ModalConfirmation from "../../components/Confirmation/Confirmation";

import { useQuery, gql, useMutation, useApolloClient } from "@apollo/client";
import { useRouter } from "next/router";
import Header from "../../components/Header/Header";
import Head from "next/head";
import ModalTags from "../../components/Editor/ModalTags";

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

const Product = ({ validCategories }) => {
  if (!validCategories) return <LoaderPage text={"Cargando"} />;

  const [priceValue, setPriceValue] = useState("");
  const [title, setTitle] = useState("");
  const [stock, setStock] = useState("");
  const [descriptionContent, setDescription] = useState("");
  const [listCategories, setListCategories] = useState([]);
  const [openCategories, setOpenCategories] = useState(false);
  const [listTags, setListTags] = useState([]);
  const [openTags, setOpenTags] = useState(false);
  const [onSale, setOnSale] = useState(false);
  const [measures, setMeasures] = useState([]);
  const imgUpload = useRef(null);
  const [img, setImg] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [sku, setSKU] = useState("");

  const previewImage = () => {
    const oFReader = new FileReader();
    oFReader.readAsDataURL(imgUpload.current.files[0]);
    oFReader.onload = function (oFREvent) {
      setImg(oFREvent.target.result as string);
    };
  };

  const addTag = (tag) => {
    setListTags([...listTags, tag]);
  };

  const selectTag = () => setOpenTags(true);

  const deleteTag = (tag) => () => {
    setListTags(listTags.filter((cat) => cat.id !== tag));
  };

  const addCategory = (category) => {
    setListCategories([...listCategories, category]);
  };

  const selectCategory = () => setOpenCategories(true);

  const deleteCategory = (category) => () => {
    setListCategories(listCategories.filter((cat) => cat.id !== category));
  };

  const updateSale = () => {
    setOnSale(!onSale);
  };
  
  const validate = () => {
    const errors = {};
    if(!img) errors["img"] = "Debe seleccionar una imagen";
    if (!title) errors["title"] = "El titulo es requerido";
    if (!priceValue){
      const hasCategory = listCategories.find((cat) => cat.id === 83 || cat.id === 101);
      if (hasCategory) errors["price"] = "Debe ingresar un precio.";
    }
    if (!stock) errors["stock"] = "El stock es requerido";
    if (!descriptionContent) errors["description"] = "La descripcion es requerida";
    if (!listCategories.length) errors["categories"] = "Las categorias son requeridas";
    if(!sku) errors["sku"] = "El sku es requerido";

    setErrors(errors);
    if (Object.keys(errors).length) setShowErrors(true);
    return Object.keys(errors).length === 0;
  }

  const handleSave = () => {
    const createdProduct = new FormData();
    
    createdProduct.append("sku", sku);
    createdProduct.append("name", title);
    createdProduct.append("categories", JSON.stringify(listCategories));
    createdProduct.append("regular_price", priceValue);
    createdProduct.append("on_stock", onSale.toString());
    createdProduct.append("stock_quantity", stock);
    createdProduct.append("manage_stock", "true");
    createdProduct.append("description", descriptionContent);
    createdProduct.append("type", measures.length === 0 ? "simple" : "variable");
    createdProduct.append("tags", JSON.stringify(listTags));

    if(measures.length > 0){
      createdProduct.append(
        "attributes",
        JSON.stringify([{id:0, name: "Cantidad", options: measures, position: 0, variation: true, visible: true}])
      );
    }
    if (img !== "") createdProduct.append("images", imgUpload.current.files[0]);

    setLoading(true);

    createProduct(createdProduct).then((res) => {
      setLoading(false);
      setShowConfirmation(false);
    });
  };

  const handlerResponse = (response: boolean) => {
    return response ? handleSave() : setShowConfirmation(false);
  }

  if (loading) return <LoaderPage text={"Creando producto"} />;

  return (
    <div className={classes.container}>
      <main className={classes.main}>
        <Head>
          <title>Crear producto nuevo | Tornicentro</title>
        </Head>

        <div className={classes.product}>
          <div className={classes.image}>
            {img !== "" && <img src={img} alt={"Product Image"} />}
            <label className={classes.fileReader}>
              <input
                title="image"
                type="file"
                ref={imgUpload}
                onChange={previewImage}
                name="image"
              />
              <span className={classes.imageHover}>Cambiar Imagen</span>
            </label>
          </div>
          <div className={classes.content}>
            <div className={classes.sku}>
              <div className={classes.col_1}>SKU</div>
              <div className={classes.col_2}>
                <input
                  type="text"
                  value={sku}
                  name="sku"
                  onChange={(event) => setSKU(event.target.value)}
                />
              </div>
            </div>
            
            <div className={classes.title}>
              <div className={classes.col_1}>Nombre de producto</div>
              <div className={classes.col_2}>
                <input
                  type="text"
                  value={title}
                  name="title"
                  onChange={(event) => setTitle(event.target.value)}
                />
              </div>
            </div>

            <div className={classes.description}>
              <div className={classes.col_1}>Descripcion</div>
              <div className={classes.col_2}>
                <textarea
                  value={descriptionContent}
                  onChange={(e) => setDescription(e.target.value)}
                  name="description"
                />
              </div>
            </div>
            <div className={classes.categories}>
              <div className={classes.col_1}>Categorias</div>
              <div className={classes.col_2}>
                <div className={classes.tags}>
                  {listCategories.map((category) => (
                    <Category
                      key={category.id}
                      category={category}
                      deleteC={deleteCategory(category.id)}
                    />
                  ))}
                </div>
                <span className={classes.add} onClick={selectCategory}>
                  <Add />
                </span>
              </div>
            </div>

            <div className={classes.categories}>
              <div className={classes.col_1}>Tags</div>
              <div className={classes.col_2}>
                <div className={classes.tags}>
                  {listTags.map((tag) => (
                    <Category
                      key={tag.id}
                      category={tag}
                      deleteC={deleteTag(tag.id)}
                    />
                  ))}
                </div>
                <span className={classes.add} onClick={selectTag}>
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
                    name="price"
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
                    name="stock"
                    onChange={(event) => setStock(event.target.value)}
                  />
                </span>
              </div>
            </div>

            <div className={classes.measures}>
              <div className={classes.col_1}>Medidas</div>
              <div className={`${classes.col_2} mx-h-45`}>
                <Measures measures={measures} updateMeasures={setMeasures} />
              </div>
            </div>
          </div>
        </div>
        <div className={classes.actions}>
          <button className={classes.save} onClick={() => {
            if(validate()) setShowConfirmation(true);
          }}>
            Guardar
          </button>
        </div>
        {openCategories && (
          <ModalCategories
            setCategories={addCategory}
            closeModal={() => setOpenCategories(false)}
            categories={listCategories}
            useCategories={validCategories}
          />
        )}

        {showErrors && (
          <ModalErrors
            closeModal={() => setShowErrors(false)}
            errors={errors}
          />
        )}

        {openTags && (
          <ModalTags
            setTags={addTag}
            closeModal={() => setOpenTags(false)}
            tags={listTags}
          />
        )}

        {showConfirmation && ( <ModalConfirmation
          messageModal={"¿Estás seguro de crear este nuevo producto?"}
          confirmResponse={handlerResponse}
          command={"CREATE"}
        /> )}
      </main>
    </div>
  );
};

const Wrapper = ({ validCategories }) => {
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
    <>
      <Header  name={viewer.name} lastname={viewer.lastname} handleLogout={handleLogout} />
      <Product validCategories={validCategories}/>
    </>
  );
}

export default Wrapper;

export const getServerSideProps: GetStaticProps = async (context) => {
  const validCategories = await (
    await fetch(
      `${
        process.env.API_HOST ? process.env.API_HOST : "http://localhost:5000"
      }/categories`
    )
  ).json();

  return {
    props: {
      validCategories,
    },
  };
};
