import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Filter, Github, Search, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
// import languageAPI from "@/hook/currentLang";
import useCurrentLanguage from "@/hook/currentLang";

const baseUrl = import.meta.env.VITE_MAIN_BE_URL;

export default function Products() {
  const location = useLocation();
  const [visibleCards, setVisibleCards] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [searchTerm, setSearchTerm] = useState("");
  const [samples, setSamples] = useState([]);
  const [filteredSamples, setFilteredSamples] = useState([]);
  const { lang, prefix } = useCurrentLanguage();

  // Đọc tham số category từ URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryFromUrl = params.get("category");
    if (categoryFromUrl) {
      setSelectedCategory(decodeURIComponent(categoryFromUrl)); // Decode trực tiếp để khớp DB
    } else {
      setSelectedCategory("Tất cả"); // Reset khi không có param
    }
  }, [location.search]);

  useEffect(() => {
    const fetchSamples = async () => {
      try {
        const res = await fetch(`${baseUrl}${prefix}/api/web-samples`);
        if (!res.ok) throw new Error("Failed to fetch");
        const result = await res.json();

        const parsedData = (result.data || []).map((item) => ({
          ...item,
          tags:
            typeof item.tags === "string" ? JSON.parse(item.tags) : item.tags,
          tech:
            typeof item.tech === "string" ? JSON.parse(item.tech) : item.tech,
          top_features:
            typeof item.top_features === "string"
              ? JSON.parse(item.top_features)
              : item.top_features,
          export_state: item.export_state ? 1 : 0,
        }));

        const activeData = parsedData.filter((item) => item.export_state === 1);

        setSamples(activeData);
        setFilteredSamples(activeData);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchSamples();
  }, [prefix]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          samples.forEach((_, index) => {
            setTimeout(() => {
              setVisibleCards((prev) => [...prev, index]);
            }, index * 100);
          });
        }
      },
      { threshold: 0.1 }
    );
    const element = document.getElementById("products-section");
    if (element) observer.observe(element);
    return () => observer.disconnect();
  }, [samples]);

  useEffect(() => {
    let filtered = samples;
    if (selectedCategory !== "Tất cả") {
      filtered = filtered.filter(
        (sample) => sample.category === selectedCategory
      );
    }
    if (searchTerm) {
      filtered = filtered.filter(
        (sample) =>
          sample.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sample.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sample.tech?.some((tech) =>
            tech.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }
    setFilteredSamples(filtered);
  }, [selectedCategory, searchTerm, samples]);

  const categories = ["Tất cả", ...new Set(samples.map((s) => s.category))];
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-sans text-foreground mb-6">
            {lang === "vi"
              ? "Mẫu Website Chuyên Nghiệp"
              : "Modern & Professional Website Design"}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            {lang === "vi"
              ? "Khám phá bộ sưu tập các mẫu website đẹp, hiện đại và tối ưu cho mọi ngành nghề"
              : "Discover a collection of beautiful, modern, and fully-optimized website templates for every industry"}
          </p>
        </div>

        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                autoComplete="off"
                type="text"
                placeholder={
                  lang == "vi"
                    ? "Tìm kiếm theo danh mục hoặc công nghệ..."
                    : "Search by category or technology..."
                }
                className="w-full dark:text-white pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground cursor-pointer" />
              <span className="text-sm text-muted-foreground">
                {filteredSamples.length} {lang == "vi" ? "Kết quả" : "Results"}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="transition-all duration-200 cursor-pointer"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <section id="products-section">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSamples.map((sample, index) => (
              <Card
                key={sample.id}
                className={`group  transition-all duration-500 hover:scale-105 hover:shadow-xl border-2 hover:border-primary/50 ${
                  visibleCards.includes(index)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                <CardContent className="px-2">
                  <div className="relative overflow-hidden rounded-lg ">
                    <img
                      loading="lazy"
                      src={`${baseUrl}${sample.image_url}`}
                      alt={`Website ${sample.category}`}
                      className="w-full h-48  object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge
                        variant={sample.export_state ? "default" : "secondary"}
                      >
                        {sample.export_state ? "Sẵn sàng" : "Đang phát triển"}
                      </Badge>
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          asChild
                        >
                          <Link to={`/products/${sample.id}`}>
                            <Eye className="w-4 h-4 mr-1" />
                            {lang == "vi" ? "Xem chi tiết" : "View Details"}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <Badge
                        className="font-sans border-2 outline-none text-foreground mb-3"
                        variant="outline"
                      >
                        {sample.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm">4.8</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold font-sans text-foreground mb-3">
                      {sample.name}
                    </h3>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {sample.tech?.map((tech, techIndex) => (
                        <Badge
                          key={techIndex}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div
                      hidden
                      className="flex items-center justify-between "
                    >
                      <div></div>
                      <div className="flex gap-2">
                        {sample.url_github && (
                          <Button
                            size="sm"
                            variant="outline"
                            asChild
                          >
                            <a
                              href={sample.url_github}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Github className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                        <Button
                          size="sm"
                          asChild
                        >
                          <Link to={`/products/${sample.id}`}>
                            {lang == "vi" ? "Chi tiết" : "Details"}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {filteredSamples.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {lang == "vi" ? "Không tìm thấy kết quả!" : "No results found!"}
            </h3>
            <p className="text-muted-foreground">
              {lang == "vi"
                ? "Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc danh mục"
                : "Try changing your search keywords or category filters."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
