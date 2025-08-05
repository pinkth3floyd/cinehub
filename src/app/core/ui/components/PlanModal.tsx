'use client';

import Modal from '../elements/Modal';
import Form from './Form';

const planFormFields = [
  {
    name: 'fullname',
    label: 'Name',
    type: 'text' as const,
    placeholder: 'Full name',
    required: true
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email' as const,
    placeholder: 'example@domain.com',
    required: true
  },
  {
    name: 'plan',
    label: 'Choose plan:',
    type: 'select' as const,
    required: true,
    options: [
      { value: '35', label: 'Premium - $34.99' },
      { value: '50', label: 'Cinematic - $49.99' }
    ]
  }
];

const paymentMethods = [
  { id: 'visa', label: 'Visa', value: 'visa' },
  { id: 'mastercard', label: 'Mastercard', value: 'mastercard' },
  { id: 'paypal', label: 'Paypal', value: 'paypal' }
];

export default function PlanModal() {
  const handlePlanSubmit = (data: Record<string, string>) => {
    console.log('Plan selected:', data);
    // Handle plan selection and payment
  };

  return (
    <Modal
      id="plan-modal"
      title="Select plan"
      size="md"
      centered
    >
      <div className="modal__content">
        <Form
          fields={planFormFields}
          onSubmit={handlePlanSubmit}
          submitText="Proceed"
          variant="modal"
          className="modal__form"
        />
        
        <div className="sign__group">
          <label className="sign__label">Payment method:</label>
          <ul className="sign__radio">
            {paymentMethods.map((method) => (
              <li key={method.id}>
                <input
                  id={method.id}
                  type="radio"
                  name="paymentMethod"
                  value={method.value}
                  defaultChecked={method.id === 'visa'}
                />
                <label htmlFor={method.id}>{method.label}</label>
              </li>
            ))}
          </ul>
        </div>

        <div className="sign__group">
          <span className="sign__text">
            You can spend money from your account on the renewal of the connected packages, or to order cars on our website.
          </span>
        </div>
      </div>
    </Modal>
  );
} 