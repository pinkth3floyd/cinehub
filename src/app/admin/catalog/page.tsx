import React from 'react';
import AdminLayout from '../../core/ui/components/AdminLayout';
import Dashbox from '../../core/ui/components/Dashbox';

const CatalogPage = () => {

  const catalogItems = [
    { id: 241, title: 'The Lost City', category: 'Movie', rating: 9.2, status: 'Active' },
    { id: 825, title: 'Undercurrents', category: 'Movie', rating: 9.1, status: 'Active' },
    { id: 9271, title: 'Tales from the Underworld', category: 'TV Series', rating: 9.0, status: 'Active' },
    { id: 635, title: 'The Unseen World', category: 'TV Series', rating: 8.9, status: 'Active' },
    { id: 826, title: 'Redemption Road', category: 'TV Series', rating: 8.9, status: 'Active' },
    { id: 824, title: 'I Dream in Another Language', category: 'TV Series', rating: 7.2, status: 'Active' },
    { id: 602, title: 'Benched', category: 'Movie', rating: 6.3, status: 'Active' },
    { id: 538, title: 'Whitney', category: 'TV Show', rating: 8.4, status: 'Active' },
    { id: 129, title: 'Blindspotting', category: 'Anime', rating: 9.0, status: 'Active' },
    { id: 360, title: 'Another', category: 'Movie', rating: 7.7, status: 'Active' },
  ];

  return (
    <AdminLayout>
      {/* main title */}
      <div className="row">
        <div className="col-12">
          <div className="main__title">
            <h2>Catalog</h2>
            <a href="/admin/add-item" className="main__title-link">add item</a>
          </div>
        </div>
      </div>
      {/* end main title */}

      <div className="row">
        <div className="col-12">
          <Dashbox
            title="All Items"
            icon="ti ti-movie"

          >
            <div className="dashbox__table-wrap">
              <table className="dashbox__table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>TITLE</th>
                    <th>CATEGORY</th>
                    <th>RATING</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {catalogItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="dashbox__table-text dashbox__table-text--grey">{item.id}</div>
                      </td>
                      <td>
                        <div className="dashbox__table-text">
                          <a href="#">{item.title}</a>
                        </div>
                      </td>
                      <td>
                        <div className="dashbox__table-text">{item.category}</div>
                      </td>
                      <td>
                        <div className="dashbox__table-text dashbox__table-text--rate">
                          <i className="ti ti-star"></i> {item.rating}
                        </div>
                      </td>
                      <td>
                        <div className="dashbox__table-text">
                          <span className="badge badge-success">{item.status}</span>
                        </div>
                      </td>
                      <td>
                        <div className="dashbox__table-text">
                          <a href={`/admin/edit-item/${item.id}`} className="btn btn-sm btn-primary">
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

export default CatalogPage; 