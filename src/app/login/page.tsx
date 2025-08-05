'use client';

import { Header, Footer, Form, Section } from '../core/ui';
import Link from 'next/link';
import Image from 'next/image';

const loginFields = [
  {
    name: 'email',
    label: 'Email',
    type: 'email' as const,
    placeholder: 'example@domain.com',
    required: true
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password' as const,
    placeholder: 'Enter your password',
    required: true
  }
];

export default function LoginPage() {
  const handleLogin = (data: Record<string, string>) => {
    console.log('Login attempt:', data);
    // Handle login logic
  };

  return (
    <>
      <Header />
      
      <Section variant="no-padding">
        <div className="sign">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="sign__content">
                  <div className="sign__form">
                    <Link href="/" className="sign__logo">
                      <Image 
                        src="/core/assets/img/logo.svg" 
                        alt="CineHub" 
                        width={120} 
                        height={40} 
                      />
                    </Link>

                    <h3 className="sign__title">Sign in</h3>

                    <Form
                      fields={loginFields}
                      onSubmit={handleLogin}
                      submitText="Sign in"
                      variant="default"
                    />

                    <span className="sign__text">
                      Don&apos;t have an account? <Link href="/signup">Sign up!</Link>
                    </span>

                    <span className="sign__text">
                      <Link href="/forgot">Forgot password?</Link>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Footer />
    </>
  );
}