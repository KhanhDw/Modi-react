import HeroBanner from "../components/about/HeroBanner"
import Introduction from "../components/about/Introduction"
import Services from "../components/about/Services"
import Goals from "../components/about/Goals"
import Team from "../components/about/Team"
import CallToAction from "../components/about/CallToAction"

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <HeroBanner />
      <Introduction />
      <Services />
      <Goals />
      <Team />
      <CallToAction />
    </div>
  )
}