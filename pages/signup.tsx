import { Fragment, useEffect } from "react";
import Head from "next/head";
import classes from "./../styles/Signup.module.css";
import { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client";
import { getErrorMessage } from "../lib/form";
import LoaderPage from "../components/loader/LoaderPage";
import Header from "../components/Header/Header";

const ViewerQuery = gql`
  query ViewerQuery {
    viewer {
      username
      name
      lastname
    }
  }
`;

const SignOutMutation = gql`
  mutation SignOutMutation{
    signOut
  }
`;

const SignUpMutation = gql`
  mutation SignUpMutation(
    $username: String!
    $password: String!
    $name: String!
    $lastname: String!
  ) {
    signUp(
      input: {
        username: $username
        password: $password
        lastname: $lastname
        name: $name
      }
    ) {
      user {
        username
        name
        lastname
      }
    }
  }
`;

interface ErrorMessage {
  name?: string;
  lastname?: string;
  username?: string;
  password?: string;
  response?: string;
}

function SignUp({ viewer, handleLogout }) {
  const [signUp] = useMutation(SignUpMutation);
  const [errorMsg, setErrorMsg] = useState<ErrorMessage>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const currentTarget = event.currentTarget as HTMLFormElement;
    const { elements } = currentTarget;
    const usernameElement = elements.namedItem("username") as HTMLInputElement;
    const passwordElement = elements.namedItem("password") as HTMLInputElement;
    const nameElement = elements.namedItem("name") as HTMLInputElement;
    const lastnameElement = elements.namedItem("last_name") as HTMLInputElement;

    try {
      setLoading(true);
      console.log({
        variables: {
          username: usernameElement.value,
          password: passwordElement.value,
          name: nameElement.value,
          lastname: lastnameElement.value
        },
      })
      const response = await signUp({
        variables: {
          username: usernameElement.value,
          password: passwordElement.value,
          name: nameElement.value,
          lastname: lastnameElement.value
        },
      });

      if (response.data.signUp.user) {
        setLoading(false);
        return;
      }else{
        setErrorMsg({ response: response.data.signUp.user });
        setLoading(false);
      }
      console.log("Accepted! Status 202");
      //router.push('/')
    } catch (error) {
      console.log("Sending data ", error);
      setErrorMsg({ response: getErrorMessage(error) });
    }
  };
  
  if(loading) {
    return <LoaderPage text="Creando usuario"/>;
  }

  return (
    <Fragment>
      <Head>
        <title>Sign Up | Tornicentro</title>
      </Head>
      <main className={classes.main}>
        <Header name={viewer.name} lastname={viewer.lastname} handleLogout={handleLogout} />
        <div className={classes.container}>
          <div className={classes.signup}>
            <div className={classes.content}>
              <div className={classes.title}>
                <h2>Registro</h2>
              </div>
              <div className={classes.description}>
                Crea una cuenta para darle permisos a un usuario.
              </div>
              {
                errorMsg.response && (
                  <div className={classes.error}>
                    {errorMsg.response}
                  </div>
                )
              }
            </div>
            <div className={classes.form}>
              <form onSubmit={handleSubmit} className={classes.form}>
                <div className={classes.form_input}>
                  <label htmlFor="name">Nombre</label>
                  <input
                    type="text"
                    name="name"
                    required={true}
                    placeholder="Nombre"
                    autoComplete="off"
                  />
                </div>

                <div className={classes.form_input}>
                  <label htmlFor="last_name">Apellido</label>
                  <input
                    type="text"
                    name="last_name"
                    required={true}
                    placeholder="Apellido"
                    autoComplete="off"
                  />
                </div>
                <div className={classes.form_input}>
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    name="username"
                    required={true}
                    placeholder="Usuario"
                    autoComplete="off"
                  />
                </div>
                <div className={classes.form_input}>
                  <label htmlFor="password">Contraseña</label>
                  <input
                    type="password"
                    name="password"
                    required={true}
                    placeholder="Clave"
                    autoComplete="off"
                  />
                </div>

                <div className={classes.form_submit}>
                  <div className={classes.button_box}>
                    <button type="submit" title="Sign Up">
                      <span>Crear</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </Fragment>
  );
}


export default function Wrapper(){
  const { data, loading, error } = useQuery(ViewerQuery);
    const { viewer } = data || {};
    const shouldRedirect = !(loading || error || viewer);
    const client = useApolloClient()
    const router = useRouter();
    const [signOut] = useMutation(SignOutMutation);

  useEffect(() => {
    if (shouldRedirect) {
      router.push("/login", "/login", { shallow: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  if(loading || !viewer) {
    return <LoaderPage text={"Cargando"} />
  }

  const handleLogout = async () => {
    try{
      signOut().then(() => {
        client.resetStore().then(() => {
          router.push("/login");
        });
      });
    }catch(error){
      console.log(error);
    }
  }

  return <SignUp viewer={viewer} handleLogout={handleLogout} />
}