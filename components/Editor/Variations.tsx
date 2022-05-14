import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Edit from "./../../icons/edit";
import Trash from "./../../icons/trash";
import classes from "./variations.module.css";
import { ROUTES } from "./../../config";

const Variation = ({ variation }) => {
    const router = useRouter();

    const doZoom = (event) => {
    event.preventDefault();
    const element = document.getElementById("zoom");
    element.innerHTML = `<img src="${variation.image.src}" alt="${variation.id}"/>`;
    element.style.opacity = "1";
    element.style.maxHeight = "150px";
    element.style.transition = "all .3s";
    const { top, height } = event.target.getBoundingClientRect()
    element.style.top = `${top - 3.5*height}px`;
  };

  const dontZoom = (event) => {
    event.preventDefault();
    const element = document.getElementById("zoom");
    element.innerHTML = ``;
    element.style.opacity = "0";
    element.style.maxHeight = "0px";
    element.style.transition = "all .3s";
  };

  return (
    <div className={classes.variation}>
      <div className={classes.image}>
        <img
          src={variation.image.src}
          alt={variation.id}
          onMouseOver={doZoom}
          onMouseLeave={dontZoom}
        />
      </div>
      <div className={classes.name}>
        <span><strong>Serie: </strong>{variation.sku}</span>
        <span><strong>Stock: </strong>{variation.stock_quantity}</span>
       <span className={classes.actions}>
            <span className={classes.edit} onClick={() => router.push(`/product/${variation.id}`)}><Edit /></span>
            <span className={classes.remove}title="delete"><Trash /></span>
        </span> 
      </div>
    </div>
  );
};

const Variations = ({ parentId }) => {
  const [data, setData] = useState([]);
  const list = useRef(null)

  useEffect(() => {
    fetch(`${ROUTES.API_HOST}/product/variations/${parentId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //cors
        "Access-Control-Allow-Origin": "*",

      }
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data)
      });
  }, [parentId]);

  const handleCollapse = () => {
    const element =  list.current;
    element.classList.add(classes.collapse);
  }

  const handleClose = () => {
    const element =  list.current;
    element.classList.remove(classes.collapse);
  }

  return (
    <>
      <div id="zoom" className={classes.zoom}></div>
      <div className={`${classes.variations} `} >
        <div className={`${data.length > 0 ? classes.container : ''} mx-h-45`} ref={list} onMouseOver={handleCollapse} onMouseLeave={handleClose}>
            
            {data.reverse().map((variation) => (
                <Variation variation={variation} key={variation.id} />
            ))}
        </div> 
      </div>
    </>
  );
};


export default Variations;