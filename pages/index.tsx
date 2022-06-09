/* eslint-disable react-hooks/exhaustive-deps */
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useEffect, useState, useMemo } from "react";
import { getAllProducts } from "./api/helpers/api";
import Products from "../components/Products/Products";
import Search from "../components/Search/Search";
import LoaderPage from "../components/loader/LoaderPage";

export default function Home({ data, size, perPage }) {
  const [products, setProducts] = useState(null);
  const [productsPerPage, setProductsPerPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [maxSize, setMaxSize] = useState(size);

  const searchedProducts = useMemo(() => {
    const productsData = !products ? data : products;
    
    if (search === "")
      return [
        ...productsData.slice(
          (currentPage - 1) * perPage,
          Math.min(maxSize, perPage * currentPage)
        ),
      ];
    return productsData.filter((product) => {
      return (
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.id.toString().includes(search)
      );
    });
  }, [data, search, products]);

  
  useEffect(() => {
    const loadData = async () => {
      const productsPromises = await getAllProducts();
      const data = (await Promise.all(productsPromises)).map((product) => {
        return JSON.parse(product.body);
      });

      const productsData = data.reduce((acc, curr) => {
        return acc.concat(curr);
      }, []);

      const maxSize = productsData.length
      
      if(products){
        setMaxSize(maxSize);
        setProducts([
          ...productsData.slice(
            (currentPage - 1) * perPage,
            Math.min(maxSize, perPage * currentPage)
          ),
        ]);
      }
    };

    loadData();
  }, []);

  if (!data || data.length == 0) return <LoaderPage text="Cargando" />;

  return (
    <div className={styles.container}>
      <Head>
        <title>Products</title>
      </Head>

      <main className={styles.main}>
        <Search updateSearch={(search) => setSearch(search)} />
        <Products products={searchedProducts} />
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}

// export const getServerSideProps = async () => {
//   const productsPromises = await getAllProducts();
//   const data = (await Promise.all(productsPromises)).map( product => {
//       return JSON.parse(product.body);
//   } );

//   const products = data.reduce((acc, curr) => {
//     return acc.concat(curr);
//   }, []);

//   const maxSize = products.length;
//   const perPage = 12;

//   return {
//     props: {
//       data: products,
//       maxSize,
//       perPage,
//     },
//   };
// };

export const getStaticProps = async () => {
  const productsPromises = await getAllProducts();
  const data = (await Promise.all(productsPromises)).map( product => {
      return JSON.parse(product.body);
  } );

  const products = data.reduce((acc, curr) => {
    return acc.concat(curr);
  }, []);

  const size = products.length;
  const perPage = 12;

  return {
    props: {
      data: products,
      size,
      perPage,
    }
  };
};
