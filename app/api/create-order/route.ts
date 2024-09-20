import { NextResponse } from 'next/server';
import Order from '@/lib/database/models/order.model';
import { connectToDatabase } from '@/lib/database';
import { CreateOrderParams } from '@/types';

export async function POST(request: Request) {
  try {
    const { eventId, userId, amount, razorpayPaymentId, razorpayOrderId, razorpaySignature } = await request.json();
    
    await connectToDatabase();

    const newOrder = await Order.create({
      createdAt: new Date(),
      razorpayPaymentId: amount === 0 ? null : razorpayPaymentId,
      razorpayOrderId: amount === 0 ? null : razorpayOrderId,
      razorpaySignature: amount === 0 ? null : razorpaySignature,
      totalAmount: amount,
      event: eventId,
      buyer: userId,
    });

    return NextResponse.json(newOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
