import Stripe from 'stripe';
import { NextFunction } from 'express';
import catchAsync from '../utils/catchAsync';
import Tour from '../models/tourModel';
import Booking from '../models/bookingModel';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const getCheckoutSession = catchAsync(
    async (req: any, res: any, next: NextFunction) => {
        // 1) Get the tour
        const tour = await Tour.findById(req.params.tourId);

        if (!tour) {
            return next(new Error('Tour not found'));
        }

        // 2) Create checkout session
        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
            cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
            customer_email: req.user.email,
            client_reference_id: req.params.tourId,
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `${tour.name} tour`,
                            description: tour.summary,
                            images: [`https://natours.dev/img/tours/${tour.imageCover}`],
                        },
                        unit_amount: tour.price * 100, // cents
                    },
                    quantity: 1,
                },
            ],
        });

        // 3) Send response
        res.status(200).json({
            status: 'success',
            session,
        });
    }
);

const createBookingCheckout = catchAsync(async (req: any, res: any, next: NextFunction) => {
    // 1) This is only TEMPORARY, because it is UNSECURE: everyone can make bookings without paying
    const { user, tour, price } = req.query;
    if (!user && !tour && !price) {
        return next()
    }
    await Booking.create({ user, tour, price });
    res.redirect(req.originalUrl.split('?')[0]);
})

export { getCheckoutSession, createBookingCheckout };
