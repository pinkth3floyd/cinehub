'use client';

import Link from 'next/link';
import { Header, Footer } from './core/ui';

export default function NotFound() {
  return (
    <>
      <Header />
      
      <div className="page-404 section--bg" style={{ backgroundImage: 'url(/core/assets/img/bg/section__bg.jpg)' }}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="page-404__wrap">
                <div className="page-404__content">
                  <h1 className="page-404__title">404</h1>
                  <p className="page-404__text">
                    The page you are looking for <br />not available!
                  </p>
                  <Link href="/" className="page-404__btn">
                    go back
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
} 