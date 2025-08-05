import React from 'react';
import AdminLayout from '../../core/ui/components/AdminLayout';
import Dashbox from '../../core/ui/components/Dashbox';

const ReviewsPage = () => {

  const reviews = [
    { id: 824, item: 'I Dream in Another Language', author: 'Eliza Josceline', rating: 7.2, status: 'Approved' },
    { id: 602, item: 'Benched', author: 'Ketut', rating: 6.3, status: 'Approved' },
    { id: 538, item: 'Whitney', author: 'Brian Cranston', rating: 8.4, status: 'Approved' },
    { id: 129, item: 'Blindspotting', author: 'Quang', rating: 9.0, status: 'Approved' },
    { id: 360, item: 'Another', author: 'Jackson Brown', rating: 7.7, status: 'Approved' },
    { id: 421, item: 'The Lost City', author: 'Sarah Wilson', rating: 8.5, status: 'Pending' },
    { id: 322, item: 'Undercurrents', author: 'Mike Johnson', rating: 7.8, status: 'Approved' },
    { id: 543, item: 'Tales from the Underworld', author: 'Lisa Chen', rating: 8.9, status: 'Approved' },
    { id: 654, item: 'The Unseen World', author: 'David Smith', rating: 7.1, status: 'Pending' },
    { id: 765, item: 'Redemption Road', author: 'Emma Davis', rating: 8.2, status: 'Approved' },
  ];

  return (
    <AdminLayout>
      {/* main title */}
      <div className="row">
        <div className="col-12">
          <div className="main__title">
            <h2>Reviews</h2>
            <a href="/admin/add-review" className="main__title-link">add review</a>
          </div>
        </div>
      </div>
      {/* end main title */}

      <div className="row">
        <div className="col-12">
          <Dashbox
            title="All Reviews"
            icon="ti ti-star-half-filled"

          >
            <div className="dashbox__table-wrap">
              <table className="dashbox__table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>ITEM</th>
                    <th>AUTHOR</th>
                    <th>RATING</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review) => (
                    <tr key={review.id}>
                      <td>
                        <div className="dashbox__table-text dashbox__table-text--grey">{review.id}</div>
                      </td>
                      <td>
                        <div className="dashbox__table-text">
                          <a href="#">{review.item}</a>
                        </div>
                      </td>
                      <td>
                        <div className="dashbox__table-text">{review.author}</div>
                      </td>
                      <td>
                        <div className="dashbox__table-text dashbox__table-text--rate">
                          <i className="ti ti-star"></i> {review.rating}
                        </div>
                      </td>
                      <td>
                        <div className="dashbox__table-text">
                          <span className={`badge ${review.status === 'Approved' ? 'badge-success' : 'badge-warning'}`}>
                            {review.status}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="dashbox__table-text">
                          <a href={`/admin/edit-review/${review.id}`} className="btn btn-sm btn-primary">
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

export default ReviewsPage; 