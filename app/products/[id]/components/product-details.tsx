"use client"

import DiscountBadge from "@/app/_components/discount-badge";
import ProductList from "@/app/_components/product-list";
import { Button } from "@/app/_components/ui/button";
import { Card } from "@/app/_components/ui/card";
import { calculateProductTotalPrice, formatCurrency } from "@/app/_helpers/price";
import { Prisma } from "@prisma/client";
import { BikeIcon, ChevronLeftIcon, ChevronRightIcon, TimerIcon } from "lucide-react";
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
        <div className="py-5">
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
                <span className="text-xs text-muted-foreground">{product.name}</span>
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
                <Card className="flex justify-around py-2 mt-6">
                    {/** Entrega valor*/}
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1 text-muted-foreground">
                            <span className="text-xs">Entrega</span>
                            <BikeIcon size={14}/>
                        </div>

                        {Number(product.restaurant.deliveryFee) > 0 ? (
                            <p className="text-xs font-semibold">
                                {formatCurrency(Number(product.restaurant.deliveryFee))}
                            </p>
                        ) : (
                            <p className="text-xs font-semibold">
                                Grátis
                            </p>
                        )}
                    </div>

                    {/** Entrega tempo*/}
                    <div className="flex flex-col px-5 items-center">
                        <div className="flex items-center gap-1 text-muted-foreground">
                            <span className="text-xs">Entrega</span>
                            <TimerIcon size={14}/>
                        </div>

                        {/** 
                         * {Number(product.restaurant.deliveryFee) > 0 ? (
                            <p className="text-xs font-semibold">
                                {formatCurrency(Number(product.restaurant.deliveryFee))}
                            </p>
                        ) : (
                            <p className="text-xs font-semibold">
                                Grátis
                            </p>
                        )}
                        */}
                        
                        <p className="text-xs font-semibold">
                            {product.restaurant.deliveryTimeMinutes} min
                        </p>
                    </div>
                </Card>
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
        </div>
    );
}
 
export default ProductDetails;