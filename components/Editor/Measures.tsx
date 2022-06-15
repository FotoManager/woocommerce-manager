import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import Edit from "./../../icons/edit";
import Trash from "./../../icons/trash";
import classes from "./measures.module.css";
import Add from "../../icons/add";

const Measure: React.FC<{
  measure: any;
  editMeasure: any;
  id: any;
  selectMeasure?: any;
  deleteMeasure?: any;
}> = ({ measure, editMeasure, id, selectMeasure, deleteMeasure }) => {
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
        {selectMeasure && (
          <span className={classes.actions}>
            <span
              className={classes.edit}
              onClick={() => {
                editMeasure(id);
              }}
            >
              <Edit />
            </span>
            <span className={classes.remove} title="delete" onClick={() => { deleteMeasure(id) }}>
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
  const [id, setId] = useState("");
  const [editingMeasure, setEditingMeasure] = useState("");
  const [newValue, setNewValue] = useState("");

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

  const handleEditMeasure = (id) => {
    
    setId(measures[id]);
    setEditingMeasure("true");
    setNewValue(measures[id]);
    
  };

  const handleSelectMeasure = (id) => {
    selectMeasure && selectMeasure(id);
  };

  const handleCloseEditor = () => {
    setEditingMeasure(null);
    setNewValue(null);
  };

  const handleSave = () => {
    const measureUpdated =  newValue;
    //console.log(measureUpdated);
    let updatedData = [];

    if (id) {
      updatedData = measures.map((measure, index) =>
        measure === id ? measureUpdated : measure
      );
    } else {
      updatedData = [...measures, measureUpdated];
    }
    //console.log(updatedData);
    updateMeasures && updateMeasures(updatedData);
    handleCloseEditor();
  };

  const getPrice = (measure) => {
    //I have a string $price ($quantity UNIT)
    const price = measure.split(" ")[0];
    return price.replace("$", "").replace(".", "");
  };

  const handleDeleteMeasure = (id) => {
    let updatedData = [];
    updatedData = measures.filter((measure) => measure !== measures[id]);
    updateMeasures && updateMeasures(updatedData);
  }

  const getQuantity = (measure) => {
    //I have a string $price ($quantity UNIT)
    const quantity = measure.split(" ")[1];
    return quantity.replace("(", "");
  };

  const handleAdd = () => {
    setEditingMeasure("true");
  };

  return (
    <>
      <div className={`${classes.measures} `}>
        <div
          className={`${classes.container} mx-h-45`}
          ref={list}
          onMouseOver={handleCollapse}
          onMouseLeave={handleClose}
          onClick={handleCollapseClick}
        >
          {measures &&
            measures.map((measure, index) => (
              <Measure
                measure={measure}
                key={measures.length - index - 1}
                id={index}
                editMeasure={handleEditMeasure}
                selectMeasure={handleSelectMeasure}
                deleteMeasure={handleDeleteMeasure}
              />
            ))}

          <div className={classes.add_measure} key={-1}>
            <span>Agregar medida</span>
            <button className={classes.add} title="add" onClick={handleAdd}>
              <Add />
            </button>
          </div>
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
                  type="text"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
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
