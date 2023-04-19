// ./app/routes/index.tsx
import { Form, useLoaderData } from '@remix-run/react';
import { ActionFunction, LoaderArgs, LoaderFunction, redirect } from '@remix-run/node';
import { authenticator } from '~/server/auth.server';
import { ReactSession } from 'react-client-session';
import { ApolloClient, InMemoryCache, ApolloProvider , gql, useQuery, useMutation } from '@apollo/client';
import { Key, ReactElement, JSXElementConstructor, ReactFragment, ReactPortal } from 'react';

export const loader: LoaderFunction = async ({ request }) => {
  const user = ReactSession.get("user");
  if(!user){
    return redirect("/login");
  }
  
  return { 
    user, 
    hasura: process.env.HASURA_KEY
  };
};

export default function Index() {
  const { user, hasura } = useLoaderData();
  
  //connection à hasura
  const client = new ApolloClient({
    uri: 'https://nirxo.hasura.app/v1/graphql',
    cache: new InMemoryCache(),
    headers: {
      'x-hasura-admin-secret': hasura
    },
  });

  //requête graphQL pour récupérer les users
  const userGraph = gql`
    query MyQuery {
      user {
        id
        firstname
        lastname
        email
        phone
        password
      }
    }
  `;

  //requête graphQL pour ajouter un user
  const addUserGraph = gql`
  mutation AddUser($firstname: String!, $lastname: String!, $email: String!, $phone: String!,$password: String!,) {
    insert_user_one(object: {firstname: $firstname, lastname: $lastname, email: $email, phone: $phone, password: $password}) {
      id
      firstname
      lastname
      email
      phone
      password
    }
  }
`;

//requête graphQL pour supprimer un user
const deleteUserGraph = gql`
  mutation DeleteUser($id: Int!) {
    delete_user_by_pk(id: $id) {
      id
    }
  }
`;

//view permettant de montrer les utilisateurs
function ViewUserGet() {
  const { loading, error, data } = useQuery(userGraph);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;
  return (
    <div>
      {data.user.map((user: { id: Key; email: string; firstname: string; lastname: string; phone: string; }) => (
        <div key={user.id}>
          <p>email: {user.email}</p>
          <p>firstname: {user.firstname}</p>
          <p>lastname: {user.lastname}</p>
          <p>phone: {user.phone}</p>
          <DeleteUserButton userId={user.id} />
        </div>
      ))}
    </div>
  );
}

//view permettant d'afficher le formulaire de création d'un user
function AddUserForm() {
  const [addUser, { loading, error, data }] = useMutation(addUserGraph);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const firstname = formData.get('firstname') as string;
    const lastname = formData.get('lastname') as string;
    const phone = formData.get('phone') as string;
    const password = formData.get('password') as string;

    addUser({ variables: { firstname, lastname, email, phone, password } });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;
  if (data) {
    return <p>User added successfully</p>;
  }

  return (
    <Form onSubmit={handleSubmit}>
      <label>
        Email:
        <input type="email" name="email" required />
      </label>
      <label>
        Firstname:
        <input type="text" name="firstname" required />
      </label>
      <label>
        Lastname:
        <input type="text" name="lastname" required />
      </label>
      <label>
        Phone:
        <input type="text" name="phone" required />
      </label>
      <label>
        Password:
        <input type="password" name="password" required />
      </label>
      <button type="submit">Add user</button>
    </Form>
  );
}

//view permettant d'afficher le bouton de suppression d'un user
function DeleteUserButton(props: { userId: any; }) {
  const [deleteUser, { loading, error, data }] = useMutation(deleteUserGraph);

  const handleClick = () => {
    deleteUser({ variables: { id: props.userId } });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;
  if (data) {
    return <p>User deleted successfully</p>;
  }

  return (
    <button onClick={handleClick}>Delete user</button>
  );
}

//affichage des views

  return (
  <ApolloProvider client={client}>
    <AddUserForm />
    <ViewUserGet />
  </ApolloProvider>
);

}
