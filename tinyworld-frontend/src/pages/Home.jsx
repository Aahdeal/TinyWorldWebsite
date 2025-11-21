import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  Heart, 
  Award, 
  Instagram, 
  MessageCircle,
  Image as ImageIcon,
  Palette
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import twLogo from '@/assets/twlogo.png';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Heart,
      title: 'Handcrafted with Love',
      description: 'Every product is made with absolute care and thought in mind, ensuring quality in every detail.',
    },
    {
      icon: Sparkles,
      title: 'Unique Customization',
      description: 'Commemorate your climbing journey through a variety of personalized keyrings and more.',
    },
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'Using the finest materials and techniques to create lasting memories of your adventures.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <header className="flex w-full flex-col py-8 px-4 mt-6">
        <div className="container mx-auto grid grid-cols-1 items-center lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="px-0 pt-8 md:pt-12 lg:pt-16 lg:px-4">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="mr-2 h-3 w-3" />
              TinyWorld
            </Badge>
            <h1 className="mb-4 scroll-m-20 text-4xl !leading-tight font-bold tracking-tight [text-wrap:_balance] md:text-5xl lg:text-6xl">
              Creating Tiny Versions
              <br />
              Of Your World
            </h1>
            <p className="text-muted-foreground mb-6 max-w-xl text-lg leading-relaxed [text-wrap:_balance] md:text-xl">
              Commemorate your climbing journey and special moments through a variety of handcrafted keyrings and personalized keepsakes. Every piece tells a story.
            </p>
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-primary/65"
                onClick={() => navigate('/gallery')}
              >
                Explore Our Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto"
                onClick={() => navigate('/gallery')}
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                View Gallery
              </Button>
            </div>
          </div>
          <div className="relative w-full aspect-circle">
            <img
              alt="TinyWorld handcrafted products"
              src={twLogo}
              className="h-full w-full rounded-xl object-contain shadow-2xl"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?auto=format&w=800&q=85';
              }}
            />
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center lg:mb-20">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-1.5 text-sm font-medium dark:bg-neutral-800">
              <span>Why Choose Us</span>
            </div>

            <h2 className="mb-4 text-3xl font-bold [text-wrap:balance] md:text-4xl lg:text-5xl">
              Crafted with Passion & Precision
            </h2>

            <p className="text-muted-foreground mx-auto max-w-2xl text-base [text-wrap:balance] md:text-lg">
              Every product is carefully handcrafted to capture your special moments and adventures with unmatched quality.
            </p>
          </div>

          <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="group">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/65 text-primary-foreground transition-transform group-hover:scale-110">
                  <Icon className="h-7 w-7" />
                </div>

                <h3 className="mb-3 text-xl font-semibold">{title}</h3>

                <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Creator Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="order-2 lg:order-1">
              <img
                src="https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&w=800&q=85"
                alt="Handcrafted products"
                className="h-full w-full rounded-xl object-cover shadow-xl"
              />
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-1.5 text-sm font-medium dark:bg-neutral-800 mb-6">
                <span>About the Creator</span>
              </div>

              <h2 className="mb-6 text-3xl font-bold [text-wrap:balance] md:text-4xl lg:text-5xl">
                Handcrafted By
                <br />
                Emily-Jane Felix
              </h2>

              <p className="text-muted-foreground mb-8 max-w-lg text-base leading-relaxed [text-wrap:balance] md:text-lg">
                Every product is made with absolute care and thought in mind. 
                From the initial design concept to the final finishing touches, 
                each piece is created to celebrate your unique journey and special moments.
              </p>

              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  <a
                    href="https://www.instagram.com/tiny.w0rld/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Instagram className="mr-2 h-4 w-4" />
                    Instagram
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  <a
                    href="https://wa.me/+27848372182"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary/65 text-primary-foreground rounded-t-2xl">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold [text-wrap:balance] md:text-4xl lg:text-5xl">
              Ready to Create Your Own Tiny World?
            </h2>
            <p className="mb-8 text-lg leading-relaxed opacity-90 [text-wrap:balance] md:text-xl">
              Browse our collection of handcrafted products and find the perfect piece 
              to commemorate your adventures and special moments.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto"
                onClick={() => navigate('/gallery')}
              >
                <Palette className="mr-2 h-4 w-4" />
                Explore Gallery
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto bg-transparent text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/10"
                onClick={() => navigate('/gallery')}
              >
                Start Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

