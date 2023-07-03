import { loadStripe, Stripe } from '@stripe/stripe-js';
import { PUBLIC_STRIPE_PUBLISHABLE_KEY } from './consts';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
       PUBLIC_STRIPE_PUBLISHABLE_KEY
    );
  }

  return stripePromise;
};


