/* eslint-disable react-hooks/rules-of-hooks */
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import classes from "./../../../styles/product.module.css";
import { useRef, useState, Suspense } from "react";
import Add from "../../../icons/add";
import Category from "../../../components/Editor/Category";
import ModalCategories from "../../../components/Editor/ModalCategories";
import { createVariation } from "../../api/helpers/api";
//import Variations from "../../components/Editor/Variations";
import Measures from "../../../components/Editor/Measures";
import Checkbox from "../../../components/Editor/Checkbox";
import LoaderPage from "../../../components/loader/LoaderPage";
import ModalErrors from "../../../components/Editor/ModalErrors";
import ModalConfirmation from "../../../components/Confirmation/Confirmation";

const Product = ({ validCategories, attributes }) => {
  if (!validCategories) return <LoaderPage text={"Cargando"} />;

  const { options } = attributes[0] || {};

  const [priceValue, setPriceValue] = useState("");
  const [title, setTitle] = useState("");
  const [stock, setStock] = useState("");
  const [descriptionContent, setDescription] = useState("");
  const [listCategories, setListCategories] = useState([]);
  const [openCategories, setOpenCategories] = useState(false);
  const [onSale, setOnSale] = useState(false);
  const [measures, setMeasures] = useState(options);
  const imgUpload = useRef(null);
  const [img, setImg] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const router = useRouter();

  const previewImage = () => {
    const oFReader = new FileReader();
    oFReader.readAsDataURL(imgUpload.current.files[0]);
    oFReader.onload = function (oFREvent) {
      setImg(oFREvent.target.result as string);
    };
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
    if (!priceValue) errors["price"] = "El precio es requerido";
    if (!stock) errors["stock"] = "El stock es requerido";
    if (!descriptionContent) errors["description"] = "La descripcion es requerida";
    if (!listCategories.length) errors["categories"] = "Las categorias son requeridas";
    if (!measures.length) errors["measures"] = "Las medidas son requeridas";

    setErrors(errors);
    if (Object.keys(errors).length) setShowErrors(true);
    return Object.keys(errors).length === 0;
  }

  const handleSave = () => {
    if(!validate()) return;
    let parentId = router.query.id;

    if(typeof parentId === "object")  parentId = parentId[0];

    const createdProduct = new FormData();
    createdProduct.append("name", title);
    createdProduct.append("categories", JSON.stringify(listCategories));
    createdProduct.append("regular_price", priceValue);
    createdProduct.append("on_stock", onSale.toString());
    createdProduct.append("stock_quantity", stock);
    createdProduct.append("manage_stock", "true");
    createdProduct.append("description", descriptionContent);
    createdProduct.append("attributes", JSON.stringify([{
      id: 0,
      name: "Cantidad",
      option: measures[0] || "",
    }]));

    if (img !== "") createdProduct.append("images", imgUpload.current.files[0]);

    setLoading(true);

    createVariation(createdProduct, parentId ).then((res) => {
      setLoading(false);
      setShowConfirmation(false);
    });
  };

  const handlerResponse = (response: boolean) => {
    return response ? handleSave() : setShowConfirmation(false);
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

  if (loading) return <LoaderPage text={"Creando producto"} />;

  return (
    <div className={classes.container}>
      <main className={classes.main}>
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
                <Measures measures={measures} updateMeasures={setMeasures} selectMeasure={selectMeasure}/>
              </div>
            </div>
          </div>
        </div>
        <div className={classes.actions}>
          <button className={classes.save} onClick={() => {
            setShowConfirmation(true);
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

        {showConfirmation && ( <ModalConfirmation
          messageModal={"¿Estás seguro de crear este nuevo producto?"}
          confirmResponse={handlerResponse}
        /> )}
      </main>
    </div>
  );
};

export default Product;

export const getServerSideProps: GetStaticProps = async (context) => {
  const { id } = context.params;

  const validCategories = await (
    await fetch(
      `${
        process.env.API_HOST ? process.env.API_HOST : "http://localhost:5000"
      }/categories`
    )
  ).json();

  const attributes = await (
    await fetch(
      `${
        process.env.API_HOST ? process.env.API_HOST : "http://localhost:5000"
      }/product/attributes/${id}`
    )
  ).json();

  return {
    props: {
      validCategories,
      attributes
    },
  };
};
