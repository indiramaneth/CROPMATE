import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { InstallPWA } from "@/components/pwa/install-button";
import { PWAInstallProvider } from "@/components/pwa/install-context";
import { PhoneInstallButton } from "@/components/pwa/phone-install-button";
import {
  ArrowRight,
  Check,
  Leaf,
  Sprout,
  ShoppingBag,
  Truck,
  Star,
  HeartHandshake,
  MessageCircle,
  HelpCircle,
  Download,
  Smartphone,
  QrCode,
} from "lucide-react";

const Home = () => {
  return (
    <PWAInstallProvider>
      <main className="flex min-h-screen flex-col ">
        {/* Hero Section - Enhanced with better typography and gradient */}
        <section className="relative h-[650px] w-full overflow-hidden px-2">
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 to-green-800/30 z-10" />
          <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center" />
          <div className="container mx-auto relative z-20 flex h-full items-center">
            <div className="max-w-2xl space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm backdrop-blur-sm">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                  <Leaf className="h-3.5 w-3.5 text-white" />
                </span>
                <span className="text-white font-medium">
                  Growing Communities Together
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight">
                Hello! Welcome to <br />
                <span className="text-primary">Your CropMate</span>
              </h1>

              <p className="text-lg text-white/90 max-w-lg">
                Join our friendly community where local farmers and vendors
                connect. Fresh produce, fair prices, and real people making a
                difference together.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="gap-2">
                  <Link href="/crops">
                    Discover Fresh Crops <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="bg-white/10 text-white hover:bg-white/20 border-white/20"
                >
                  <Link href="/register">Become Part of Our Family</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works - Enhanced with icons and better cards */}
        <section className="py-24 bg-slate-50 dark:bg-slate-950 px-2">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <p className="text-primary font-medium mb-2">Simple & Easy</p>
              <h2 className="text-4xl font-bold mb-4">How We Work Together</h2>
              <p className="text-muted-foreground mx-auto max-w-2xl">
                We've made it super easy to connect and collaborate - just three
                simple steps to bring fresh food from farms to tables while
                supporting local communities.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Farmers Share Their Harvest",
                  description:
                    "Got crops ready? Just list what you have and set your price - it's that simple!",
                  icon: <Sprout className="h-8 w-8 text-primary" />,
                  benefits: [
                    "Easy-to-use crop listings",
                    "You control your prices",
                    "Get notified of interested buyers",
                  ],
                },
                {
                  title: "Vendors Find What They Need",
                  description:
                    "Browse what's fresh and available nearby, and connect directly with the farmers who grew it.",
                  icon: <ShoppingBag className="h-8 w-8 text-primary" />,
                  benefits: [
                    "Discover local, seasonal produce",
                    "Know who grew your food",
                    "Support local agriculture",
                  ],
                },
                {
                  title: "Friendly Drivers Deliver",
                  description:
                    "Our community drivers bring the harvest right to your door - fresh, on time, with care.",
                  icon: <Truck className="h-8 w-8 text-primary" />,
                  benefits: [
                    "Track your delivery in real-time",
                    "Meet the people behind your food",
                    "Freshness guaranteed",
                  ],
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="border rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-slate-900"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 mb-6">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground mb-6">
                    {item.description}
                  </p>
                  <ul className="space-y-2">
                    {item.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section - New addition */}
        <section className="py-20 bg-white dark:bg-slate-900">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <p className="text-primary font-medium mb-2">
                Hear From Our Community
              </p>
              <h2 className="text-3xl font-bold mb-4">What Our Friends Say</h2>
              <p className="text-muted-foreground mx-auto max-w-2xl">
                Real stories from real people in our CropMate family
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Maria Rodriguez",
                  role: "Small Farm Owner",
                  image: "/team-placeholder.jpg",
                  quote:
                    "CropMate changed everything for my family farm. Now we connect directly with restaurants who love our produce, and I've made friends with other local farmers too!",
                  stars: 5,
                },
                {
                  name: "James Chen",
                  role: "Restaurant Owner",
                  image: "/team-placeholder.jpg",
                  quote:
                    "Finding reliable sources of fresh, local produce used to be a challenge. Now I can browse what's available nearby and build relationships with farmers I trust.",
                  stars: 5,
                },
                {
                  name: "Ahmed Hassan",
                  role: "Delivery Partner",
                  image: "/team-placeholder.jpg",
                  quote:
                    "I love being part of the CropMate community. I'm not just delivering products - I'm connecting people and supporting local agriculture while earning a flexible income.",
                  stars: 5,
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="border rounded-xl p-8 bg-slate-50 dark:bg-slate-800 relative"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {Array(item.stars)
                      .fill(0)
                      .map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                  </div>
                  <p className="italic text-muted-foreground mb-6">
                    "{item.quote}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section - Enhanced with friendlier copy */}
        <section className="py-20">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              {[
                {
                  value: "5,000+",
                  label: "Friendly Farmers",
                  icon: (
                    <Sprout className="h-6 w-6 mx-auto mb-2 text-primary" />
                  ),
                },
                {
                  value: "12,000+",
                  label: "Fresh Crops Available",
                  icon: <Leaf className="h-6 w-6 mx-auto mb-2 text-primary" />,
                },
                {
                  value: "3,500+",
                  label: "Happy Vendors",
                  icon: (
                    <HeartHandshake className="h-6 w-6 mx-auto mb-2 text-primary" />
                  ),
                },
                {
                  value: "50+",
                  label: "Communities Supported",
                  icon: (
                    <MessageCircle className="h-6 w-6 mx-auto mb-2 text-primary" />
                  ),
                },
              ].map((stat, index) => (
                <div key={index} className="p-6">
                  {stat.icon}
                  <p className="text-4xl font-bold text-primary mb-2">
                    {stat.value}
                  </p>
                  <p className="text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section - New addition */}
        <section className="py-20 bg-slate-50 dark:bg-slate-950">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <p className="text-primary font-medium mb-2">Questions?</p>
              <h2 className="text-3xl font-bold mb-4">We're Here to Help</h2>
              <p className="text-muted-foreground mx-auto max-w-2xl">
                Common questions from our community members
              </p>
            </div>

            <div className="max-w-3xl mx-auto grid gap-6">
              {[
                {
                  question: "How do I get started as a farmer?",
                  answer:
                    "It's easy! Just create your account, verify your farm details, and start listing your available crops. Our friendly team is here to help you every step of the way.",
                },
                {
                  question: "What areas do you currently serve?",
                  answer:
                    "We're growing every day! Currently, we're active in 50+ regions across the country. When you sign up, we'll let you know if your area is covered or when we'll be expanding there soon.",
                },
                {
                  question: "How is pricing determined?",
                  answer:
                    "Farmers set their own prices, putting the power back in their hands. As a vendor, you'll see transparent pricing with no hidden fees or markups. It's all about fair trade and building relationships.",
                },
                {
                  question: "Can I meet the farmers who grow my food?",
                  answer:
                    "Absolutely! We encourage community connections. Many vendors visit farms, and we host regular meet-ups where everyone in our ecosystem can connect face-to-face.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-6 bg-white dark:bg-slate-900"
                >
                  <div className="flex gap-4">
                    <HelpCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-medium text-lg mb-2">
                        {item.question}
                      </h3>
                      <p className="text-muted-foreground">{item.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <p className="text-muted-foreground mb-4">
                Still have questions? We'd love to chat!
              </p>
              <Button asChild variant="outline">
                <Link href="/about">Contact Our Friendly Team</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* PWA Download Section - New addition */}
        <section className="py-20 bg-green-50 dark:bg-green-950/30">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-primary font-medium mb-2">
                  Take Us With You
                </p>
                <h2 className="text-3xl font-bold mb-4">
                  Get the CropMate App
                </h2>
                <p className="text-muted-foreground mb-6">
                  Install our app on your device for the best experience. Access
                  CropMate anytime, even when you're offline or have a weak
                  connection - perfect for farm visits and deliveries in remote
                  areas!
                </p>

                <div className="space-y-4 mb-8">
                  {[
                    {
                      icon: <Download className="h-5 w-5 text-primary" />,
                      title: "Easy Installation",
                      description:
                        "No app store needed - install directly from your browser",
                    },
                    {
                      icon: <Smartphone className="h-5 w-5 text-primary" />,
                      title: "Works Offline",
                      description:
                        "Access key features even without an internet connection",
                    },
                    {
                      icon: <QrCode className="h-5 w-5 text-primary" />,
                      title: "Stay Connected",
                      description:
                        "Get notifications about your crops, orders and deliveries",
                    },
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-medium">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <PhoneInstallButton />
                  <p className="text-sm text-muted-foreground">
                    Or just use the install option in your browser menu
                  </p>
                </div>
              </div>

              <div className="relative mx-auto md:ml-auto">
                <div className="relative h-[500px] w-[250px] rounded-[40px] border-8 border-slate-800 shadow-xl bg-white dark:bg-slate-900 overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-6 bg-slate-800 z-10" />
                  <div className="h-full w-full overflow-hidden">
                    <div className="h-full w-full bg-gradient-to-b from-green-100 to-green-50 dark:from-green-900/50 dark:to-green-800/30 flex items-center justify-center p-4">
                      <div className="text-center space-y-4">
                        <Leaf className="h-16 w-16 text-primary mx-auto" />
                        <h3 className="text-xl font-bold">CropMate App</h3>
                        <p className="text-sm">
                          Enjoy the full CropMate experience directly on your
                          phone or tablet!
                        </p>
                        <PhoneInstallButton />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 h-48 w-48 bg-primary/10 rounded-full -z-10" />
                <div className="absolute -top-6 -left-6 h-36 w-36 bg-primary/5 rounded-full -z-10" />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Enhanced with friendlier copy */}
        <section className="py-20 bg-primary/5">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Join Our Growing Community?
              </h2>
              <p className="text-muted-foreground mb-8">
                Whether you're a farmer, vendor, or driver, there's a place for
                you in our friendly CropMate family. Let's grow something
                special together!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/register">Join Our Community</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/about">Get to Know Us Better</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </PWAInstallProvider>
  );
};

export default Home;
