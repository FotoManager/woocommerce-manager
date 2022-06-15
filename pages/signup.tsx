import { Fragment } from "react";
import Head from "next/head";
import classes from "./../styles/Signup.module.css";
import { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { gql, useMutation } from "@apollo/client";
import { getErrorMessage } from "../lib/form";

const SignUpMutation = gql`
  mutation SignUpMutation(
    $username: String!
    $password: String!
    $name: String!
    $last_name: String!
    $email: String!
  ) {
    signUp(
      input: {
        username: $username
        password: $password
        last_name: $last_name
        name: $name
        email: $email
      }
    ) {
      user {
        user_name
        name
        last_name
        email
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

export default function SignUp() {
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

    const validations: {[key: string]: string} = {};

    const username = usernameElement.value;
    const password = passwordElement.value;
    const name = nameElement.value;
    const lastname = lastnameElement.value;

    //Math username only accept letters and numbers
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    if (!usernameRegex.test(username)) 
      validations["username"] = "Username must only contain letters and numbers";
    
    const nameRegex = /^[a-zA-Z]+$/;
    if (!nameRegex.test(name))
      validations["name"] = "Name must only contain letters";
    if(!nameRegex.test(lastname))
      validations["lastname"] = "Last name must only contain letters";

    //Password must have one symbol, one uppercase letter and numbers 
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    if (!passwordRegex.test(password))
      validations["password"] = "Password must have at least 8 characters, one uppercase letter and one symbol";

    if(Object.keys(validations).length > 0) {
      setErrorMsg({ ...validations });
      return;
    }

    try {
      setLoading(true);
      const response = await signUp({
        variables: {
          username: usernameElement.value,
          password: passwordElement.value,
          name: nameElement.value,
          last_name: lastnameElement.value,
          email: "",
        },
      });

      if (response.data.signUp.user) {
        router.push("/login");
        console.log("User created: ", response.data.signUp.user);
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
  console.log(errorMsg);
  return (
    <Fragment>
      <Head>
        <title>Sign Up | Dynamic Programming Coders</title>

        <meta
          name="description"
          content="Sign up for the Dynamic Programming Coders platform."
        />
        <meta
          name="keywords"
          content="sign up, platform, dynamic programming coders, competitive programming, register"
        />
        <meta name="robots" content="index, follow" />

        <meta
          property="og:title"
          content="Sign Up | Dynamic Programming Coders"
        />
        <meta
          property="og:description"
          content="Sign up for the Dynamic Programming Coders platform."
        />

        {/* <meta property="og:image" content="https://dynamicprogrammingcoders.com/static/images/logo.png" />
            <meta property="og:url" content="https://dynamicprogrammingcoders.com/signup" /> */}
        <meta property="og:site_name" content="Dynamic Programming Coders" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:locale:alternate" content="en_US" />
        <meta
          name="twitter:title"
          content="Sign Up | Dynamic Programming Coders"
        />
        <meta
          name="twitter:description"
          content="Sign up for the Dynamic Programming Coders platform."
        />
        {/* <meta name="twitter:image" content="https://dynamicprogrammingcoders.com/static/images/logo.png" />
            <meta name="twitter:url" content="https://dynamicprogrammingcoders.com/signup" /> */}
        <meta name="twitter:site" content="@DynamicProgrammingCoders" />
        <meta name="twitter:card" content="summary_large_image" />

        <link
          rel="canonical"
          href="https://dynamicprogrammingcoders.com/signup"
        />
        <link
          rel="alternate"
          hrefLang="en-US"
          href="https://dynamicprogrammingcoders.com/signup"
        />
      </Head>
      <main className={classes.main}>
        <div className={classes.container}>
          <div className={classes.signup}>
            <div className={classes.content}>
              <div className={classes.title}>
                <h2>Sign Up!</h2>
              </div>
              <div className={classes.description}>
                Sign up for the Dynamic Programming Coders platform.
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
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    name="name"
                    required={true}
                    placeholder="Name"
                    autoComplete="off"
                  />
                  {
                    errorMsg.name && (
                      <div className={classes.error}>
                        {errorMsg.name}
                      </div>
                    )
                  }
                </div>

                <div className={classes.form_input}>
                  <label htmlFor="last_name">Last name</label>
                  <input
                    type="text"
                    name="last_name"
                    required={true}
                    placeholder="Last name"
                    autoComplete="off"
                  />
                  {
                    errorMsg.lastname && (
                      <div className={classes.error}>
                        {errorMsg.lastname}
                      </div>
                    )
                  }
                </div>
                <div className={classes.form_input}>
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    name="username"
                    required={true}
                    placeholder="Username"
                    autoComplete="off"
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
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    name="password"
                    required={true}
                    placeholder="Password"
                    autoComplete="off"
                  />
                  {
                    errorMsg.password && (
                      <div className={classes.error}>
                        {errorMsg.password}
                      </div>
                    )
                  }
                </div>
                
                <div className={classes.form_input}>
                  <Link href="/login">
                    <a>Already have an account?</a>
                  </Link>
                </div>

                <div className={classes.form_submit}>
                  <div className={classes.button_box}>
                    <button type="submit" title="Sign Up">
                      <span>Sign Up</span>
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
