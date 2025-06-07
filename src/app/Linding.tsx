import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Zap,
  Users,
  Heart,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";
import Navbar from "./Navbar2";
import Link from "next/link";

export default function DiagramAILanding() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-slate-950 to-cyan-900/20" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Badge
            variant="secondary"
            className="mb-6 bg-blue-500/10 text-blue-300 border-blue-500/20"
          >
            🚀 Powered by Advanced AI
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Transform{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Text
            </span>{" "}
            into
            <br />
            Beautiful{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              UML Diagrams
            </span>
          </h1>

          <p className="text-xl md:text-2xl mb-8 text-slate-300 max-w-3xl mx-auto">
            Harness the power of AI to generate professional UML diagrams from
            simple text descriptions. Design faster, collaborate better, and
            bring your ideas to life.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-lg px-8 py-6"
            >
              <Link href="/signin">Start Creating Now</Link>
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 text-lg px-8 py-6"
            >
              <Link href={"/community"}>Watch Community</Link>
            </Button>
          </div>

          {/* Hero Screenshot */}
          <Card className="inline-block bg-slate-900/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-4">
              <img
                src="landing/image.png"
                alt="DiagramAI Platform Screenshot"
                className="rounded-lg shadow-2xl h-[500px] "
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge
              variant="secondary"
              className="mb-4 bg-blue-500/10 text-blue-300 border-blue-500/20"
            >
              Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Everything you need to create, share, and collaborate on UML
              diagrams
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-slate-900 border-slate-700 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">
                  AI-Powered Generation
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Transform natural language descriptions into professional UML
                  diagrams instantly using advanced AI technology.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src="landing/AI.png"
                  alt="AI Generation Feature"
                  className="rounded-lg w-full"
                />
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-700 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Intuitive Interface</CardTitle>
                <CardDescription className="text-slate-400">
                  Clean, user-friendly interface that makes diagram creation
                  accessible to everyone, from beginners to experts.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src="landing/interface.png"
                  alt="User Interface"
                  className="rounded-lg w-full"
                />
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-700 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Community Driven</CardTitle>
                <CardDescription className="text-slate-400">
                  Share diagrams, collaborate with others, and learn from a
                  vibrant community of designers and developers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src="landing/community.png"
                  alt="Community Hub"
                  className="rounded-lg w-full"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge
              variant="secondary"
              className="mb-4 bg-blue-500/10 text-blue-300 border-blue-500/20"
            >
              Process
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Create professional UML diagrams in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "1",
                title: "Describe Your Diagram",
                description:
                  "Simply type what you want to create in natural language. Our AI understands your requirements.",
                image:
                  "landing/Input.png",
              },
              {
                step: "2",
                title: "AI Generates Diagram",
                description:
                  "Our advanced AI processes your description and generates a professional UML diagram using PlantUML.",
                image:
                  "landing/ai-diagram.png",
              },
              {
                step: "3",
                title: "Share & Collaborate",
                description:
                  "Export, share, and collaborate on your diagrams with team members and the community.",
                image:
                  "landing/share-export.png",
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold">{item.step}</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-slate-400 mb-6">{item.description}</p>
                <Card className="bg-slate-900/50 border-slate-700">
                  <CardContent className="p-4">
                    <img
                      src={item.image}
                      alt={`${item.title} Step`}
                      className="rounded-lg w-full"
                    />
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge
              variant="secondary"
              className="mb-4 bg-blue-500/10 text-blue-300 border-blue-500/20"
            >
              Community
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Join Our Community
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Connect with designers, developers, and architects worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6">Share Your Creations</h3>
              <p className="text-slate-400 mb-6 text-lg">
                Publish your diagrams to our community gallery, get feedback
                from peers, and inspire others with your designs. Build your
                reputation and showcase your modeling skills.
              </p>
              <div className="space-y-4">
                {[
                  "Public diagram gallery",
                  "Peer reviews and feedback",
                  "Templates and examples",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-blue-400" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <Card className="bg-slate-900/50 border-slate-700">
              <CardContent className="p-4">
                <img
                  src="landing/community-page.png"
                  alt="Community Gallery"
                  className="rounded-lg w-full"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900/20 via-slate-950 to-cyan-900/20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        </div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Ready to Transform Your Ideas?
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-slate-300">
            Join thousands of developers and designers creating better diagrams
            with AI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-slate-100 text-lg px-8 py-6"
            >
              <Link href="/signin">Start Free Trial</Link>
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <span className="text-xl font-bold">DiagramAI</span>
              </div>
              <p className="text-slate-400">
                Transform your ideas into beautiful UML diagrams using the power
                of artificial intelligence.
              </p>
            </div>

            {[
              {
                title: "Product",
                links: ["Features", "Templates"],
              },
              {
                title: "Community",
                links: ["Gallery", "Forums", "Discord", "Blog"],
              },
              {
                title: "Support",
                links: ["Help Center", "Contact", "Status", "Privacy"],
              },
            ].map((section, index) => (
              <div key={index}>
                <h4 className="text-lg font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-2 text-slate-400">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href="#"
                        className="hover:text-white transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2025 DiagramAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
