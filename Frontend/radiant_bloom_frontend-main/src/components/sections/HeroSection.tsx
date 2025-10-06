import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { heroSlides } from "@/data/mockData";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const navigate = useNavigate();

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const getSlideTheme = (theme: string) => {
    switch (theme) {
      case "orange":
        return "bg-gradient-to-r from-orange-400 to-amber-500";
      case "navy":
        return "bg-gradient-to-r from-blue-900 to-indigo-800";
      case "coral":
        return "bg-gradient-to-r from-rose-400 to-red-500";
      default:
        return "bg-gradient-to-r from-orange-400 to-amber-500";
    }
  };

  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
      {/* Background Slides */}
      <div className="absolute inset-0">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 ${getSlideTheme(slide.theme)} opacity-80`}></div>
              
              {/* Dark Overlay for better text contrast */}
              <div className="absolute inset-0 bg-black/30"></div>
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-2xl text-white">
                  <div className="animate-fade-in">
                    <p className="text-sm font-medium uppercase tracking-wider mb-2 opacity-90">
                      {slide.subtitle}
                    </p>
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
                      {slide.title}
                    </h1>
                    <p className="text-xl mb-8 opacity-90 leading-relaxed">
                      {slide.description}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        size="lg"
                        onClick={() => {
                          // ✅ navigate to product list pages
                          if (slide.link) {
                            navigate(slide.link);
                          }
                        }}
                        className="bg-white text-primary hover:bg-white/90"
                      >
                        {slide.cta}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float"></div>
            <div className="absolute bottom-20 right-1/4 w-20 h-20 bg-white/5 rounded-full blur-lg animate-pulse-slow"></div>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="absolute inset-y-0 left-4 flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={prevSlide}
          className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-full p-3 shadow-lg"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>

      <div className="absolute inset-y-0 right-4 flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={nextSlide}
          className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-full p-3 shadow-lg"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Play/Pause Control */}
      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-full p-3 shadow-lg"
        >
          {isAutoPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-8 text-white/80 text-sm animate-bounce">
        <div className="flex flex-col items-center space-y-2">
          <span>Scroll to explore</span>
          <div className="w-px h-8 bg-white/40"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;