/* eslint-disable react-hooks/rules-of-hooks */
import { GetStaticProps } from "next";
import dynamic from "next/dynamic";
import classes from "./../../styles/product.module.css";
import { useRef, useState, Suspense, useEffect } from "react";
import Add from "../../icons/add";
import Category from "../../components/Editor/Category";
import ModalCategories from "../../components/Editor/ModalCategories";
import ModalTags from "../../components/Editor/ModalTags";
import { deleteProduct, updateProduct } from "./../api/helpers/api";
//import Variations from "../../components/Editor/Variations";
import Measures from "../../components/Editor/Measures";
import Checkbox from "../../components/Editor/Checkbox";
import LoaderPage from "../../components/loader/LoaderPage";
import ModalConfirmation from "../../components/Confirmation/Confirmation";
import { useQuery, gql, useMutation, useApolloClient } from "@apollo/client";
import { useRouter } from "next/router";
import Header from "../../components/Header/Header";

//Lazy import of Variations
const Variations = dynamic(() => import("../../components/Editor/Variations"));

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
  mutation SignOutMutation {
    signOut
  }
`;

const Product = ({ product, validCategories }) => {
  if (!product || !product.found) return <LoaderPage text={"Buscando"} />;

  const router = useRouter();

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
    tags
  } = product;

  const { options } = attributes[0] || {};

  const [priceValue, setPriceValue] = useState(price);
  const [title, setTitle] = useState(name);
  const [stock, setStock] = useState(stock_quantity);
  const [descriptionContent, setDescription] = useState(description);
  const [listCategories, setListCategories] = useState(categories);
  const [openCategories, setOpenCategories] = useState(false);
  const [listTags, setListTags] = useState(tags);
  const [openTags, setOpenTags] = useState(false);
  const [onSale, setOnSale] = useState(on_sale);
  const [measures, setMeasures] = useState(options);
  const imgUpload = useRef(null);
  const [img, setImg] = useState(images[0].src || "");
  const [loading, setLoading] = useState(false);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

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
    console.log(product);
    setOnSale(!onSale);
  };

  const handleSave = () => {
    const updatedProduct = new FormData();
    updatedProduct.append("id", id);
    updatedProduct.append("name", title);
    updatedProduct.append("categories", JSON.stringify(listCategories));
    updatedProduct.append("tags", JSON.stringify(listTags));
    updatedProduct.append("regular_price", priceValue);
    updatedProduct.append("price", priceValue);
    updatedProduct.append("sale_price", priceValue);
    updatedProduct.append("on_stock", onSale);
    updatedProduct.append("stock_quantity", stock);
    updatedProduct.append("description", descriptionContent);
    updatedProduct.append(
      "type",
      measures.length === 0 ? "simple" : "variable"
    );

    if (measures.length > 0) {
      console.log("measures", measures);
      updatedProduct.append(
        "attributes",
        JSON.stringify([
          {
            id: 0,
            name: "Cantidad",
            options: measures,
            position: 0,
            variation: true,
            visible: true,
          },
        ])
      );
    }
    if (img !== images[0].src)
      updatedProduct.append("images", imgUpload.current.files[0]);

    setLoading(true);
    updateProduct(updatedProduct, id).then(() => {
      setLoading(false);
      setShowSaveConfirmation(false);
    });
  };

  const handlerResponse = (response: boolean) => {
    return response ? handleSave() : setShowSaveConfirmation(false);
  };

  const handleDeleteProduct = () => {
    deleteProduct(id).then(() => {
      setShowDeleteConfirmation(false);
      router.push("/", null, { shallow: true });
    });
  }

  const handlerDelete = (response: boolean) => {
    return response ? handleDeleteProduct() : setShowSaveConfirmation(false);
  };

  if (loading) return <LoaderPage text={"Actualizando"} />;

  return (
    <div className={classes.container}>
      <main className={classes.main}>
        <div className={classes.product}>
          <div className={classes.image}>
            <img src={img} alt={id} />
            <label className={classes.fileReader}>
              <input
                title="image"
                type="file"
                ref={imgUpload}
                onChange={previewImage}
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
                <Measures
                  measures={measures || []}
                  updateMeasures={setMeasures}
                />
              </div>
            </div>

            <div className={classes.variations}>
              <div className={classes.col_1}>Variaciones</div>
              <div className={`${classes.col_2} mx-h-45`}>
                <Suspense>
                  <Variations parentId={id} />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
        <div className={classes.actions}>
        <button
            className={classes.save}
            onClick={() => {
              setShowSaveConfirmation(true);
            }}
          >
            Guardar
          </button>
          <button
            className={classes.save}
            onClick={() => {
              setShowDeleteConfirmation(true);
            }}
          >
            Eliminar
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
        {openTags && (
          <ModalTags
            setTags={addTag}
            closeModal={() => setOpenTags(false)}
            tags={listTags}
          />
        )}
        {showSaveConfirmation && (
          <ModalConfirmation
            messageModal={"¿Estás seguro de actualizar este producto?"}
            confirmResponse={handlerResponse}
            command={"UPDATE"}
          />
        )}
        {showDeleteConfirmation && (
          <ModalConfirmation
            messageModal={"¿Estás seguro de eliminar PERMANENTEMENTE este producto?"}
            confirmResponse={handlerDelete}
            command={"DELETE"}
          />
        )}
      </main>
    </div>
  );
};

const Wrapper = ({ product, validCategories }) => {
  const { data, loading, error } = useQuery(ViewerQuery);
  const { viewer } = data || {};
  const shouldRedirect = !(loading || error || viewer);
  const client = useApolloClient();
  const router = useRouter();
  const [signOut] = useMutation(SignOutMutation);

  useEffect(() => {
    if (shouldRedirect) {
      router.push("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  if (loading || !viewer) {
    return <LoaderPage text={"Cargando"} />;
  }

  const handleLogout = async () => {
    try {
      signOut().then(() => {
        client.resetStore().then(() => {
          router.push("/login");
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Header
        name={viewer.name}
        lastname={viewer.lastname}
        handleLogout={handleLogout}
      />
      <Product validCategories={validCategories} product={product}/>
    </>
  );
};

export default Wrapper;

export const getServerSideProps: GetStaticProps = async (context) => {
  const { id } = context.params;

  const product = await (
    await fetch(
      `${
        process.env.API_HOST ? process.env.API_HOST : "http://localhost:5000"
      }/product/${id}`
    )
  ).json();
  const validCategories = await (
    await fetch(
      `${
        process.env.API_HOST ? process.env.API_HOST : "http://localhost:5000"
      }/categories`
    )
  ).json();

  return {
    props: {
      product: { found: product !== undefined, ...product },
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
