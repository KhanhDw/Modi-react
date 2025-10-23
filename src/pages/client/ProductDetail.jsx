import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Github,
  Globe,
  ExternalLink,
  Star,
  Calendar,
  Code,
  Palette,
  Smartphone,
  Monitor,
  Shield,
  Zap,
  Eye,
  ShoppingCart,
} from "lucide-react";
// import languageAPI from "@/hook/currentLang";
import useCurrentLanguage, { setAppLanguage } from "@/hook/currentLang";

const baseUrl = import.meta.env.VITE_MAIN_BE_URL;

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { lang, prefix } = useCurrentLanguage();
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // 1. Fetch chi tiết sản phẩm
        const res = await fetch(`${baseUrl}${prefix}/api/web-samples/${id}`);
        if (!res.ok) throw new Error("Không fetch được sản phẩm");
        const result = await res.json();

        if (!result) throw new Error("Sản phẩm không tồn tại");

        // 2. Chuẩn hóa dữ liệu
        const parsed = {
          ...result,
          tags: Array.isArray(result.tags)
            ? result.tags
            : result.tags
            ? JSON.parse(result.tags)
            : [],
          tech: Array.isArray(result.tech)
            ? result.tech
            : result.tech
            ? JSON.parse(result.tech)
            : [],
          top_features: Array.isArray(result.top_features)
            ? result.top_features
            : result.top_features
            ? JSON.parse(result.top_features)
            : [],
          screenshots: result.screenshots
            ? typeof result.screenshots === "string"
              ? JSON.parse(result.screenshots)
              : result.screenshots
            : [],
          export_state: result.export_state ? 1 : 0,
        };

        setProduct(parsed);
        setIsVisible(true);

        // 3. Kiểm tra LocalStorage trước khi tăng view
        const key = "viewed_" + id;
        const now = Date.now();
        const expireTime = 30 * 60 * 1000; // 30 phút

        const lastView = localStorage.getItem(key);

        if (!lastView || now - lastView > expireTime) {
          const upViews = await fetch(
            `${baseUrl}/api/web-samples/views/${id}`,
            {
              method: "PUT",
            }
          );

          if (!upViews.ok) throw new Error("Không thể tăng lượt views");

          // Lưu timestamp để lần sau không gọi trùng
          localStorage.setItem(key, now);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setProduct(null);
      }
    };

    fetchProduct();
  }, [id, prefix]);

  // Lấy sản phẩm liên quan (cùng category, khác id)
  useEffect(() => {
    const fetchRelated = async () => {
      if (!product) return;
      try {
        const res = await fetch(
          `${baseUrl}/api/web-samples?category=${product.category}`
        );
        const result = await res.json();
        const parsed = result.data
          .map((item) => ({
            ...item,
            tech:
              typeof item.tech === "string" ? JSON.parse(item.tech) : item.tech,
          }))
          .filter((item) => item.id !== product.id)
          .slice(0, 3);

        setRelatedProducts(parsed);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRelated();
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Không tìm thấy sản phẩm
          </h2>
          <p className="text-muted-foreground mb-4">
            Sản phẩm bạn tìm kiếm không tồn tại
          </p>
          <Button asChild>
            <Link to="/products">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại danh sách
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <Button
            variant="outline"
            asChild
          >
            <Link to="/products">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại danh sách
            </Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Images */}
          <div
            className={`transition-all duration-600 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-8"
            }`}
          >
            <div className="mb-6 relative">
              <img
                loading="lazy"
                src={
                  product.screenshots?.[selectedImage] ||
                  `${baseUrl}${product.image_url}`
                }
                alt={`Website ${product.category}`}
                className="w-full h-96 object-cover rounded-lg shadow-lg border-2 dark:border-gray-700"
              />

              {product.url_github && (
                <Button
                  className="absolute bottom-4 left-1/2 -translate-x-1/2  hover:bg-red-400 shadow-md "
                  size="lg"
                  variant="outline"
                  asChild
                >
                  <a
                    href={product.url_github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Xem website mẫu
                  </a>
                </Button>
              )}
            </div>

            {product.screenshots && (
              <div className="grid grid-cols-4 gap-2">
                {product.screenshots.map((screenshot, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative overflow-hidden rounded-lg border-2 transition-all duration-200 ${
                      selectedImage === index
                        ? "border-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <img
                      loading="lazy"
                      src={
                        screenshot.startsWith("http")
                          ? screenshot
                          : `${baseUrl}${screenshot}`
                      }
                      alt={`Screenshot ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Features */}
            {product.top_features && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Tính năng nổi bật
                </h3>
                <div className=" grid grid-cols-1 md:grid-cols-3 gap-4">
                  {product.top_features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-border  rounded-lg "
                    >
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-foreground wrap-anywhere">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Product Info */}
          <div
            className={`transition-all duration-600 delay-200 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-8"
            }`}
          >
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Badge
                  variant="outline"
                  className="font-sans border-2 text-foreground text-sm"
                >
                  {product.category}
                </Badge>
                <Badge variant={product.export_state ? "default" : "secondary"}>
                  {product.export_state ? "Sẵn sàng" : "Đang phát triển"}
                </Badge>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm">4.8</span>
                </div>
                <div className="flex items-center gap-3 ml-auto">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Ngày tạo
                    </div>
                    <div className="font-semibold text-muted-foreground">
                      {formatDate(product.created_at)}
                    </div>
                  </div>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold font-sans text-foreground mb-4">
                {product.name}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                {product.description}
              </p>
              <div className="text-lg dark:text-white  text-black  leading-relaxed mb-6 flex gap-3 items-center">
                <p> Lượt xem:</p>
                {product.views}
              </div>
            </div>

            {/* Tech Stack */}
            {product.tech && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
                  <Code className="w-5 h-5 mr-2" />
                  Công nghệ sử dụng
                </h3>
                <div className="flex flex-wrap gap-2 ">
                  {product.tech.map((tech, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            {/* {product.top_features && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Tính năng nổi bật
                </h3>
                <div className="grid gap-3">
                  {product.top_features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )} */}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                size="lg"
                className="flex-1 cursor-pointer p-2"
              >
                <ShoppingCart className="w-8 h-8 mr-2" />
                <p className="font-semibold">Đặt ngay</p>
              </Button>
              {product.demo_url && (
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                >
                  <a
                    href={product.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Xem demo
                  </a>
                </Button>
              )}
              {/* {product.url_github && (
                <Button size="lg" variant="outline" asChild>
                  <a href={product.url_github} target="_blank" rel="noopener noreferrer">
                    <Globe className="w-4 h-4 mr-2" />
                    Xem website mẫu
                  </a>
                </Button>
              )} */}
            </div>

            {/* Additional Info */}
            {/* <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Ngày tạo</div>
                      <div className="font-semibold">{formatDate(product.created_at)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Monitor className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Responsive</div>
                      <div className="font-semibold">Tất cả thiết bị</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Bảo mật</div>
                      <div className="font-semibold">Chuẩn HTTPS</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Mobile First</div>
                      <div className="font-semibold">Tối ưu di động</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card> */}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl md:text-3xl font-bold font-sans text-foreground mb-8 text-center">
              Sản phẩm liên quan
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedProducts.map((sample) => (
                <Card
                  key={sample.id}
                  className="group hover:scale-105 transition-all duration-300"
                >
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        loading="lazy"
                        src={`${baseUrl}${sample.image_url}`}
                        alt={`Website ${sample.category}`}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <Badge
                        variant="outline"
                        className=" font-sans text-foreground mb-2"
                      >
                        {sample.category}
                      </Badge>
                      <h3 className="font-semibold text-foreground mb-2">
                        {sample.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <Button
                          size="sm"
                          asChild
                        >
                          <Link to={`/products/${sample.id}`}>
                            Xem chi tiết
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
