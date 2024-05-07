import { db } from "../../_lib/prisma";
import { notFound } from "next/navigation";
import ProductImage from "./components/product-image";
import ProductDetails from "./components/product-details";

interface ProductPageProps {
    params: {
        id: string
    }
}

const ProductPage = async ({ params: { id } }: ProductPageProps) => {
    const product = await db.product.findUnique({
        where: {
            id,
        },
        include: {
            restaurant: true
        }
    })

    const juices = await db.product.findMany({
        where: {
            category: {
                name: "Sucos"
            },
            restaurant: {
                id: product?.restaurant.id
            }
        },
        include: {
            restaurant: true
        }
    })

    if(!product){
        return notFound()
    }
    
    return ( 
        <div>
            {/*/Imagem*/}
            <ProductImage product={product}/>

            {/*/Titulo e preço*/}
            <ProductDetails product={product} complementaryProducts={juices}/>
        </div>
     );
}
 
export default ProductPage;