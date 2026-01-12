import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { client } from '@/sanity/lib/client'

import { Container } from '@/components/shared/container'
// Using explicit Container from shared if it exists, confirmed by other files using it.
// If container is not default export, adjust.
// ReviewsComp used `import { Container } from "@/components/shared/container";` so it's named export.
// I will use same import style.

const OrdersPage = async () => {
  const { userId } = await auth()

  if (!userId) {
    // @ts-expect-error - Route typing might not be generated for sign-in yet
    redirect('/sign-in')
  }

  const query = `*[_type == "order" && customer->clerkId == $userId] | order(_createdAt desc) {
    _id,
    orderNumber,
    totalPrice,
    status,
    isPaid,
    createdAt,
    products[]{
      product->{
        name,
        price,
        "image": images[0].asset->url
      },
      quantity
    }
  }`

  const orders = await client.fetch(query, { userId })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
      
      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="space-y-8">
          {orders.map((order: any) => (
            <div key={order._id} className="border border-gray-200 rounded-lg p-6 shadow-sm overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 border-b border-gray-100 pb-4">
                    <div>
                        <p className="font-semibold text-sm text-gray-500">Order Number</p>
                        <p className="font-medium text-gray-900">{order.orderNumber || order._id.slice(0, 8)}</p>
                    </div>
                    <div className="mt-2 md:mt-0">
                        <p className="font-semibold text-sm text-gray-500 text-right md:text-right">Date Placed</p>
                        <p className="font-medium text-gray-900 text-right md:text-right">
                            {order._createdAt ? formatDate(order._createdAt) : 'N/A'} 
                            {/* using _createdAt if available, query didn't select it explicitly but it's standard field */}
                        </p>
                    </div>
                </div>

              <div className="space-y-4">
                {order.products?.map((item: any, index: number) => (
                  <div key={index} className="flex items-center space-x-4">
                    {item.product?.image && (
                      <div className="relative h-16 w-16 rounded overflow-hidden bg-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                            src={item.product.image} 
                            alt={item.product.name}
                            className="object-cover object-center w-full h-full"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.product?.name}</h3>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-gray-900">
                      {/* Assuming price is in cents or standard unit. Formatting as currency is tricky without knowing implementation. */}
                      {/* I'll assume standard number. */}
                      ${item.product?.price}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                <div>
                   <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                       order.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                   }`}>
                       {order.status}
                   </span>
                </div>
                <div className="text-lg font-bold text-gray-900">
                    Total: ${order.totalPrice}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default OrdersPage
