'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="footer__content">
              <Link href="/" className="footer__logo">
                <Image src="/core/assets/img/logo.svg" alt="CineHub" width={120} height={40} />
              </Link>

              <span className="footer__copyright">
                © CINEHUB, 2024 <br /> 
                Create by <a href="#" target="_blank">CineHub Team</a>
              </span>

              <nav className="footer__nav">
                <Link href="/about">About Us</Link>
                <Link href="/contact">Contacts</Link>
                <Link href="/privacy">Privacy policy</Link>
              </nav>

              <button className="footer__back" type="button">
                <i className="ti ti-arrow-narrow-up"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}  