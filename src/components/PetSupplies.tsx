import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Package, Star, Truck } from "lucide-react";

interface Pet {
  species: string;
  name: string;
  weight: number;
  age: number;
}

interface Supply {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  sizes: string[];
  category: 'food' | 'litter' | 'treats' | 'toys';
  species: string[];
}

interface PetSuppliesProps {
  pet: Pet;
}

export const PetSupplies = ({ pet }: PetSuppliesProps) => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>("food");
  const [cart, setCart] = useState<{[key: string]: {item: Supply, size: string, quantity: number}}>();

  // Sample supplies data
  const supplies: Supply[] = [
    {
      id: "1",
      name: "Premium Dog Food - Chicken & Rice",
      price: 29.99,
      rating: 4.8,
      reviews: 1245,
      image: "🥘",
      description: "High-quality protein with real chicken as the first ingredient",
      sizes: ["5 lbs", "15 lbs", "30 lbs"],
      category: "food",
      species: ["dog"]
    },
    {
      id: "2", 
      name: "Clumping Cat Litter - Unscented",
      price: 14.99,
      rating: 4.6,
      reviews: 892,
      image: "🗂️",
      description: "99% dust-free, superior odor control, easy scooping",
      sizes: ["14 lbs", "28 lbs", "42 lbs"],
      category: "litter",
      species: ["cat"]
    },
    {
      id: "3",
      name: "Natural Cat Food - Salmon Recipe",
      price: 32.99,
      rating: 4.9,
      reviews: 756,
      image: "🐟",
      description: "Wild-caught salmon with added vitamins and minerals",
      sizes: ["3 lbs", "7 lbs", "14 lbs"],
      category: "food",
      species: ["cat"]
    },
    {
      id: "4",
      name: "Premium Dog Treats - Training Size",
      price: 12.99,
      rating: 4.7,
      reviews: 634,
      image: "🦴",
      description: "Small, soft training treats perfect for positive reinforcement",
      sizes: ["6 oz", "12 oz", "24 oz"],
      category: "treats",
      species: ["dog"]
    },
    {
      id: "5",
      name: "Crystal Cat Litter - Odor Control",
      price: 18.99,
      rating: 4.4,
      reviews: 423,
      image: "💎",
      description: "Long-lasting crystal formula with superior moisture absorption",
      sizes: ["8 lbs", "16 lbs", "24 lbs"],
      category: "litter", 
      species: ["cat"]
    },
    {
      id: "6",
      name: "Grain-Free Dog Food - Beef Recipe",
      price: 45.99,
      rating: 4.8,
      reviews: 891,
      image: "🥩",
      description: "Premium grain-free formula with deboned beef and sweet potato",
      sizes: ["4 lbs", "12 lbs", "24 lbs"],
      category: "food",
      species: ["dog"]
    }
  ];

  // Filter supplies based on pet species and category
  const filteredSupplies = supplies.filter(supply => 
    supply.species.includes(pet.species) && 
    (selectedCategory === "all" || supply.category === selectedCategory)
  );

  const addToCart = (supply: Supply, size: string) => {
    toast({
      title: "Added to Cart",
      description: `${supply.name} (${size}) added to your cart`,
    });
  };

  const quickOrder = (supply: Supply) => {
    toast({
      title: "Quick Order Placed",
      description: `${supply.name} will be delivered in 2-3 days`,
    });
  };

  const categories = pet.species === "cat" 
    ? [
        { value: "all", label: "All Items" },
        { value: "food", label: "Cat Food" },
        { value: "litter", label: "Cat Litter" },
        { value: "treats", label: "Treats" }
      ]
    : [
        { value: "all", label: "All Items" },
        { value: "food", label: "Dog Food" },
        { value: "treats", label: "Treats" }
      ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Pet Supplies</h2>
          <p className="text-muted-foreground">Order essentials for {pet.name}</p>
        </div>
        
        <Button variant="outline" className="flex items-center space-x-2">
          <ShoppingCart className="h-4 w-4" />
          <span>Cart (0)</span>
        </Button>
      </div>

      {/* Category Filter */}
      <div className="flex items-center space-x-4">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Badge variant="secondary" className="flex items-center space-x-1">
          <Truck className="h-3 w-3" />
          <span>Free delivery on orders $35+</span>
        </Badge>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSupplies.map((supply) => (
          <Card key={supply.id} className="group hover:shadow-float transition-all duration-300 transform hover:scale-105">
            <CardHeader className="pb-4">
              <div className="text-center">
                <div className="text-4xl mb-3">{supply.image}</div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs">
                    {supply.category.charAt(0).toUpperCase() + supply.category.slice(1)}
                  </Badge>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{supply.rating}</span>
                    <span>({supply.reviews})</span>
                  </div>
                </div>
              </div>
              <CardTitle className="text-lg leading-tight">{supply.name}</CardTitle>
              <CardDescription className="text-sm">{supply.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-primary">${supply.price}</div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Package className="h-3 w-3" />
                  <span>In stock</span>
                </div>
              </div>

              <div className="space-y-2">
                <Select onValueChange={(size) => addToCart(supply, size)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose size" />
                  </SelectTrigger>
                  <SelectContent>
                    {supply.sizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => addToCart(supply, supply.sizes[0])}
                  >
                    <ShoppingCart className="h-3 w-3 mr-1" />
                    Add to Cart
                  </Button>
                  <Button 
                    variant="gradient" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => quickOrder(supply)}
                  >
                    <Truck className="h-3 w-3 mr-1" />
                    Quick Order
                  </Button>
                </div>
              </div>

              <div className="text-xs text-muted-foreground text-center">
                🚚 Free delivery by tomorrow
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSupplies.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📦</div>
          <h3 className="text-lg font-semibold mb-2">No supplies found</h3>
          <p className="text-muted-foreground">
            No {selectedCategory === "all" ? "supplies" : selectedCategory} available for {pet.species}s at the moment.
          </p>
        </div>
      )}
    </div>
  );
};