import { db } from "../_lib/prisma";
import RestaurantItem from "./restaurant-item";

const RestaurantList = async () => {
    // Pegar restaurante com maior número de pedidos
    const restaurants = await db.restaurant.findMany({take: 10})
    
    return ( 
        <div className="flex px-5 overflow-x-scroll [&::-webkit-scrollbar]:hidden gap-4">
            {restaurants.map((restaurant) => (
                <RestaurantItem key={restaurant.id} restaurant={restaurant}/>
            ))}
        </div>
     );
}
 
export default RestaurantList;