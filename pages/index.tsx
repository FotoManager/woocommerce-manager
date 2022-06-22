/* eslint-disable react-hooks/exhaustive-deps */
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useEffect, useState, useMemo } from "react";
import { getProducts } from "./api/helpers/api";
import Products from "../components/Products/Products";
import Search from "../components/Search/Search";
import LoaderPage from "../components/loader/LoaderPage";
import useSWRInfinite from 'swr/infinite'
import { SWRConfig } from "swr";
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

  const response = await (await getProducts(url)).json();
  const { body } = response;

  const products = JSON.parse(body);

  return products;
}

const getKey = (pageIndex, previousPageData) => {
  if (previousPageData && !previousPageData.length) return null 
  return `${pageIndex + 1}`;
}

function Inventory({ perPage , actions }){

  const [search, setSearch] = useState("");
  const { data, size, setSize, isValidating } = useSWRInfinite(getKey, fetcher);
  const { viewer, handleLogout } = actions;

  if (!data || data.length == 0) return <LoaderPage text="Cargando" />;

  const isLoadingInitialData = !data;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < perPage);
  const isRefreshing = isValidating && data && data.length === size;

  return (
    <div className={styles.container}>
      <Head>
        <title>Products</title>
      </Head>

      <main className={styles.main}>
        <Header  name={viewer.name} lastname={viewer.lastname} handleLogout={handleLogout} />
        <Search updateSearch={(search) => setSearch(search)} />
        <Products data={data} />
        { !isReachingEnd && <button onClick={() => setSize(size + 1)} className={styles.button}>{ isLoadingMore ? "Cargando" : "Mostrar más" }</button> }
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
      <Inventory perPage={perPage} actions={{ handleLogout, viewer }} />
    </SWRConfig>)
}

export const getStaticProps = async () => {
  const response = await (await getProducts()).json();
  const { body, headers } = response;
  // const totalPages = headers["x-wp-totalpages"];

  const products = JSON.parse(body);
  const perPage = 50;

  return {
    props: {
      fallback: {
        inventory: products,
      },
      perPage
    }
  };
};
