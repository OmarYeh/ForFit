<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;

class PaymentController extends Controller
{
    public function __construct()
    {
        Stripe::setApiKey(env('STRIPE_SECRET'));
    }

    /**
     * Show the payment form (if needed).
     */
    public function showPaymentForm()
    {
        // You can add logic to render a payment form if needed
    }

    /**
     * Create a Payment Intent for Stripe.
     */
    public function createPaymentIntent(Request $request)
    {
        try {
            // Validate the request
            $request->validate([
                'amount' => 'required|integer|min:1', // Amount in cents
            ]);
    
            // Log the request data for debugging
            \Log::info('Creating Payment Intent with amount: ' . $request->amount);
    
            // Create a Payment Intent
            $paymentIntent = PaymentIntent::create([
                'amount' => $request->amount, // Amount in cents
                'currency' => 'usd', // Change to your desired currency
                'automatic_payment_methods' => [
                    'enabled' => true,
                ],
            ]);
    
            // Log the Payment Intent for debugging
            \Log::info('Payment Intent created: ' . json_encode($paymentIntent));
    
            // Return the client secret to the client
            return response()->json([
                'clientSecret' => $paymentIntent->client_secret,
            ], 200);
        } catch (\Exception $e) {
            // Log the error for debugging
            \Log::error('Error creating Payment Intent: ' . $e->getMessage());
    
            // Handle errors
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Handle successful payment.
     */
    public function paymentSuccess(Request $request)
    {
        // If payment is successful, return a success message as JSON
        return response()->json([
            'message' => 'Payment was successful!',
            'status' => 'success',
        ], 200);
    }

    /**
     * Handle failed payment.
     */
    public function paymentFailure(Request $request)
    {
        // If payment fails, return a failure message as JSON
        return response()->json([
            'message' => 'Payment failed. Please try again.',
            'status' => 'error',
        ], 400);
    }
}