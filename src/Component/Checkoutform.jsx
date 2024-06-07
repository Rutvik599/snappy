import React, { useEffect } from 'react';
import { LinkAuthenticationElement, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import '../style/Checkoutform.css';
import { ArrowLeft } from 'lucide-react';

export default function Checkoutform(props) {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();

    useEffect(() => {
        if (!stripe) {
            return;
        }

        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );

        if (!clientSecret) {
            return;
        }

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            switch (paymentIntent.status) {
                case "succeeded":
                    console.log("Payment is Complete");
                    storeOrderDetails();
                    break;
                case "processing":
                    console.log("Payment in Processing");
                    break;
                case "requires_payment_method":
                    console.log("Your Payment is not Successful");
                    break;
                default:
                    console.log("Something went wrong ... !");
                    break;
            }
        });

    }, [stripe]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        try {
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {},
                redirect: 'if_required'
            });

            if (error) {
                if (error.type === "card_error" || error.type === "validation_error") {
                    console.log(error.message);
                } else {
                    console.log(error.message);
                }
            } else {
                if (paymentIntent && paymentIntent.status === 'succeeded') {
                    alert("Payment Successful..");
                    // Store order details in Firestore
                    storeOrderDetails();
                } else {
                    console.log('Payment confirmation status:', paymentIntent.status);
                    alert('Payment processing. Please wait.');
                }
            }
        } catch (error) {
            console.error('Error during payment confirmation:', error);
            alert('Payment failed. Please try again.');
        }
    };

    const paymentElementOptions = {
        layout: "accordion"
    };

    const handleBack = () => {
        props.toggleCart();
    };

    
    const storeOrderDetails = async () => {
        const data = {
            userId: props.userId,
            cartData: props.cartData,
            totalBill:props.totalBill
          };
      
          try {
            const response = await fetch('http://localhost:3939/storeCartValue', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
            });
      
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            document.cookie = 'cart=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            const responseData = await response.json();
            alert('Cart data stored successfully!');
            navigate('/');
          } catch (error) {
            console.error('Error storing cart data:', error);
            alert('Failed to store cart data. Please try again.');
          }
    };
    
    

    return (
        <div className='paymentdiv'>
            <form id='payment-form' onSubmit={handleSubmit} className='formofpayment'>
                <div className="header">
                    <button onClick={() => handleBack()}><ArrowLeft /></button>
                    <h1>Payment</h1>
                </div>
                <LinkAuthenticationElement id='link-authentication-element' />
                <PaymentElement id='payment-element' options={paymentElementOptions} />
                <button id='submit' className='paynow'><span>Pay</span> <kbd>Rs.{props.totalBill}.00</kbd></button>
            </form>
        </div>
    );
}
