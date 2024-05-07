"use client"

import DeliveryInfo from "@/app/_components/delivery-info";
import DiscountBadge from "@/app/_components/discount-badge";
import ProductList from "@/app/_components/product-list";
import { Button } from "@/app/_components/ui/button";
import { calculateProductTotalPrice, formatCurrency } from "@/app/_helpers/price";
import { Prisma } from "@prisma/client";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ProductDetailProps { 
    product: Prisma.ProductGetPayload<{
        include: {
            restaurant: true
        }
    }>
    complementaryProducts: Prisma.ProductGetPayload<{
        include: {
            restaurant: true
        }
    }>[]
}

const ProductDetails = ({ product, complementaryProducts }: ProductDetailProps) => {
    const [quantity, setQuantity] = useState(1)

    const handleIncreaseQuantityClick = () => setQuantity((currentState) => currentState + 1)
    const handleDecreaseQuantityClick = () => setQuantity((currentState) => {
        if (currentState == 1) return 1

        return currentState - 1
    })
    
    return (  
        <div className="py-5 rounded-tl-3xl rounded-tr-3xl bg-white mt-[-1.5rem] z-50 relative">
            {/*/Nome restaraunte*/}
            <div className="flex items-center px-5 gap-[0.375rem]">
                <div className="relative h-6 w-6">
                    <Image
                        src={product.restaurant.imageUrl}
                        alt={product.restaurant.name}
                        fill
                        className="rounded-full object-cover"
                    />
                </div>
                <span className="text-xs text-muted-foreground">{product.restaurant.name}</span>
            </div>

            <h1 className="font-semibold text-xl px-5 mb-2 mt-1">{product.name}</h1>

            <div className="flex px-5 justify-between">
                <div>
                    {/*/Preço com desconto */}
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-semibold">
                            {formatCurrency(calculateProductTotalPrice(product))}
                        </h2>

                        {product.discountPercentage > 0 && (
                            <DiscountBadge product={product}/>
                        )}
                    </div>

                    {/*/Preço original */}
                    {product.discountPercentage > 0 && (
                        <p className="text-sm text-muted-foreground">De: {formatCurrency(Number(product.price))}</p>
                    )}
                </div>

                {/**Quantidade */}
                <div className="flex items-center gap-3 text-center">
                    <Button 
                        size="icon" 
                        variant="ghost" 
                        className="border border-solid border-muted-foreground"
                        onClick={handleDecreaseQuantityClick}
                    >
                        <ChevronLeftIcon/>
                    </Button>
                    <span className="w-4">{quantity}</span>
                    <Button  size="icon" onClick={handleIncreaseQuantityClick}>
                        <ChevronRightIcon/>
                    </Button>
                </div>
            </div>

            <div className="px-5">
                <DeliveryInfo restaurant={product.restaurant}/>
            </div>
            {/**Dados da entrega */}

            <div className="mt-6 px-5 space-y-3">
                <h3 className="font-semibold">Sobre</h3>
                <p className="text-sm text-muted-foreground">{product.description}</p>
            </div>

            <div className="mt-6 space-y-3">
                <h3 className="font-semibold px-5">Sucos</h3>
                <ProductList products={complementaryProducts}/>
            </div>

            <div className="px-5 mt-6">
                <Button className="w-full font-semibold">Adicionar a sacola</Button></div>
        </div>
    );
}
 
export default ProductDetails;