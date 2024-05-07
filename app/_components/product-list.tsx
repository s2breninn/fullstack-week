import { Prisma } from "@prisma/client";
import ProductItem from "./product-item";

interface ProductListProps {
    products: Prisma.ProductGetPayload<{
        include: {
            restaurant: {
                select: {
                    name: true
                }
            }
        }
    }>[]
}

const ProductList = ({ products }: ProductListProps) => {
    return ( 
        <div className="flex px-5 overflow-x-scroll [&::-webkit-scrollbar]:hidden gap-4">
            {products.map((product) => (
                <ProductItem key={product.id} product={product}/>
            ))}
        </div>
     );
}
 
export default ProductList;