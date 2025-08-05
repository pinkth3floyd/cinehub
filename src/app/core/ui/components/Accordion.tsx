'use client';

import React, { useState } from 'react';

export interface AccordionItem {
  id: string;
  title: string;
  content: string;
}

export interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

export default function Accordion({ items, className = '' }: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (itemId: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(itemId)) {
      newOpenItems.delete(itemId);
    } else {
      newOpenItems.add(itemId);
    }
    setOpenItems(newOpenItems);
  };

  const isOpen = (itemId: string) => openItems.has(itemId);

  return (
    <div className={`accordion ${className}`} id="accordion">
      <div className="row">
        {items.map((item, index) => (
          <div key={item.id} className="col-12 col-xl-6">
            <div className="accordion__card">
              <button
                className={isOpen(item.id) ? '' : 'collapsed'}
                type="button"
                onClick={() => toggleItem(item.id)}
                aria-expanded={isOpen(item.id)}
                aria-controls={`collapse${item.id}`}
              >
                {item.title}
                <span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M19,11H5a1,1,0,0,0,0,2H19a1,1,0,0,0,0-2Z"/>
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M19,11H5a1,1,0,0,0,0,2H19a1,1,0,0,0,0-2Z"/>
                  </svg>
                </span>
              </button>

              <div
                id={`collapse${item.id}`}
                className={`collapse ${isOpen(item.id) ? 'show' : ''}`}
                data-bs-parent="#accordion"
              >
                <div className="accordion__content">
                  <p dangerouslySetInnerHTML={{ __html: item.content }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 