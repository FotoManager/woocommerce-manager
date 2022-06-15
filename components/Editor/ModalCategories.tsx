import classes from "./modal.module.css";

const ModalCategories = ({
  categories,
  setCategories,
  closeModal,
  useCategories,
}) => {
  if (!useCategories) return <p>Loading...</p>;
  const categoriesList = [
    ...useCategories.filter((category) => !categories.includes(category)),
    { id: 101, name: "SurtiCentro", slug: "surticentro" },
  ];

  return (
    <div className={classes.modal} id="modal-categories">
      <span className={classes.backdrop} />
      <div className={classes.modal_content}>
        <div className={classes.modal_header}>
          <h2>Categorías</h2>
        </div>
        <div className={classes.modal_body}>
          <div className={classes.categories}>
            {categoriesList.map((category) => {
              return (
                <div
                  key={category.id}
                  className={classes.category}
                  onClick={() => setCategories(category)}
                >
                  <span>{category.name.toUpperCase()}</span>
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

export default ModalCategories;
