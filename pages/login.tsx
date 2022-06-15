import { Fragment } from "react";
import Head from "next/head";
import classes from "./../styles/LogIn.module.css";
import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useQuery, gql, useMutation, useApolloClient } from "@apollo/client";
import { getErrorMessage } from "../lib/form";
import LoaderPage from "../components/loader/LoaderPage";


const ViewerQuery = gql`
  query ViewerQuery {
    viewer {
        username
        name
        lastname
    }
  }
`;

const SignInMutation = gql`
  mutation SignInMutation($username: String!, $password: String!) {
    signIn(input: { username: $username, password: $password }) {
      user {
        username
        name
        lastname
      }
    }
  }
`;

interface ErrorMessage {
  username?: string;
  password?: string;
  response?: string;
}

export default function LogIn() {
  const [signIn] = useMutation(SignInMutation);
  const [errorMsg, setErrorMsg] = useState<ErrorMessage>({});
  const [loadingSession, setLoading] = useState(false);
  const client = useApolloClient();
  const router = useRouter();
  const { data, loading, error } = useQuery(ViewerQuery);
  const { viewer } = data || {};
  const shouldRedirect = !(loading || error || viewer); 

  useEffect(() => {
    if(viewer) {
      router.push("/", null, { shallow: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const currentTarget = event.currentTarget as HTMLFormElement;
    const { elements } = currentTarget;
    const usernameElement = elements.namedItem("username") as HTMLInputElement;
    const passwordElement = elements.namedItem("password") as HTMLInputElement;

    const validations: {[key: string]: string} = {};

    const username = usernameElement.value;
    const password = passwordElement.value;
    // //Math username only accept letters and numbers
    // const usernameRegex = /^[a-zA-Z0-9]+$/;
    // if (!usernameRegex.test(username)) 
    //   validations["username"] = "Username must only contain letters and numbers";

    // //Password must have one symbol, one uppercase letter and numbers 
    // const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    // if (!passwordRegex.test(password))
    //   validations["password"] = "Password must have at least 8 characters, one uppercase letter and one symbol";

    if(Object.keys(validations).length > 0) {
      setErrorMsg({ ...validations });
      return;
    }

    try {
      const { data } = await signIn({
        variables: {
          username: usernameElement.value,
          password: passwordElement.value,
        },
      });

      if (data.signIn.user) {
        client.resetStore().then(() => {
           router.push("/", null, { shallow: true });
        });
      }
    } catch (error) {
      console.log("Sending data ", getErrorMessage(error) );
      setErrorMsg({ response: getErrorMessage(error) });
    }
  };

  if(loadingSession) {
    return <LoaderPage text={"Entrando"} />
  }

  return (
    <Fragment>
      <Head>
        <title>Log In| Tornicentro</title>
      </Head>
      <main className={classes.main}>
        <div className={classes.container}>
          <div className={classes.content}>
            <h1>Inicio de Sesión</h1>
            <div className={classes.login}>
              <div className={classes.content}>
                <div className={classes.description}>
                  Ingresa con tu usuario para poder llevar un control de inventario.
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
                    <label htmlFor="username"></label>
                    <input
                      type="text"
                      name="username"
                      title=""
                      required={true}
                      placeholder="User"
                      autoComplete="off"
                      autoFocus
                    />
                     {
                      errorMsg.username && (
                        <div className={classes.error}>
                          {errorMsg.username}
                        </div>
                      )
                    }
                  </div>
                  <div className={classes.form_input}>
                    <label htmlFor="password"></label>
                    <input
                      type="password"
                      name="password"
                      title=""
                      required={true}
                      placeholder="Password"
                    />
                     {
                      errorMsg.password && (
                        <div className={classes.error}>
                          {errorMsg.password}
                        </div>
                      )
                    }
                  </div>
                  <div className={classes.button_box}>
                    <div className="button_box">
                      <button type="submit">
                        <span>Entrar</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className={classes.signUp}>
              No tengo una cuenta. &nbsp;
              <Link className={classes.link} href="/signup">
                Registrarme.
              </Link>
            </div>
          </div>
        </div>
      </main>
    </Fragment>
  );
}
