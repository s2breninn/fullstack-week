import { db } from "@/app/_lib/prisma";
import { notFound } from "next/navigation";
import RestaurantImage from "./_components/restaurants-image";
import Image from "next/image";
import { StarIcon } from "lucide-react";
import DeliveryInfo from "@/app/_components/delivery-info";
import ProductList from "@/app/_components/product-list";

interface RestaurantPageProps {
    params: {
        id: string
    }
}

const RestaurantPage = async ({ params: { id } }: RestaurantPageProps) => {
    const restaurant = await db.restaurant.findUnique({
        where: {
            id,
        },
        include: {
            categories: {
                orderBy: {
                    createdAt: 'desc'
                },
                include: {
                    products: {
                        where: {
                            restaurantId: id,
                        },
                        include: {
                            restaurant: {
                                select: {
                                    name: true,
                                }
                            }
                        },
                    }
                }
            },
            products: {
                take: 10,
                include: {
                    restaurant: {
                        select: {
                            name: true
                        }
                    }
                }
            }
        }
    })

    if (!restaurant) {
        return notFound()
    }

    return ( 
        <div>
            <RestaurantImage restaurant={restaurant}/>

            <div className="flex items-center justify-between px-5 pt-5 rounded-tl-3xl rounded-tr-3xl bg-white mt-[-1.5rem] z-50 relative">
                {/**Titulo */}
                <div className="flex items-center gap-[0.375rem]">
                    <div className="h-8 w-8 relative">
                        <Image 
                            src={restaurant.imageUrl} 
                            alt={restaurant.name} 
                            fill 
                            className="object-cover rounded-lg shadow-md"
                        />
                    </div>
                    <h1 className="text-xl font-semibold">{restaurant.name}</h1>

                </div>

                {/**Avaliação */}
                <div className="flex items-center  gap-[3px] bg-foreground px-2 py-[2px] rounded-full text-white">
                    <StarIcon size={12} className="fill-yellow-500 text-yellow-400"/>
                    <span className="text-xs font-semibold">5.0</span>
                </div>
            </div>

            <div className="px-5">
                <DeliveryInfo restaurant={restaurant}/>
            </div>

            <div className="flex overflow-x-scroll gap-4 [&::-webkit-scrollbar]:hidden px-5 mt-3">
                {restaurant.categories.map((category) => (
                    <div 
                        key={category.id} 
                        className="bg-[#f4f4f4] min-w-[167px] rounded-lg text-center"
                    >
                        <span className="text-muted-foreground text-sm">{category.name}</span>
                    </div>
                ))}
            </div>

            <div className="mt-6 space-y-4">
                {/**TODO - mostrar prdutos mais pedido quando implementar pedidos */}
                <h2 className="font-semibold px-5">Mais pedido</h2>
                <ProductList products={restaurant.products}/>
            </div>

            {restaurant.categories.map((category) => (
                <div className="mt-6 space-y-4" key={category.id}>
                    {/**TODO - mostrar prdutos mais pedido quando implementar pedidos */}
                    <h2 className="font-semibold px-5">{category.name}</h2>
                    <ProductList products={category.products}/>
                </div>
            ))}
                
        </div>
    );
}               
 
export default RestaurantPage;