import { Form } from '@remix-run/react';
import React, { useState } from 'react';
import { ActionFunction, LoaderFunction, redirect } from '@remix-run/node';
import { authenticator } from '~/server/auth.server';
import { SocialsProvider } from 'remix-auth-socials';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs'
import { ReactSession } from 'react-client-session';

// eslint-disable-next-line max-len
export const loader: LoaderFunction = async ({ request }) => {
  const user = ReactSession.get("user");
  if(user){
    return redirect("/");
  }
  console.log('login', user);
  return { user };
};
export let action: ActionFunction = async ({ request }) => {
  // On récupère les données du formulaire
  let formData = await request.formData();
  const prisma = new PrismaClient();

  // Ici, formData est un dictionnaire clé/valeur
  // Il est possible d'accéder à nos données avec :
  let email = formData.get('email')?.toString();
  let password = formData.get('password')?.toString();

  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  const hashedPassword = user?.password;

  if (password && hashedPassword) {
    try {
      const match = await bcrypt.compare(password, hashedPassword);
      if (match) {
        ReactSession.set("user",user);
        console.log("Vous êtes connecté !" + user.name);
        return redirect("/login");
      } else {
        console.log("Mot de passe incorrect !");
      }
    } catch (err) {
      console.error(err);
    }
  } else {
    console.log("Le mot de passe est incorrect !");
  }

  return {
    redirect: '/login',
  };
};



export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="flex justify-center">
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">GME Connexion</h2>
          </div>
          <form action='/login' method="post" id="connexionForm" className="px-8 pt-6 pb-8 mb-4">     
            <div className="mb-4">                
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
              type="text"
              name="email"
              id="email"
              autoComplete="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder='exemple@gmail.com'
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                Mot de passe
              </label>
                <input
                type="password"
                name="password"
                id="password"
                autoComplete="password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder='********'
                />
            </div>
            <div className="flex items-center justify-between">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                Connexion
              </button>
              <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="/register">
                Pas de compte ?
              </a>
            </div>
          </form>
          <hr></hr>

          <div className="mt-8">
            <div>
              <div>
                <div className="mt-1 grid grid-cols-1 gap-3">
                  <Form action={`/auth/${SocialsProvider.GITHUB}`} method="post">
                    <button
                      type="submit"
                      className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
                    >
                      <span className="mr-1.5">Sign in with GitHub</span>
                      <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1516234466017-4accbc5ea854?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2970&q=80"
          alt=""
        />
      </div>
    </div>
  );
}

