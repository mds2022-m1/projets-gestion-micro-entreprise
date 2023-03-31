import React, { useState } from 'react';
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
        githubId: "null",
        createdAt: new Date(),
      },
    };
    
    await prisma.user.create(data);
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
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
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
                Téléphone
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
                Prénom
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
                Nom
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
            <div className="mb-6">
              <label htmlFor="repeat-password" className="block text-gray-700 text-sm font-bold mb-2">
                Répéter le mot de passe
              </label>
                <input
                type="password"
                name="repeat-password"
                id="repeat-password"
                autoComplete="repeat-password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder='********'
                />
            </div>
            <div className="flex items-center justify-between">
              <button id='registerBtn' className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={checkRegister}>
                Enregistrer
              </button>
              <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="/login">
                Connexion
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

function checkRegister(event: { preventDefault: () => void; }){
  let isCheck = true;
  const email = document.getElementById("email") as HTMLInputElement;
  const phone = document.getElementById("phone") as HTMLInputElement;
  const firstname = document.getElementById("firstname") as HTMLInputElement;
  const lastname = document.getElementById("lastname") as HTMLInputElement;
  const password = document.getElementById("password") as HTMLInputElement;
  const repeatPassword = document.getElementById("repeat-password") as HTMLInputElement;

  //avoid sql injection 
  //email
  if(email.value.includes("'")){
    email.value = email.value.replace("'","''")
  }
  //phone
  if(phone.value.includes("'")){
    phone.value = phone.value.replace("'","''")
  }
  //firstname
  if(firstname.value.includes("'")){
    firstname.value = firstname.value.replace("'","''")
  }
  //lastname
  if(lastname.value.includes("'")){
    lastname.value = lastname.value.replace("'","''")
  }
  //password
  if(password.value.includes("'")){
    password.value = password.value.replace("'","''")
  }
  //repeatPassword
  if(repeatPassword.value.includes("'")){
    repeatPassword.value = repeatPassword.value.replace("'","''")
  }

  //email is not true
  if(!email.value.includes("@") || email.value == ""){
    email.classList.add("border-red-500");
    alert("L'email est incorrect")
    isCheck = false;
  }else{
    email.classList.remove("border-red-500");
  }
  //phone is not true
  if(phone.value.length != 10 || phone.value == ""){
    alert("Le téléphone est incorrect")
    isCheck = false;
    phone.classList.add("border-red-500");
  }else{
    phone.classList.remove("border-red-500");
  }
  //firstname is not true
  if(firstname.value == ""){
    alert("Le prénom est incorrect")
    isCheck = false;
    firstname.classList.add("border-red-500");
  }else{
    firstname.classList.remove("border-red-500");
  }
  //lastname is not true
  if(lastname.value == ""){
    alert("Le nom est incorrect")
    isCheck = false;
    lastname.classList.add("border-red-500");
  }else{
    lastname.classList.remove("border-red-500");
  }
  //password is not true
  if(password.value.length < 5 || password.value != repeatPassword.value){
    alert("Les mots de passes sont incorrects")
    isCheck = false;
    password.classList.add("border-red-500");
    repeatPassword.classList.add("border-red-500");
  }else{
    password.classList.remove("border-red-500");
    repeatPassword.classList.remove("border-red-500");
  }

  //submit form if isCheck is true 
  const form = document.getElementById("registerBtn") as HTMLFormElement;

  if (isCheck) {
    alert("Vous êtes bien enregistré")
  }else{
    event.preventDefault();
  }
}