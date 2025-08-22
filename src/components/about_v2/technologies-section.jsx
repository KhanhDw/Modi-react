

import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"

import {
  Atom,          // React
  Paintbrush,    // Tailwind CSS
  Figma,         // Figma
  Server,        // Node.js
  FileType2,     // TypeScript
  FileCode,      // JavaScript
  Braces,        // Laravel
  Smartphone,    // React Native (mobile)
  Code2,         // PHP
  Boxes,         // NestJS (hoặc dùng Layers nếu muốn)
} from "lucide-react"

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
]


export function TechnologiesSection() {
  const [visibleCards, setVisibleCards] = useState([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          technologies.forEach((_, index) => {
            setTimeout(() => {
              setVisibleCards((prev) => [...prev, index])
            }, index * 100)
          })
        }
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("technologies-section")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <section id="technologies-section" className="py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold font-sans text-foreground mb-12">Công nghệ chúng tôi sử dụng</h2>

        <div className="flex flex-wrap justify-center gap-6">
          {technologies.map((tech, index) => (
            <Card key={index} className="w-40">   {/* ép width để đồng đều */}
              <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                <tech.icon className="text-7xl mb-3" />
                <p className="text-sm font-semibold text-muted-foreground">{tech.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </section>
  )
}
