import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "About | CropMate",
  description: "Learn more about CropMate, our mission and vision",
};

export default function AboutPage() {
  return (
    <main className="container mx-auto py-12 px-4 space-y-16 min-h-screen">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center space-y-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-bold">About CropMate</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Our mission is to revolutionize the agricultural supply chain by
          connecting farmers directly with vendors through innovative
          technology.
        </p>
      </section>

      {/* Our Story */}
      <section className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Our Story</h2>
          <p className="text-muted-foreground">
            CropMate was founded with a simple yet powerful vision: to create a
            more efficient and equitable agricultural marketplace. We recognized
            the challenges faced by small-scale farmers in accessing fair
            markets and the difficulties vendors encounter in sourcing fresh,
            quality produce directly from farms.
          </p>
          <p className="text-muted-foreground">
            What began as a small initiative in 2023 has grown into a
            comprehensive platform that serves farmers, vendors, and drivers
            across multiple regions. Our technology-driven approach eliminates
            unnecessary middlemen, resulting in better prices for farmers and
            fresher produce for vendors.
          </p>
        </div>
        <div className="relative h-80 w-full rounded-lg overflow-hidden border shadow-md">
          <Image
            src="/farm-story.jpg"
            alt="Farmers in field"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </section>

      {/* Our Values */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-10">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Sustainability",
              description:
                "We promote sustainable farming practices and efficient delivery routes to reduce environmental impact.",
              icon: "🌱",
            },
            {
              title: "Transparency",
              description:
                "We believe in complete transparency in pricing, quality, and logistics to build trust among all stakeholders.",
              icon: "🔍",
            },
            {
              title: "Empowerment",
              description:
                "We empower farmers with technology, market insights, and direct access to customers to improve their livelihoods.",
              icon: "💪",
            },
          ].map((value, index) => (
            <div key={index} className="border rounded-lg p-6 text-center">
              <div className="text-4xl mb-4">{value.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
              <p className="text-muted-foreground">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-10">Our Team</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: "Alex Morgan",
              role: "Founder & CEO",
              bio: "Agricultural economist with 10+ years of experience in agritech solutions.",
              image: "/team-placeholder.jpg",
            },
            {
              name: "Priya Sharma",
              role: "CTO",
              bio: "Software engineer specializing in logistics optimization and marketplace platforms.",
              image: "/team-placeholder.jpg",
            },
            {
              name: "Daniel Lee",
              role: "Head of Farmer Relations",
              bio: "Former farmer with deep understanding of agricultural challenges and opportunities.",
              image: "/team-placeholder.jpg",
            },
          ].map((member, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="relative h-40 w-40 rounded-full overflow-hidden mb-4">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 40vw, 144px"
                />
              </div>
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-primary font-medium">{member.role}</p>
              <p className="text-muted-foreground mt-2">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 border rounded-lg text-center">
                <div className="text-4xl font-bold text-primary">5000+</div>
                <p className="text-muted-foreground">Farmers Registered</p>
              </div>
              <div className="p-6 border rounded-lg text-center">
                <div className="text-4xl font-bold text-primary">2500+</div>
                <p className="text-muted-foreground">Vendors Active</p>
              </div>
              <div className="p-6 border rounded-lg text-center">
                <div className="text-4xl font-bold text-primary">1000+</div>
                <p className="text-muted-foreground">Drivers Enrolled</p>
              </div>
              <div className="p-6 border rounded-lg text-center">
                <div className="text-4xl font-bold text-primary">50+</div>
                <p className="text-muted-foreground">Regions Covered</p>
              </div>
            </div>
          </div>
          <div className="space-y-6 order-1 md:order-2">
            <h2 className="text-3xl font-bold">Our Impact</h2>
            <p className="text-muted-foreground">
              Since our founding, we've made significant strides in transforming
              agricultural commerce. By connecting farmers directly with vendors
              and providing reliable delivery services, we've helped increase
              farmer incomes by an average of 25% while reducing produce costs
              for vendors by approximately 15%.
            </p>
            <p className="text-muted-foreground">
              Our platform has also contributed to reducing food waste by
              optimizing the supply chain and ensuring timely deliveries of
              fresh produce.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 bg-primary/5 rounded-xl text-center p-8 space-y-6">
        <h2 className="text-3xl font-bold">Join the CropMate Community</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Whether you're a farmer looking to sell your crops, a vendor seeking
          quality produce, or a driver wanting to join our delivery network, we
          welcome you to the CropMate community.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/register">Sign Up Now</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/crops">Browse Crops</Link>
          </Button>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-10">Get In Touch</h2>
        <div className="max-w-md mx-auto border rounded-lg p-8">
          <p className="text-center text-muted-foreground mb-6">
            Have questions or feedback? We'd love to hear from you!
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <p>+1 (555) 123-4567</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
              </div>
              <p>contact@cropmate.com</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <p>123 Agritech Way, Silicon Valley, CA</p>
            </div>
          </div>
          <Button className="w-full mt-6">Contact Us</Button>
        </div>
      </section>
    </main>
  );
}
