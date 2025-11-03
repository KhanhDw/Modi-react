import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";

import {
  Atom, // React
  Paintbrush, // Tailwind CSS
  Figma, // Figma
  Server, // Node.js
  FileType2, // TypeScript
  FileCode, // JavaScript
  Braces, // Laravel
  Smartphone, // React Native (mobile)
  Code2, // PHP
  Boxes, // NestJS (hoặc dùng Layers nếu muốn)
} from "lucide-react";
import { above } from "slate";

const technologies = [
  { name: "React", icon: Atom },
  { name: "Tailwind CSS", icon: Paintbrush },
  { name: "Figma", icon: Figma },
  { name: "Node.js", icon: Server },
  { name: "TypeScript", icon: FileType2 },
  { name: "JavaScript", icon: FileCode },
  { name: "Laravel", icon: Braces },
  { name: "React Native", icon: Smartphone },
  { name: "PHP", icon: Code2 },
  { name: "NestJS", icon: Boxes },
];

export function TechnologiesSection() {
  const [visibleCards, setVisibleCards] = useState([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Use requestAnimationFrame for better performance
          technologies.forEach((_, index) => {
            requestAnimationFrame(() => {
              setTimeout(() => {
                setVisibleCards((prev) => [...prev, index]);
              }, index * 80); // Reduced delay for faster loading
            });
          });
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById("technologies-section");
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);
  const { t } = useLanguage();
  return (
    <section
      id="technologies-section"
      className="py-20 px-4"
    >
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-sans text-[foreground] mb-12">
          {t("aboutV2.TechnologiesSection")}
        </h2>

        <div className="sm:flex sm:flex-wrap sm:justify-center sm:gap-6 grid grid-cols-2 gap-4">
          {technologies.map((tech, index) => (
            <Card
              key={index}
              className={`w-full sm:w-40 transition-all duration-500 ${
                visibleCards.includes(index)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                <tech.icon className="w-6 h-6 sm:w-7 sm:h-7 mb-3" />
                <p className="text-sm sm:text-base font-semibold text-[muted-foreground]">
                  {tech.name}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
