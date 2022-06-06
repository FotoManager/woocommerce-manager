import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import Edit from "./../../icons/edit";
import Trash from "./../../icons/trash";
import classes from "./measures.module.css";

const Measure: React.FC<{
  measure: any;
  editMeasure: any;
  id: any;
  selectMeasure?: any;
}> = ({ measure, editMeasure, id, selectMeasure }) => {
  return (
    <div
      className={classes.measure}
      onClick={() => {
        selectMeasure && selectMeasure(id);
      }}
    >
      <div className={classes.name}>
        <span>
          <strong>Medida: </strong>
          {measure}
        </span>
        {!selectMeasure && (
          <span className={classes.actions}>
            <span
              className={classes.edit}
              onClick={() => {
                editMeasure(id);
              }}
            >
              <Edit />
            </span>
            <span className={classes.remove} title="delete">
              <Trash />
            </span>
          </span>
        )}
      </div>
    </div>
  );
};

const Measures: React.FC<{
  measures: any[];
  updateMeasures?: any;
  selectMeasure?: any;
}> = ({ measures, updateMeasures, selectMeasure }) => {
  const [editingMeasure, setEditingMeasure] = useState(null);
  const [newPrice, setNewPrice] = useState(null);
  const [newQuantity, setNewQuantity] = useState(null);

  const list = useRef(null);

  const handleCollapse = () => {
    const element = list.current;
    element.classList.add(classes.collapse);
  };

  const handleCollapseClick = () => {
    const element = list.current;
    element.classList.toggle(classes.collapse);
  };

  const handleClose = () => {
    const element = list.current;
    element.classList.remove(classes.collapse);
  };

  const handleEditMeasure = useCallback((id) => {
    setEditingMeasure(measures[id]);
    setNewQuantity(getQuantity(measures[id]));
    setNewPrice(getPrice(measures[id]));
  }, []);

  const handleSelectMeasure = (id) => {
    selectMeasure && selectMeasure(id);
  };

  const handleCloseEditor = () => {
    setEditingMeasure(null);
    setNewPrice(null);
    setNewQuantity(null);
  };

  const handleSave = () => {
    let priceUpdated = "";
    const price = newPrice.split(",");
    const decimal = price[1] ? "," + price[1] : "";
    //Each 3 digits of newPrice assign a . to the string
    for (let i = 1; i <= price[0].length; i++) {
      priceUpdated = price[0][price[0].length - i] + priceUpdated;
      if (i % 3 === 0 && i !== price[0].length) {
        priceUpdated = "." + priceUpdated;
      }
    }
    const quantityMessage = newQuantity > 1 ? "Unidades" : "Unidad";

    const measureUpdated = `$${priceUpdated}${decimal} (${newQuantity} ${quantityMessage})`;
    //console.log(measureUpdated);
    const updatedData = measures.map((measure) =>
      measure === editingMeasure ? measureUpdated : measure
    );
    //console.log(updatedData);
    updateMeasures && updateMeasures(updatedData);
    handleCloseEditor();
  };

  const getPrice = (measure) => {
    //I have a string $price ($quantity UNIT)
    const price = measure.split(" ")[0];
    return price.replace("$", "").replace(".", "");
  };

  const getQuantity = (measure) => {
    //I have a string $price ($quantity UNIT)
    const quantity = measure.split(" ")[1];
    return quantity.replace("(", "");
  };

  return (
    <>
      <div className={`${classes.measures} `}>
        <div
          className={`${
            measures && measures.length > 0 ? classes.container : ""
          } mx-h-45`}
          ref={list}
          onMouseOver={handleCollapse}
          onMouseLeave={handleClose}
          onClick={handleCollapseClick}
        >
          {measures &&
            measures.map((measure, index) => (
              <Measure
                measure={measure}
                key={index}
                id={index}
                editMeasure={handleEditMeasure}
                selectMeasure={handleSelectMeasure}
              />
            ))}
        </div>
      </div>
      {editingMeasure && (
        <div className={classes.modal_editor}>
          <div className={classes.modal_content}>
            <div className={classes.modal_header}>
              <div className={classes.modal_title}>Editar medida</div>
            </div>
            <div className={classes.modal_body}>
              <label className={classes.input}>
                <input
                  type="number"
                  step={"0.1"}
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                />
              </label>
              <label className={classes.input}>
                <input
                  type="number"
                  min="1"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(e.target.value)}
                />
              </label>
            </div>
            <div className={classes.modal_actions}>
              <button className={classes.save} onClick={handleSave}>
                Guardar
              </button>
              <button className={classes.cancel} onClick={handleCloseEditor}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Measures;
