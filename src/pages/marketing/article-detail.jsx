import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, User, Share2, X, Link2 } from "lucide-react";
import { useParams } from "react-router-dom";
import useCurrentLanguage from "@/hook/currentLang";

export default function ArticleDetail() {
  const { slug } = useParams();
  const { prefix } = useCurrentLanguage();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_MAIN_BE_URL
          }${prefix}/api/marketing/slug/${slug}`
        );
        if (!res.ok) throw new Error("Không thể tải dữ liệu");
        const data = await res.json();
        setPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchArticle();
  }, [slug, prefix]);

  const shareUrl = window.location.href;
  const shareTitle = post?.title || "";

  const shareOptions = [
    {
      name: "Facebook",
      icon: "/images/facebook.png",
      color: "bg-blue-600 hover:bg-blue-700",
      onClick: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            shareUrl
          )}`,
          "_blank"
        );
      },
    },
    {
      name: "Instagram",
      icon: "/images/instagram.png",
      color: "bg-pink-600 hover:bg-pink-700",
      onClick: () => {
        try {
          navigator.clipboard.writeText(shareUrl);
          alert(
            "Đã sao chép link vào clipboard! Bạn có thể dán lên Instagram."
          );
        } catch (err) {
          console.error("Failed to copy: ", err);
        }
      },
    },
    {
      name: "LinkedIn",
      icon: "/images/linkedin.png",
      color: "bg-blue-800 hover:bg-blue-900",
      onClick: () => {
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            shareUrl
          )}`,
          "_blank"
        );
      },
    },
    {
      name: "Sao chép link",
      icon: Link2,
      color: "bg-green-600 hover:bg-green-700",
      onClick: async () => {
        try {
          await navigator.clipboard.writeText(shareUrl);
          alert("Đã sao chép link vào clipboard!");
        } catch (err) {
          console.error("Failed to copy: ", err);
        }
      },
    },
  ];

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert("Đã sao chép link vào clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  if (loading)
    return (
      <p className="min-h-screen flex justify-center items-center text-foreground dark:text-gray-300 font-semibold">
        Đang tải dữ liệu...
      </p>
    );
  if (error)
    return (
      <p className="min-h-screen flex justify-center items-center text-red-500 dark:text-red-400 font-semibold">
        {error}
      </p>
    );
  if (!post)
    return (
      <p className="min-h-screen flex justify-center items-center text-muted-foreground dark:text-gray-400 font-semibold">
        Không có dữ liệu.
      </p>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-10">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-foreground dark:text-white leading-snug">
          {post.title}
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-border dark:border-gray-700">
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-muted-foreground dark:text-gray-400">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="font-medium">{post.author_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(post.created_at).toLocaleDateString("vi-VN")}
              </span>
            </div>
            {post.platform_name && (
              <div className="flex items-center gap-2">
                <span
                  className="px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium"
                  style={{
                    backgroundColor: post.platform_color || "#0891b2",
                    color: "white",
                  }}
                >
                  {post.platform_name}
                </span>
              </div>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="gap-2 cursor-pointer self-start sm:self-auto"
            onClick={() => setShowShareModal(true)}
          >
            <Share2 className="w-4 h-4" />
            Chia sẻ
          </Button>
        </div>
      </div>

      {/* Featured Image */}
      {post.image && (
        <div className="mb-6 sm:mb-8">
          <img
            src={`${import.meta.env.VITE_MAIN_BE_URL}${post.image}`}
            alt={post.title}
            className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover rounded-lg shadow-sm"
          />
        </div>
      )}

      {/* Content */}
      <Card className="mb-8 bg-white dark:bg-gray-900 border border-border dark:border-gray-700">
        <CardContent className="px-3">
          <div
            className="prose max-w-none text-gray-800 leading-relaxed dark:text-gray-200"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </CardContent>
      </Card>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Chia sẻ bài viết
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowShareModal(false)}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Share Options */}
            <div className="p-3">
              <div className="flex items-center justify-center gap-4">
                {shareOptions.map((option) => (
                  <button
                    key={option.name}
                    onClick={option.onClick}
                    className={`flex flex-col items-center justify-center  rounded-lg text-white transition-colors border-2 p-4 border-[${option.color}]`}
                  >
                    {typeof option.icon === "string" ? (
                      // Render image icon
                      <img
                        src={option.icon}
                        alt={option.name}
                        className="w-6 h-6 mb-2 text-black"
                      />
                    ) : (
                      // Render Lucide React icon
                      <option.icon className="w-6 h-6 mb-2 text-black" />
                    )}
                    <span className="text-xs font-medium text-center text-black">
                      {option.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* URL Copy Section */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <Button
                  onClick={handleCopyUrl}
                  size="sm"
                  className="whitespace-nowrap"
                >
                  Sao chép
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
