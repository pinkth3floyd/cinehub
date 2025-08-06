'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import StatsCard from './StatsCard';
import Dashbox from './Dashbox';
import { getDashboardStats } from '../../entities/dashboard/actions';

const AdminDashboard: React.FC = () => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <>
        <div className="row">
          <div className="col-12">
            <div className="main__title">
              <h2>Dashboard</h2>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="dashbox">
              <div className="dashbox__content">
                <div className="text-center py-5">
                  <div className="spinner-border text-secondary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3">Loading dashboard statistics...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="row">
          <div className="col-12">
            <div className="main__title">
              <h2>Dashboard</h2>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="dashbox">
              <div className="dashbox__content">
                <div className="alert alert-danger">
                  <i className="ti ti-alert-triangle me-2"></i>
                  Failed to load dashboard statistics. Please try again.
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const dashboardData = stats?.data || {
    movies: { total: 0, published: 0, draft: 0, featured: 0 },
    users: { total: 0, active: 0, banned: 0 },
    reviews: { total: 0, pending: 0, approved: 0, rejected: 0 },
    genres: { total: 0 },
    types: { total: 0 },
    tags: { total: 0 },
    years: { total: 0 }
  };

  return (
    <>
      {/* main title */}
      <div className="row">
        <div className="col-12">
          <div className="main__title">
            <h2>Dashboard</h2>
            <Link href="/admin/catalog/add" className="main__title-link">
              add movie
            </Link>
          </div>
        </div>
      </div>
      {/* end main title */}

      {/* stats */}
      <div className="row">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatsCard
            title="Total Movies"
            value={dashboardData.movies.total.toString()}
            change={`${dashboardData.movies.published} published`}
            changeType="positive"
            icon="ti ti-movie"
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <StatsCard
            title="Total Users"
            value={dashboardData.users.total.toString()}
            change={`${dashboardData.users.active} active`}
            changeType="positive"
            icon="ti ti-users"
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <StatsCard
            title="Total Reviews"
            value={dashboardData.reviews.total.toString()}
            change={`${dashboardData.reviews.approved} approved`}
            changeType="positive"
            icon="ti ti-star-half-filled"
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <StatsCard
            title="Total Genres"
            value={dashboardData.genres.total.toString()}
            icon="ti ti-category"
          />
        </div>
      </div>

      <div className="row">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatsCard
            title="Total Types"
            value={dashboardData.types.total.toString()}
            icon="ti ti-tag"
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <StatsCard
            title="Total Tags"
            value={dashboardData.tags.total.toString()}
            icon="ti ti-tags"
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <StatsCard
            title="Total Years"
            value={dashboardData.years.total.toString()}
            icon="ti ti-calendar"
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <StatsCard
            title="Featured Movies"
            value={dashboardData.movies.featured.toString()}
            change={`${dashboardData.movies.draft} drafts`}
            changeType="positive"
            icon="ti ti-star"
          />
        </div>
      </div>

      <div className="row">
        {/* Top Items Dashbox */}
        {/* <div className="col-12 col-xl-6">
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
        </div> */}

        {/* Latest Items Dashbox
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
        </div> */}

        {/* Latest Users Dashbox */}
        {/* <div className="col-12 col-xl-6">
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
        </div> */}

        {/* Latest Reviews Dashbox */}
        {/* <div className="col-12 col-xl-6">
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
        </div> */}
      </div>
    </>
  );
};

export default AdminDashboard; 