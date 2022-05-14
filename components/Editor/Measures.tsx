import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Edit from "./../../icons/edit";
import Trash from "./../../icons/trash";
import classes from "./measures.module.css";

const Measure = ({ measure }) => {

  return (
    <div className={classes.measure}>
      <div className={classes.name}>
        <span><strong>Medida: </strong>{measure}</span>
       <span className={classes.actions}>
            <span className={classes.edit}><Edit /></span>
            <span className={classes.remove}title="delete"><Trash /></span>
        </span> 
      </div>
    </div>
  );
};

const Measures = ({ measures }) => {
  const [data, setData] = useState(measures);
  const list = useRef(null)

  const handleCollapse = () => {
    const element =  list.current;
    element.classList.add(classes.collapse);
  }

  const handleCollapseClick = () => {
    const element =  list.current;
    element.classList.toggle(classes.collapse);
  }

  const handleClose = () => {
    const element =  list.current;
    element.classList.remove(classes.collapse);
  }

  return (
    <>
      <div className={`${classes.measures} `} >
        <div className={`${data && data.length > 0 ? classes.container : ''} mx-h-45`} ref={list} onMouseOver={handleCollapse} onMouseLeave={handleClose} onClick={handleCollapseClick}>
            {data.map((measure) => (
                <Measure measure={measure} key={measure.id} />
            ))}
        </div> 
      </div>
    </>
  );
};


export default Measures;