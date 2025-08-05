'use client';

import Link from 'next/link';
import { Header, Footer, Accordion } from '../core/ui';

// FAQ data
const faqItems = [
  {
    id: '1',
    title: 'Why is a video is not loading?',
    content: 'It is a long established fact that a reader will be distracted by the readable content of a page <b>when looking at its layout</b>. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English.'
  },
  {
    id: '2',
    title: 'Why isn\'t there a HD version of this video?',
    content: 'Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).'
  },
  {
    id: '3',
    title: 'Why is the sound distorted?',
    content: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don\'t look even slightly believable.'
  },
  {
    id: '4',
    title: 'Why is the Video stuttering, buffering or randomly stopping?',
    content: 'If you are going to use a passage of Lorem Ipsum, you need to be sure there isn\'t anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.'
  },
  {
    id: '5',
    title: 'How do I make the video go fullscreen?',
    content: 'If you are going to use a passage of Lorem Ipsum, you need to be sure there isn\'t anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.'
  },
  {
    id: '6',
    title: 'What browsers are supported?',
    content: 'It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.'
  },
  {
    id: '7',
    title: 'How do you handle my privacy?',
    content: 'Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).'
  },
  {
    id: '8',
    title: 'How can I contact you?',
    content: 'Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).'
  }
];

export default function FAQPage() {
  return (
    <>
      <Header />
      
      {/* Page Title */}
      <section className="section section--first">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section__wrap">
                <h1 className="section__title section__title--head">FAQ</h1>
                
                <ul className="breadcrumbs">
                  <li className="breadcrumbs__item">
                    <Link href="/">Home</Link>
                  </li>
                  <li className="breadcrumbs__item breadcrumbs__item--active">FAQ</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section section--notitle">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <Accordion items={faqItems} />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
