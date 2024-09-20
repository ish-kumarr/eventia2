// components/Checkout.tsx
import React, { useEffect, useState } from 'react';
import { IEvent } from '@/lib/database/models/event.model';
import { Button } from '../ui/button';
import { useUser } from '@clerk/nextjs';
import Modal from '../ui/Modal';

const Checkout = ({ event, userId }: { event: IEvent, userId: string }) => {
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    loadRazorpayScript();
  }, []);

  const onCheckout = async () => {
    if (event.isFree) {
      // Handle free event ticket
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: event._id,
          userId,
          amount: 0,
        }),
      });

      if (response.ok) {
        setIsModalOpen(true);
      } else {
        console.error('Failed to create order for free event');
      }
    } else {
      // Handle paid event ticket
      const priceInPaise = Number(event.price) * 100;
      const contactNumber = user?.publicMetadata?.contactNumber;

      const response = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: event._id,
          userId,
          amount: priceInPaise,
        }),
      });

      const data = await response.json();

      if (!data.orderId) {
        console.error('Failed to create order');
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: 'INR',
        name: 'Eventia',
        description: event.title,
        order_id: data.orderId,
        handler: async function (response: any) {
          const orderResponse = await fetch('/api/create-order', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              eventId: event._id,
              userId,
              amount: data.amount,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });

          const emailResponse = await fetch('/api/send-confirmation-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              userId,
              eventTitle: event.title,
              userEmail: user?.emailAddresses[0].emailAddress,
              amountPaid: data.amount,
            }),
          });

          if (emailResponse.ok) {
            console.log('Confirmation email sent successfully');
          } else {
            console.error('Failed to send confirmation email');
          }
        },
        prefill: {
          name: user?.firstName + ' ' + user?.lastName,
          email: user?.emailAddresses[0].emailAddress,
          contact: contactNumber || '',
        },
        theme: {
          color: '#3399cc',
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    }
  };

  return (
    <>
      <Button onClick={onCheckout} size="lg" className="button sm:w-fit">
        {event.isFree ? 'Get Ticket' : 'Buy Ticket'}
      </Button>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message="Your ticket has been successfully booked. Please check your profile for more details."
      />
    </>
  );
};

export default Checkout;
