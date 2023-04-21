import React, { useState } from 'react';
import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { authenticator } from '~/server/auth.server';
import bcrypt from 'bcryptjs';
import { createUserFromCredentials, findUser } from '~/utils/repository.server';
import { withZod } from '@remix-validated-form/with-zod';
import { z } from 'zod';
import { useField, ValidatedForm, validationError } from 'remix-validated-form';

const { PrismaClient } = require('@prisma/client');

// eslint-disable-next-line max-len
export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, { successRedirect: '/' });
  return { user };
};

function hashPassword(password: string | undefined): string | undefined {
  if (!password) return undefined;

  return bcrypt.hashSync(password, 10);
}

export const validator = withZod(
  z.object({
    name: z
      .string({ required_error: 'Le nom est requis' }),
    email: z
      .string({ required_error: 'L\'email est requis ' })
      .email({ message: 'Le format de l\'email est invalide' }),
    phone: z
      .string({ required_error: 'Le téléphone est requis' })
      .min(10, { message: 'Le téléphone doit faire au minimum 10 caractères' })
      .max(12, { message: 'Le téléphone doit faire au maximum 12 caractères' })
      .regex(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/, { message: 'Le format de téléphone est invalide' }),
    password: z
      .string({ required_error: 'Le mot de passe est requis' })
      .min(8, { message: 'Le mot de passe doit faire au minimum 8 caractères' }),
    confirmPassword: z
      .string({ required_error: 'La confirmation de mot de passe est requise' })
      .min(8, { message: 'La confirmation de mot de passe faire au minimum 8 caractères' }),
  })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'La confirmation de mot de passe ne correspond pas',
      path: ['confirmPassword'],
    }),
);

export const action: ActionFunction = async ({ request }) => {
  // On récupère les données du formulaire
  const result = await validator.validate(
    await request.formData(),
  );

  if (result.error) {
    // validationError comes from `remix-validated-form`
    return validationError(result.error);
  }

  // Ici, formData est un dictionnaire clé/valeur
  // Il est possible d'accéder à nos données avec :
  const {
    email, phone, name, password,
  } = result.data;

  // Ici, formData est un dictionnaire clé/valeur
  // Il est possible d'accéder à nos données avec :
  const hashedPassword = hashPassword(password);

  const data = {
    name,
    email,
    phone,
    password: hashedPassword,
  };

  console.log(data);

  const userExists = await findUser(email);
  console.log(userExists);
  if (userExists) {
    return validationError({
      formId: 'form-register',
      fieldErrors: { email: 'Cet email est déjà utilisé' },
    });
  }

  const user = await createUserFromCredentials(data);
  console.log(user);
  await authenticator.authenticate('user-pass', request, {
    successRedirect: '/',
    failureRedirect: '/register',
  });
  return {};
};

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);

  const email = useField('email', { formId: 'form-register' });
  const phone = useField('phone', { formId: 'form-register' });
  const name = useField('name', { formId: 'form-register' });
  const password = useField('password', { formId: 'form-register' });
  const confirmPassword = useField('confirmPassword', { formId: 'form-register' });

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="flex justify-center">
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">GME Inscription</h2>
          </div>
          <ValidatedForm id="form-register" validator={validator} method="POST">
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
                placeholder="exemple@gmail.com"
              />
              {email.error && (
              <span className="text-red-600">{email.error}</span>
              )}
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
                placeholder="06 66 66 66 66"
              />
              {phone.error && (
              <span className="text-red-600">{phone.error}</span>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                Nom
              </label>
              <input
                type="text"
                name="name"
                id="name"
                autoComplete="name"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="John"
              />
              {name.error && (
              <span className="text-red-600">{name.error}</span>
              )}
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
                placeholder="********"
              />
              {password.error && (
              <span className="text-red-600">{password.error}</span>
              )}
            </div>
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
                Répéter le mot de passe
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                autoComplete="confirmPassword"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="********"
              />
              {confirmPassword.error && (
              <span className="text-red-600">{confirmPassword.error}</span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <button id="registerBtn" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                Enregistrer
              </button>
              <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="/login">
                Vous avez un compte ?
              </a>
            </div>
          </ValidatedForm>
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
