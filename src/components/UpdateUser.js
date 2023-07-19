// components/UpdateUser.js
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import {UPDATE_USER} from '../mutations'


const UpdateUser = ({ user, onUpdate }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const [updateUser] = useMutation(UPDATE_USER);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser({ variables: { id: user.id, name, email } }).then(() => {
      onUpdate();
    });
  };

  return (
    <div>
      <h3>Update User</h3>
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
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default UpdateUser;
