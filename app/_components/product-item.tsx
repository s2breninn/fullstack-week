import { Prisma, Product } from "@prisma/client";
import Image from "next/image";
import { calculateProductTotalPrice, formatCurrency } from "../_helpers/price";
import { ArrowDownIcon } from "lucide-react";

interface ProductItemProps {
    product: Prisma.ProductGetPayload<{
        include: {
            restaurant: {
                select: {
                    name: true
                }
            }
        }
    }>
}

const ProductItem = ({ product }: ProductItemProps) => {
    return (
        <div className="space-y-2 w-full">
            <div className="w-full h-[150px] relative">
                <Image 
                    src={product.imageUrl} 
                    alt={product.name} 
                    fill 
                    className="object-cover rounded-lg shadow-md"
                />

                {product.discountPercentage && (
                    <div className="flex items-center absolute gap-[2px] left-2 top-2 bg-primary px-2 py-[2px] rounded-full text-white">
                        <ArrowDownIcon size={12}/>
                        <span className="text-xs font-semibold">
                            {product.discountPercentage}%
                        </span>
                    </div>
                )}
            </div>

            <div>
                <h2 className="text-sm truncate">{product.name}</h2>
                <div className="flex gap-1 items-center">
                    <h3 className="font-semibold">
                        {formatCurrency(calculateProductTotalPrice(product))}
                    </h3>
                    {product.discountPercentage > 0 && (
                        <span className="text-muted-foreground line-through text-xs">
                            {formatCurrency(Number(product.price))}
                        </span>
                    )}
                </div>
            </div>
            <span className="text-xs block text-muted-foreground">{product.restaurant.name}</span>
        </div>
    )
}
 
export default ProductItem;