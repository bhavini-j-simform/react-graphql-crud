import React ,{useState}from 'react';
import { useQuery, useMutation } from '@apollo/client';

import UpdateUser from './UpdateUser';
import { GET_USERS} from '../queries';
import { DELETE_USER} from '../mutations';

const UserList = () => {
  const { loading, error, data } = useQuery(GET_USERS);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleUpdateUser = (id) => {
    setSelectedUserId(id);
  };

  const [deleteUser] = useMutation(DELETE_USER, {
    update(cache, { data: { deleteUser } }) {
      cache.modify({
        fields: {
          getUsers(existingUsers = [], { readField }) {
            return existingUsers.filter(
              (userRef) => readField('id', userRef) !== deleteUser.id
            );
          },
        },
      });
    },
  });

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser({ variables: { id } });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
    <h2>User List</h2>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {data.getUsers.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>
              <button
                onClick={() => handleDeleteUser(user.id)}
                style={{ marginRight: '10px' }}
              >
                Delete
              </button>
              <button onClick={() => handleUpdateUser(user.id)}>Update</button> 
            </td>
           
          </tr>
        ))}
      </tbody>
    </table>
    {selectedUserId && (
        <UpdateUser
          user={data.getUsers.find((user) => user.id === selectedUserId)}
          onUpdate={() => setSelectedUserId(null)}
        />
      )}
  </div>
);
};

export default UserList;