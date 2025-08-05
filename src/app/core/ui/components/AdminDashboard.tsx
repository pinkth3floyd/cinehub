'use client';

import React from 'react';
import Link from 'next/link';
import StatsCard from './StatsCard';
import Dashbox from './Dashbox';

const AdminDashboard: React.FC = () => {

  const topItems = [
    { id: 241, title: 'The Lost City', category: 'Movie', rating: 9.2 },
    { id: 825, title: 'Undercurrents', category: 'Movie', rating: 9.1 },
    { id: 9271, title: 'Tales from the Underworld', category: 'TV Series', rating: 9.0 },
    { id: 635, title: 'The Unseen World', category: 'TV Series', rating: 8.9 },
    { id: 826, title: 'Redemption Road', category: 'TV Series', rating: 8.9 },
  ];

  const latestItems = [
    { id: 824, title: 'I Dream in Another Language', category: 'TV Series', rating: 7.2 },
    { id: 602, title: 'Benched', category: 'Movie', rating: 6.3 },
    { id: 538, title: 'Whitney', category: 'TV Show', rating: 8.4 },
    { id: 129, title: 'Blindspotting', category: 'Anime', rating: 9.0 },
    { id: 360, title: 'Another', category: 'Movie', rating: 7.7 },
  ];

  const latestUsers = [
    { id: 23, name: 'Brian Cranston', email: 'bcxwz@email.com', username: 'BrianXWZ' },
    { id: 22, name: 'Jesse Plemons', email: 'jess@email.com', username: 'Jesse.P' },
    { id: 21, name: 'Matt Jones', email: 'matt@email.com', username: 'Matty' },
    { id: 20, name: 'Tess Harper', email: 'harper@email.com', username: 'Harper123' },
    { id: 19, name: 'Jonathan Banks', email: 'bank@email.com', username: 'Jonathan' },
  ];

  const latestReviews = [
    { id: 1001, item: 'I Dream in Another Language', author: 'Eliza Josceline', rating: 7.2 },
    { id: 1002, item: 'Benched', author: 'Ketut', rating: 6.3 },
    { id: 1003, item: 'Whitney', author: 'Brian Cranston', rating: 8.4 },
    { id: 1004, item: 'Blindspotting', author: 'Quang', rating: 9.0 },
    { id: 1005, item: 'Another', author: 'Jackson Brown', rating: 7.7 },
  ];

  return (
    <>
      {/* main title */}
      <div className="row">
        <div className="col-12">
          <div className="main__title">
            <h2>Dashboard</h2>
            <Link href="/admin/add-item" className="main__title-link">
              add item
            </Link>
          </div>
        </div>
      </div>
      {/* end main title */}

      {/* stats */}
      <div className="row">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatsCard
            title="Subscriptions this month"
            value="1 678"
            change="+15"
            changeType="positive"
            icon="ti ti-diamond"
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <StatsCard
            title="Items added this month"
            value="376"
            change="-44"
            changeType="negative"
            icon="ti ti-movie"
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <StatsCard
            title="Views this month"
            value="509 573"
            change="+3.1%"
            changeType="positive"
            icon="ti ti-eye"
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <StatsCard
            title="Reviews this month"
            value="642"
            change="+8"
            changeType="positive"
            icon="ti ti-star-half-filled"
          />
        </div>
      </div>

      <div className="row">
        {/* Top Items Dashbox */}
        <div className="col-12 col-xl-6">
          <Dashbox
            title="Top items"
            icon="ti ti-trophy"
            viewAllLink="/admin/catalog"
          >
            <div className="dashbox__table-wrap dashbox__table-wrap--1">
              <table className="dashbox__table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>TITLE</th>
                    <th>CATEGORY</th>
                    <th>RATING</th>
                  </tr>
                </thead>
                <tbody>
                  {topItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="dashbox__table-text dashbox__table-text--grey">{item.id}</div>
                      </td>
                      <td>
                        <div className="dashbox__table-text">
                          <Link href="#">{item.title}</Link>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Dashbox>
        </div>

        {/* Latest Items Dashbox */}
        <div className="col-12 col-xl-6">
          <Dashbox
            title="Latest items"
            icon="ti ti-movie"
            viewAllLink="/admin/catalog"
          >
            <div className="dashbox__table-wrap dashbox__table-wrap--2">
              <table className="dashbox__table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>ITEM</th>
                    <th>CATEGORY</th>
                    <th>RATING</th>
                  </tr>
                </thead>
                <tbody>
                  {latestItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="dashbox__table-text dashbox__table-text--grey">{item.id}</div>
                      </td>
                      <td>
                        <div className="dashbox__table-text">
                          <Link href="#">{item.title}</Link>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Dashbox>
        </div>

        {/* Latest Users Dashbox */}
        <div className="col-12 col-xl-6">
          <Dashbox
            title="Latest users"
            icon="ti ti-users"
            viewAllLink="/admin/users"
          >
            <div className="dashbox__table-wrap dashbox__table-wrap--3">
              <table className="dashbox__table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>FULL NAME</th>
                    <th>EMAIL</th>
                    <th>USERNAME</th>
                  </tr>
                </thead>
                <tbody>
                  {latestUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="dashbox__table-text">{user.id}</div>
                      </td>
                      <td>
                        <div className="dashbox__table-text">
                          <Link href="#">{user.name}</Link>
                        </div>
                      </td>
                      <td>
                        <div className="dashbox__table-text dashbox__table-text--grey">{user.email}</div>
                      </td>
                      <td>
                        <div className="dashbox__table-text">{user.username}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Dashbox>
        </div>

        {/* Latest Reviews Dashbox */}
        <div className="col-12 col-xl-6">
          <Dashbox
            title="Latest reviews"
            icon="ti ti-star-half-filled"
            viewAllLink="/admin/reviews"
          >
            <div className="dashbox__table-wrap dashbox__table-wrap--4">
              <table className="dashbox__table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>ITEM</th>
                    <th>AUTHOR</th>
                    <th>RATING</th>
                  </tr>
                </thead>
                <tbody>
                  {latestReviews.map((review) => (
                    <tr key={review.id}>
                      <td>
                        <div className="dashbox__table-text dashbox__table-text--grey">{review.id}</div>
                      </td>
                      <td>
                        <div className="dashbox__table-text">
                          <Link href="#">{review.item}</Link>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Dashbox>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard; 