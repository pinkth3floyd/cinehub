'use client';

import Link from 'next/link';
import { Header, Footer } from '../core/ui';

export default function PrivacyPage() {
  return (
    <>
      <Header />
      
      {/* Page Title Section */}
      <section className="section section--first">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section__wrap">
                <h1 className="section__title section__title--head">Privacy policy</h1>
                <ul className="breadcrumbs">
                  <li className="breadcrumbs__item">
                    <Link href="/">Home</Link>
                  </li>
                  <li className="breadcrumbs__item breadcrumbs__item--active">Privacy policy</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Content Section */}
      <section className="section">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <p className="section__text">
                It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using &apos;Content here, content here&apos;, making it look like readable English.
              </p>

              <p className="section__text">
                Many desktop publishing packages and <a href="#">web page</a> editors now use Lorem Ipsum as their default model text, and a search for &apos;lorem ipsum&apos; will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
              </p>

              <p className="section__text">
                All the Lorem Ipsum generators on the <b>Internet</b> tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.
              </p>

              <div className="section__list">
                <ol>
                  <li>
                    <h4>Determination of personal information of users</h4>
                    <ol>
                      <li>
                        If you are going to use a passage of Lorem Ipsum:
                        <ol>
                          <li>
                            All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.
                          </li>
                          <li>
                            It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.
                          </li>
                        </ol>
                      </li>
                      <li>
                        There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don&apos;t look even slightly believable.
                      </li>
                      <li>
                        Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for &apos;lorem ipsum&apos; will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
                      </li>
                    </ol>
                  </li>

                  <li>
                    <h4>Reasons for collecting and processing user personal information</h4>
                    <ol>
                      <li>
                        It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.
                      </li>
                      <li>
                        All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet:
                        <ol>
                          <li>It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged;</li>
                          <li>It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages;</li>
                          <li>Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like);</li>
                          <li>Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text;</li>
                        </ol>
                      </li>
                    </ol>
                  </li>

                  <li>
                    <h4>How we collect and use your information</h4>
                    <ol>
                      <li>
                        <strong>Information you provide to us:</strong>
                        <ol>
                          <li>Account information when you create an account or update your profile</li>
                          <li>Payment information when you subscribe to our services</li>
                          <li>Communications you send to us, including feedback and support requests</li>
                          <li>Content you upload, such as reviews, ratings, and watchlists</li>
                        </ol>
                      </li>
                      <li>
                        <strong>Information we collect automatically:</strong>
                        <ol>
                          <li>Usage data, including what content you watch, search queries, and viewing preferences</li>
                          <li>Device information, including IP address, browser type, and operating system</li>
                          <li>Location data (with your consent) to provide localized content</li>
                          <li>Cookies and similar technologies to enhance your experience</li>
                        </ol>
                      </li>
                    </ol>
                  </li>

                  <li>
                    <h4>How we share your information</h4>
                    <ol>
                      <li>
                        <strong>Service providers:</strong> We may share your information with trusted third-party service providers who help us operate our platform, process payments, and provide customer support.
                      </li>
                      <li>
                        <strong>Legal requirements:</strong> We may disclose your information if required by law or to protect our rights, property, or safety.
                      </li>
                      <li>
                        <strong>Business transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction.
                      </li>
                      <li>
                        <strong>With your consent:</strong> We will only share your information with third parties when you have given us explicit consent to do so.
                      </li>
                    </ol>
                  </li>

                  <li>
                    <h4>Your rights and choices</h4>
                    <ol>
                      <li>
                        <strong>Access and update:</strong> You can access and update your account information at any time through your account settings.
                      </li>
                      <li>
                        <strong>Data portability:</strong> You can request a copy of your personal data in a structured, machine-readable format.
                      </li>
                      <li>
                        <strong>Deletion:</strong> You can request deletion of your account and associated data, subject to certain legal obligations.
                      </li>
                      <li>
                        <strong>Opt-out:</strong> You can opt out of marketing communications and certain data processing activities.
                      </li>
                      <li>
                        <strong>Cookies:</strong> You can manage cookie preferences through your browser settings.
                      </li>
                    </ol>
                  </li>

                  <li>
                    <h4>Data security</h4>
                    <ol>
                      <li>
                        We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                      </li>
                      <li>
                        We regularly review and update our security practices to ensure the highest level of protection for your data.
                      </li>
                      <li>
                        While we strive to protect your information, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                      </li>
                    </ol>
                  </li>

                  <li>
                    <h4>Children&apos;s privacy</h4>
                    <ol>
                      <li>
                        Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
                      </li>
                      <li>
                        If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information promptly.
                      </li>
                    </ol>
                  </li>

                  <li>
                    <h4>International data transfers</h4>
                    <ol>
                      <li>
                        Your information may be transferred to and processed in countries other than your own, where data protection laws may differ.
                      </li>
                      <li>
                        We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards to protect your information.
                      </li>
                    </ol>
                  </li>

                  <li>
                    <h4>Changes to this privacy policy</h4>
                    <ol>
                      <li>
                        We may update this privacy policy from time to time to reflect changes in our practices or applicable laws.
                      </li>
                      <li>
                        We will notify you of any material changes by posting the updated policy on our website and updating the &quot;Last updated&quot; date.
                      </li>
                      <li>
                        Your continued use of our services after such changes constitutes acceptance of the updated privacy policy.
                      </li>
                    </ol>
                  </li>

                  <li>
                    <h4>Contact us</h4>
                    <ol>
                      <li>
                        If you have any questions about this privacy policy or our data practices, please contact us at:
                        <ul>
                          <li>Email: privacy@cinehub.com</li>
                          <li>Phone: +1 (555) 123-4567</li>
                          <li>Address: 123 Movie Street, Entertainment City, EC 12345</li>
                        </ul>
                      </li>
                      <li>
                        We will respond to your inquiry within 30 days of receipt.
                      </li>
                    </ol>
                  </li>
                </ol>
              </div>

              <div className="section__text" style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <p><strong>Last updated:</strong> January 15, 2024</p>
                <p>
                  This privacy policy is effective as of the date listed above and applies to all users of CineHub services. 
                  By using our platform, you acknowledge that you have read and understood this privacy policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
} 