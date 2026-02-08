import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import CartClient from './cart-client';

export const metadata = {
  title: 'Shopping Cart | CountyConnect',
  description: 'View and manage your shopping cart',
};

export default async function CartPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/account/cart');
  }

  return <CartClient />;
}
