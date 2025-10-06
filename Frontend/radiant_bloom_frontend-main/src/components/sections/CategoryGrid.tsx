import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAllCategories } from "@/store/slices/categorySlice";

const CategoryGrid = () => {
  const navigate = useNavigate();
  const categories = useSelector(selectAllCategories);

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gradient-navy">
            Shop by Category
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our curated collection of premium beauty products across all categories
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="card-elegant group cursor-pointer overflow-hidden"
              onClick={() => navigate(`/category/${category.id}`)} // 👈 navigate by slug
            >
              <div className="aspect-square relative overflow-hidden rounded-t-2xl">
                <img
                  src={category.image || `/pics/img${(categories.indexOf(category) % 8) + 1}.png`}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `/pics/img${(categories.indexOf(category) % 8) + 1}.png`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white font-semibold">Shop Now</span>
                </div>
              </div>
              
              <div className="p-4 text-center">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-secondary transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {category.subcategories.length} subcategories
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Featured Categories Banner */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          {/* Skincare */}
          <div className="bg-gradient-orange rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2">Skincare Essentials</h3>
              <p className="mb-4 opacity-90">
                Complete your daily routine with our award-winning skincare collection
              </p>
              <button
                onClick={() => navigate("/category/skincare")} // 👈 navigate
                className="bg-white text-primary px-6 py-3 rounded-xl font-semibold hover:bg-white/90 transition-colors"
              >
                Shop Skincare
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          </div>

          {/* Makeup */}
          <div className="bg-gradient-hero rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2">Makeup Must-Haves</h3>
              <p className="mb-4 opacity-90">
                Create stunning looks with our professional-grade makeup products
              </p>
              <button
                onClick={() => navigate("/category/makeup")} // 👈 navigate
                className="bg-white text-primary px-6 py-3 rounded-xl font-semibold hover:bg-white/90 transition-colors"
              >
                Shop Makeup
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
