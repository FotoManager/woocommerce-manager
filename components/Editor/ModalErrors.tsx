import classes from "./modal.module.css";

const ModalCategories = ({ errors, closeModal }) => {
    if(!errors) return <p>Loading...</p>;
    const errorsList = Object.entries(errors);

    return (
        <div className={classes.modal} id="modal-errors">
            <span className={classes.backdrop} />
            <div className={classes.modal_content}>
                <div className={classes.modal_header}>
                    <h2>Alerta</h2>
                    <span>Los siguientes errores deben ser solucionados para poder crear el producto.</span>
                </div>
                <div className={classes.modal_body}>
                    <div className={classes.errors}>
                        {
                            errorsList.map(error => {
                                return (
                                    <div key={error[0]} className={classes.error}>
                                        <span>{(error[1] as string).toUpperCase()}</span>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className={classes.modal_footer}>
                    <button className={classes.button} onClick={closeModal}>Cerrar</button>
                </div>
            </div>
        </div>
    )

}

export default ModalCategories;