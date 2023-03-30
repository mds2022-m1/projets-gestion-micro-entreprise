import React from 'react';
import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { authenticator } from '~/server/auth.server';
import { json, type ActionArgs, type LoaderArgs } from '@remix-run/node'
import { Form, useActionData, useLoaderData, useSubmit } from '@remix-run/react'
const { PrismaClient } = require('@prisma/client');
import bcrypt from 'bcryptjs'

// eslint-disable-next-line max-len
export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, { successRedirect: '/' });
  console.log(user);
  return { user };
};

export let action: ActionFunction = async ({request}) => {
  // On récupère les données du formulaire
  let formData = await request.formData()
  const prisma = new PrismaClient();

  // Ici, formData est un dictionnaire clé/valeur
  // Il est possible d'accéder à nos données avec :
  let email = formData.get('email')?.toString()
  let phone = formData.get('phone')?.toString()
  let firstname = formData.get('firstname')?.toString()
  let lastname = formData.get('lastname')?.toString()
  let password = formData.get('password')?.toString()
  let repeatpassword = formData.get('repeat-password')?.toString()

  // On vérifie que les deux mots de passe sont identiques
  if (password !== repeatpassword) {
    return json({ error: 'Les mots de passe ne sont pas identiques' }, { status: 400 })
  }else{
    let formObj = Object.fromEntries(formData.entries())
    const hashedPassword = hashPassword(password);
    console.table(formObj)
    const data = {
      data: {
        name: firstname,
        email: email,
        phone: phone,
        password: hashedPassword,
        companyName: null,
        siret: null,
        ape: null,
        address: null,
        bankAccountOwner: null,
        bankDomiciliation: null,
        bankRib: null,
        bankIban: null,
        bankBic: null,
        githubId: null,
        createdAt: new Date(),
      },
    };
    
    await prisma.user.create(data);
  }

  
}

function hashPassword(password: string | undefined): string | undefined {
  const saltRounds = 10;
  if (!password) {
    return undefined;
  }
  const hashedPassword = bcrypt.hashSync(password, saltRounds);
  return hashedPassword;
}

export default function Register() {
  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="flex justify-center">
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">GME register</h2>
          </div>
          <form method="post" id="registerForm" className="px-8 pt-6 pb-8 mb-4">    
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
            <div className="mb-4">                
              <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">
                Phone
              </label>
              <input
              type="text"
              name="phone"
              id="phone"
              autoComplete="phone"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder='06 66 66 66 66'
              />
            </div>
            <div className="mb-4">                
              <label htmlFor="firstname" className="block text-gray-700 text-sm font-bold mb-2">
                Firstname
              </label>
              <input
              type="text"
              name="firstname"
              id="firstname"
              autoComplete="firstname"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder='John'
              />
            </div>
            <div className="mb-4">                
              <label htmlFor="lastname" className="block text-gray-700 text-sm font-bold mb-2">
                Lastname
              </label>
              <input
              type="text"
              name="lastname"
              id="lastname"
              autoComplete="lastname"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder='Doe'
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
                <input
                type="text"
                name="password"
                id="password"
                autoComplete="password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder='********'
                />
            </div>
            <div className="mb-6">
              <label htmlFor="repeat-password" className="block text-gray-700 text-sm font-bold mb-2">
                Repeat password
              </label>
                <input
                type="text"
                name="repeat-password"
                id="repeat-password"
                autoComplete="repeat-password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder='********'
                />
            </div>
            <div className="flex items-center justify-between">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                Register
              </button>
              <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="/login">
                Home
              </a>
            </div>
          </form >
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

