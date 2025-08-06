'use client';

import { Header, Footer, Form, Section } from '../core/ui';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { adminLogin } from '../core/entities/auth/actions';
import { Suspense } from 'react';

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

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/admin';

  const loginMutation = useMutation({
    mutationFn: adminLogin,
    onSuccess: (data) => {
      if (data.success) {
        // Redirect to admin dashboard or the original requested page
        router.push(redirectTo);
      }
    },
  });

  const handleLogin = (data: Record<string, string>) => {
    loginMutation.mutate({
      email: data.email,
      password: data.password,
    });
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
                      {/* <Image 
                        src="/core/assets/img/logo.svg" 
                        alt="CineHub" 
                        width={120} 
                        height={40} 
                      /> */}
                      <h1>CineHub</h1>
                    </Link>

                    <h3 className="sign__title">Admin Sign in</h3>

                    <Form
                      fields={loginFields}
                      onSubmit={handleLogin}
                      submitText={loginMutation.isPending ? "Signing in..." : "Sign in"}
                      variant="default"
                      isLoading={loginMutation.isPending}
                    />

                    {loginMutation.error && (
                      <div className="alert alert-danger mt-3">
                        <i className="ti ti-alert-triangle me-2"></i>
                        {loginMutation.error.message || 'Login failed. Please try again.'}
                      </div>
                    )}

                    <span className="sign__text">
                      <i className="ti ti-info-circle me-2"></i>
                      Use admin credentials from environment variables
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

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="sign">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="sign__content">
                <div className="sign__form">
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Loading login form...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}