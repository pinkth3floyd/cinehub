'use client';

import Link from 'next/link';
import { Header, Footer, ContactForm, ContactInfo } from '../core/ui';

export default function ContactPage() {
  const handleContactSubmit = (data: any) => {
    // Handle form submission
    console.log('Contact form submitted:', data);
    // Here you would typically send the data to your backend
    alert('Thank you for your message! We will get back to you soon.');
  };

  return (
    <>
      <Header />
      
      {/* Page Title Section */}
      <section className="section section--first">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section__wrap">
                <h1 className="section__title section__title--head">Contacts</h1>
                <ul className="breadcrumbs">
                  <li className="breadcrumbs__item">
                    <Link href="/">Home</Link>
                  </li>
                  <li className="breadcrumbs__item breadcrumbs__item--active">Contacts</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section">
        <div className="container">
          <div className="row">
            {/* Contact Form */}
            <div className="col-12 col-xl-8">
              <div className="row">
                <div className="col-12">
                  <h2 className="section__title">Contact Form</h2>
                </div>
                <div className="col-12">
                  <ContactForm onSubmit={handleContactSubmit} />
                </div>
              </div>
            </div>
            
            {/* Contact Information */}
            <div className="col-12 col-md-6 col-xl-4">
              <div className="row">
                <div className="col-12">
                  <ContactInfo 
                    phone="+1 800 234 56 78"
                    email="support@cinehub.com"
                    description="We are always happy to help and provide more information about our services. You can contact us through email, phone, or by filling out the form on our website. Thank you for considering us!"
                    socialLinks={[
                      { icon: 'ti ti-brand-facebook', href: '#', label: 'Facebook' },
                      { icon: 'ti ti-brand-x', href: '#', label: 'Twitter' },
                      { icon: 'ti ti-brand-instagram', href: 'https://www.instagram.com/cinehub/', label: 'Instagram', target: '_blank' },
                      { icon: 'ti ti-brand-discord', href: '#', label: 'Discord' },
                      { icon: 'ti ti-brand-telegram', href: '#', label: 'Telegram' },
                      { icon: 'ti ti-brand-tiktok', href: '#', label: 'TikTok' }
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}   