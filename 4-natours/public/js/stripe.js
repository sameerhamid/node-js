const stripe = Stripe("pk_test_51QM0iZSAQ6TXBx5vMZJXB4LwUZBnZdZzPWz1s3DQR6JBa50zIhk5fRFn0D9MBZqvrQdHqW3LHNJmwhyw5pAC5jVS00M6uGFQZx");
import axios from 'axios'
import { showAlert } from './alerts';

// Create a Checkout Session
export async function bookTour(tourId) {
    try {
        // 1) Get checkout session from API
        const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
        console.log('session', session);

        // 2) Create checkout from + charge the credit card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id,
        });
    } catch (error) {
        console.log(error);
        showAlert('error', error)
    }
}
