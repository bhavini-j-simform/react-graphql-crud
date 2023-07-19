// components/AddUser.js
import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { ADD_USER} from '../mutations';

const AddUser = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [addUser] = useMutation(ADD_USER, {
    update(cache, { data: { addUser } }) {
      cache.modify({
        fields: {
          getUsers(existingUsers = []) {
            const newUserRef = cache.writeFragment({
              data: addUser,
              fragment: gql`
                fragment NewUser on User {
                  id
                  name
                  email
                }
              `,
            });
            return [...existingUsers, newUserRef];
          },
        },
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addUser({ variables: { name, email } });
    setName('');
    setEmail('');
  };

  return (
    <div>
      <h2>Add User</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Add User</button>
      </form>
    </div>
  );
};

export default AddUser;
