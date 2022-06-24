import classes from "./modalTags.module.css";

import { useRef, useEffect, useState } from "react";
import { getTags } from "../../pages/api/helpers/api";
import useSWRInfinite from "swr/infinite";

const fetcher = async (url) => {
  const response = await (await getTags(url.page, url.search)).json();
  const { body } = response;

  const tags = JSON.parse(body);

  return tags;
};

const getKey = (search) => (pageIndex, previousPageData) => {
  if (previousPageData && !previousPageData.length) return null;
  return { page: pageIndex + 1, search};
};

const PER_PAGE = 20;

const ModalTags = ({ tags, setTags, closeModal }) => {
  const [filter, setFilter] = useState("")
  const [search, setSearch] = useState("")
  const table = useRef(null);
  const { data, size, setSize, isValidating, mutate } = useSWRInfinite(
    getKey(search),
    fetcher
  );

  useEffect(() => {
    const isEmpty = data?.[0]?.length === 0;
    const isReachingEnd =
      isEmpty || (data && data[data.length - 1]?.length < PER_PAGE);

    if (isReachingEnd || !table.current) return;

    const event = () => {
      if (
        table.current.scrollTop + table.current.clientHeight >=
        table.current.scrollHeight
      ) {
        setSize(size + 1);
      }
    };

    table.current.addEventListener("scroll", event, { passive: true });

    return () => {
      if(table.current) 
        table.current.removeEventListener("scroll", event);
    };
  }, [table, size]);

  if (!data) return null;

  const useTags = data ? [].concat(...data) : [];

  const tagsList = useTags
    ? [...useTags.filter((tag) => !tags.includes(tag))]
    : [];

  const handleFilter = () => {
    setSearch(filter);
    setFilter("");
  }

  return (
    <div className={classes.modal} id="modal-tags">
      <span className={classes.backdrop} />
      <div className={classes.modal_content}>
        <div className={classes.modal_header}>
          <h2>Tags</h2>
        </div>
        <div className={classes.modal_body}>
          <div className={classes.filter}>
            <input
              type="text"
              placeholder="Buscar"
              className={classes.input}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <button className={classes.action} onClick={handleFilter}>Buscar</button>
          </div>
          <div className={classes.tags} ref={table}>
            {tagsList.map((tag) => {
              return (
                <div
                  key={tag.id}
                  className={classes.tag}
                  onClick={() => setTags(tag)}
                >
                  <span>{tag.name.toUpperCase()}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className={classes.modal_footer}>
          <button className={classes.button} onClick={closeModal}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalTags;
