import classes from "./confirmation.module.css";
import { useState } from "react";

const ModalConfirmation = ({  messageModal, confirmResponse, command }) => {
    const [text, setText] = useState("");
    const [error, setError] = useState("");

    const verifyCommand = () => {
        if(command === text)
            confirmResponse(true);
        else
            setError("Debes escribir el comando correcto: " + command);
    }

    return (
        <div className={classes.modal} id="modal-errors">
            <span className={classes.backdrop} />
            <div className={classes.modal_content}>
                <div className={classes.modal_header}>
                  <h2>Confirmación</h2>
                </div>
                <div className={classes.modal_body}>
                    {messageModal}
                    <div className={classes.modal_input}>
                        <div className={classes.msg_command}>
                            <span>Escribe el comando: </span> <span className={classes.command}>{command}</span>
                        </div>
                        <input
                            type="text"
                            name="command"
                            title=""
                            required={true}
                            placeholder="Command"
                            value={text}
                            onChange={(e) => { 
                                setText(e.target.value)
                                if(error) setError("")
                            }}
                        />
                        {
                            error && (
                                <div className={classes.error}>
                                    {error}
                                </div>
                            )
                        }
                    </div>
                </div>
                <div className={classes.modal_footer}>
                <button className={classes.button} onClick={verifyCommand}>Aceptar</button>
                <button className={classes.button} onClick={() => {
                    confirmResponse(false);
                }}>Cancelar</button>
                </div>
            </div>
        </div>
    )

}

export default ModalConfirmation;