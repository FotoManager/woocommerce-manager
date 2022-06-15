/* eslint-disable react-hooks/exhaustive-deps */
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useEffect, useState, useMemo } from "react";
import { getAllProducts } from "./api/helpers/api";
import Products from "../components/Products/Products";
import Search from "../components/Search/Search";
import LoaderPage from "../components/loader/LoaderPage";
import useSWR, { SWRConfig } from "swr";
import { useQuery, gql, useMutation, useApolloClient } from "@apollo/client";
import { useRouter } from "next/router";
import Header from "../components/Header/Header";

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

const fetcher = async (url) => {
  const productsPromises = await getAllProducts();
  const data = (await Promise.all(productsPromises)).map( product => {
      return JSON.parse(product.body);
  } );

  const products = data.reduce((acc, curr) => {
    return acc.concat(curr);
  }, []);

  return products;
}

function Inventory({ perPage , actions }){

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data, error } = useSWR("/api/products/all", fetcher);
  const { viewer, handleLogout } = actions;

  const searchedProducts = useMemo(() => {
    if(!data) return [];

    if (search === "")
      return [
        ...data.slice(
          (currentPage - 1) * perPage,
          Math.min(data.length, perPage * currentPage)
        ),
      ];
    return data.filter((product) => {
      return (
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.id.toString().includes(search)
      );
    });
  }, [data, search]);

  if (!data || data.length == 0) return <LoaderPage text="Cargando" />;

  return (
    <div className={styles.container}>
      <Head>
        <title>Products</title>
      </Head>

      <main className={styles.main}>
        <Header  name={viewer.name} lastname={viewer.lastname} handleLogout={handleLogout} />
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

export default function Home({ fallback, perPage }) {

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
    <SWRConfig value={{ fallback }}>
      <Inventory perPage={perPage} actions={{ handleLogout, viewer }}/>
    </SWRConfig>)
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

  const perPage = 12;

  return {
    props: {
      fallback: {
        inventory: products,
      },
      perPage,
    }
  };
};
