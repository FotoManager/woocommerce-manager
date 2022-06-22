import Add from "../../icons/add";
import styles from "../../styles/Tags.module.css";
import { useState, useRef, useEffect } from "react";
import Trash from "../../icons/trash";

const Tags = ({ data, handleNewTag, handleDeleteTag, loadMore, isEnd, isLoadingMore }) => {

    const [newTag, setNewTag] = useState("");
    const table = useRef(null);

    useEffect(() => {

        if(isEnd || !table) return;

        const event = () => {
            if ( table.current.scrollTop + table.current.clientHeight >= table.current.scrollHeight ) {
                loadMore();
            }
        }

        table.current.addEventListener("scroll", event, { passive: true });

        return () => {
            table.current.removeEventListener("scroll", event);
        }
    }, [loadMore, table, isEnd]);

    return (
        <div className={styles.tagsContainer}>
            <h2>Tags</h2>
            <div className={styles.tags}>
                <div className={styles.body} ref={table}>
                    {
                        data.map(tags => (
                            tags.map((tag, index) => (
                                <div key={index} className={styles.tag}>
                                    <div className={styles.tagName}>{tag.name}</div>
                                    <div className={styles.tagActions}>
                                        <button title={"delete"} className={styles.icon} onClick={() => handleDeleteTag(tag.id)}>
                                            <Trash />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ))
                    }
                </div>
                <div className={styles.addTag}>
                    <input type="text" placeholder="Agregar tag" className={styles.input} value={newTag} 
                        onChange={(e) => setNewTag(e.target.value)}
                    />
                    <button className={styles.action} onClick={() => {
                        handleNewTag(newTag);
                        setNewTag("");
                    }}>
                        <Add /> <span>Agregar</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Tags;