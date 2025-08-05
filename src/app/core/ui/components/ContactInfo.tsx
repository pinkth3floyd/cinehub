import React from 'react';

export interface ContactInfoProps {
  phone?: string;
  email?: string;
  socialLinks?: SocialLink[];
  description?: string;
  className?: string;
}

export interface SocialLink {
  icon: string;
  href: string;
  label: string;
  target?: '_blank' | '_self';
}

export default function ContactInfo({ 
  phone = '+1 800 234 56 78',
  email = 'support@cinehub.com',
  socialLinks = [
    { icon: 'ti ti-brand-facebook', href: '#', label: 'Facebook' },
    { icon: 'ti ti-brand-x', href: '#', label: 'Twitter' },
    { icon: 'ti ti-brand-instagram', href: 'https://www.instagram.com/cinehub/', label: 'Instagram', target: '_blank' },
    { icon: 'ti ti-brand-discord', href: '#', label: 'Discord' },
    { icon: 'ti ti-brand-telegram', href: '#', label: 'Telegram' },
    { icon: 'ti ti-brand-tiktok', href: '#', label: 'TikTok' }
  ],
  description = 'We are always happy to help and provide more information about our services. You can contact us through email, phone, or by filling out the form on our website. Thank you for considering us!',
  className = ''
}: ContactInfoProps) {
  return (
    <div className={`contact-info ${className}`}>
      <h2 className="section__title section__title--mt">Get In Touch</h2>
      
      <p className="section__text">{description}</p>
      
      <ul className="contacts__list">
        {phone && (
          <li>
            <a href={`tel:${phone.replace(/\s+/g, '')}`}>{phone}</a>
          </li>
        )}
        {email && (
          <li>
            <a href={`mailto:${email}`}>{email}</a>
          </li>
        )}
      </ul>
      
      {socialLinks.length > 0 && (
        <div className="contacts__social">
          {socialLinks.map((link, index) => (
            <a 
              key={index}
              href={link.href}
              target={link.target}
              rel={link.target === '_blank' ? 'noopener noreferrer' : undefined}
              aria-label={link.label}
            >
              <i className={link.icon}></i>
            </a>
          ))}
        </div>
      )}
    </div>
  );
} 