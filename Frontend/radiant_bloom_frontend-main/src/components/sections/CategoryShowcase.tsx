import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAllCategories } from "@/store/slices/categorySlice";

const CategoryShowcase = () => {
  const categories = useSelector(selectAllCategories);

  return (
    <section className="py-8 bg-muted/30 border-b">
      <div className="container mx-auto px-4">
        {/* Mobile Slider - Hidden on desktop */}
        <div className="lg:hidden flex gap-4 overflow-x-auto py-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className="flex flex-col items-center flex-shrink-0 cursor-pointer min-w-[70px]"
            >
              <div className="relative w-16 h-16 mb-2 transition-transform duration-300 hover:scale-110">
                <div className="w-full h-full rounded-full bg-orange-300"></div>
                <img
                  src={category.image || `/pics/img${(categories.indexOf(category) % 8) + 1}.png`}
                  alt={category.name}
                  className="absolute bottom-0 left-0 w-full h-[130%] object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `/pics/img${(categories.indexOf(category) % 8) + 1}.png`;
                  }}
                />
              </div>
              <span className="text-xs font-medium text-center hover:text-secondary transition-colors">
                {category.name}
              </span>
            </Link>
          ))}
        </div>

        {/* Desktop Grid - Hidden on mobile */}
        <div className="hidden lg:flex justify-between items-center gap-8 py-4">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className="flex flex-col items-center cursor-pointer flex-1"
            >
              <div className="relative w-20 h-20 mb-2 transition-transform duration-300 hover:scale-110">
                <div className="w-full h-full rounded-full bg-orange-300"></div>
                <img
                  src={category.image || `/pics/img${(categories.indexOf(category) % 8) + 1}.png`}
                  alt={category.name}
                  className="absolute bottom-0 left-0 w-full h-[130%] object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `/pics/img${(categories.indexOf(category) % 8) + 1}.png`;
                  }}
                />
              </div>
              <span className="text-sm font-medium text-center hover:text-secondary transition-colors">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;