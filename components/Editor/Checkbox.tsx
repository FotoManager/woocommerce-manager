import classes from "./checkbox.module.css";

export default function Checkbox({ state, updateState }){

    return (
        <div className={classes.checkbox}>
            <div className={classes.checkbox_input}>
                <label htmlFor="sale">
                    <input type="checkbox" checked={state} onChange={updateState} name="sale" title="sale"/>
                    <span className={classes.checkbox_button}>
                        <span>Si</span>
                        <span>No</span>
                    </span>
                </label>
            </div>
        </div>
    )
}