import classes from "./confirmation.module.css";

const ModalConfirmation = ({  messageModal, confirmResponse }) => {

    return (
        <div className={classes.modal} id="modal-errors">
            <span className={classes.backdrop} />
            <div className={classes.modal_content}>
                <div className={classes.modal_header}>
                  <h2>Confirmación</h2>
                </div>
                <div className={classes.modal_body}>
                    {messageModal}
                </div>
                <div className={classes.modal_footer}>
                <button className={classes.button} onClick={() => {
                    confirmResponse(true);
                }}>Aceptar</button>
                <button className={classes.button} onClick={() => {
                    confirmResponse(false);
                }}>Cancelar</button>
                </div>
            </div>
        </div>
    )

}

export default ModalConfirmation;