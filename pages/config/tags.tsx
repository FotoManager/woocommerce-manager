/* eslint-disable react-hooks/exhaustive-deps */
import Head from "next/head";
import Image from "next/image";
import styles from "../../styles/Tags.module.css";
import { useEffect } from "react";
import { createTag, deleteTag, getTags } from "./../api/helpers/api";
import LoaderPage from "../../components/loader/LoaderPage";
import useSWRInfinite from 'swr/infinite'
import { useQuery, gql, useMutation, useApolloClient } from "@apollo/client";
import { useRouter } from "next/router";
import Header from "../../components/Header/Header";
import TagsTable from "../../components/Tags/Tags";

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

const fetcher = async (url) => {
  const response = await (await getTags( url )).json();
  const { body } = response;

  const tags = JSON.parse(body);

  return tags;
};

const getKey = (pageIndex, previousPageData) => {
  if (previousPageData && !previousPageData.length) return null 
  return `${pageIndex + 1}`;
}

const PER_PAGE = 20;

function Tags({ actions }) {

  const { data, size, setSize, isValidating, mutate } = useSWRInfinite(getKey, fetcher);
  
  const { viewer, handleLogout } = actions;
  if (!data || data.length == 0) return <LoaderPage text="Cargando" />;
  
  const handleDeleteTag = (id) => {
    deleteTag(id).then(() => {
        mutate();
    })
  };

  const handleNewTag = (newTag) => {
    const createdTag = new FormData();
    createdTag.append("name", newTag);
    createTag(createdTag).then((res) => {
      mutate();
    });
  };
  
  const isLoadingInitialData = !data;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === "undefined");
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < PER_PAGE);
  const isRefreshing = isValidating && data && data.length === size;

  return (
    <div className={styles.container}>
      <Head>
        <title>Tags</title>
      </Head>

      <main className={styles.main}>
        <Header
          name={viewer.name}
          lastname={viewer.lastname}
          handleLogout={handleLogout}
        />
        <TagsTable
          data={data}
          handleDeleteTag={handleDeleteTag}
          handleNewTag={handleNewTag}
          loadMore = { () => setSize(size + 1)}
          isEnd={isReachingEnd}
          isLoadingMore={isLoadingMore}
        />
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

export default function Home({}) {
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

  return <Tags actions={{ viewer, handleLogout }} />;
}
