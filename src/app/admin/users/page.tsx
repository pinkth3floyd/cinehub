import React from 'react';
import AdminLayout from '../../core/ui/components/AdminLayout';
import Dashbox from '../../core/ui/components/Dashbox';

const UsersPage = () => {

  const users = [
    { id: 23, name: 'Brian Cranston', email: 'bcxwz@email.com', username: 'BrianXWZ', status: 'Active' },
    { id: 22, name: 'Jesse Plemons', email: 'jess@email.com', username: 'Jesse.P', status: 'Active' },
    { id: 21, name: 'Matt Jones', email: 'matt@email.com', username: 'Matty', status: 'Active' },
    { id: 20, name: 'Tess Harper', email: 'harper@email.com', username: 'Harper123', status: 'Active' },
    { id: 19, name: 'Jonathan Banks', email: 'bank@email.com', username: 'Jonathan', status: 'Active' },
    { id: 18, name: 'Aaron Paul', email: 'aaron@email.com', username: 'AaronP', status: 'Active' },
    { id: 17, name: 'Anna Gunn', email: 'anna@email.com', username: 'AnnaG', status: 'Active' },
    { id: 16, name: 'Dean Norris', email: 'dean@email.com', username: 'DeanN', status: 'Active' },
    { id: 15, name: 'Betsy Brandt', email: 'betsy@email.com', username: 'BetsyB', status: 'Active' },
    { id: 14, name: 'RJ Mitte', email: 'rj@email.com', username: 'RJMitte', status: 'Active' },
  ];

  return (
    <AdminLayout>
      {/* main title */}
      <div className="row">
        <div className="col-12">
          <div className="main__title">
            <h2>Users</h2>
            <a href="/admin/add-user" className="main__title-link">add user</a>
          </div>
        </div>
      </div>
      {/* end main title */}

      <div className="row">
        <div className="col-12">
          <Dashbox
            title="All Users"
            icon="ti ti-users"

          >
            <div className="dashbox__table-wrap">
              <table className="dashbox__table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>FULL NAME</th>
                    <th>EMAIL</th>
                    <th>USERNAME</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="dashbox__table-text">{user.id}</div>
                      </td>
                      <td>
                        <div className="dashbox__table-text">
                          <a href="#">{user.name}</a>
                        </div>
                      </td>
                      <td>
                        <div className="dashbox__table-text dashbox__table-text--grey">{user.email}</div>
                      </td>
                      <td>
                        <div className="dashbox__table-text">{user.username}</div>
                      </td>
                      <td>
                        <div className="dashbox__table-text">
                          <span className="badge badge-success">{user.status}</span>
                        </div>
                      </td>
                      <td>
                        <div className="dashbox__table-text">
                          <a href={`/admin/edit-user/${user.id}`} className="btn btn-sm btn-primary">
                            <i className="ti ti-edit"></i>
                          </a>
                          <a href="#" className="btn btn-sm btn-danger ml-2">
                            <i className="ti ti-trash"></i>
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Dashbox>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UsersPage; 