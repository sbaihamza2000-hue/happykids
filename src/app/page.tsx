'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Menu,
  X,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Phone,
  MapPin,
  Mail,
  Facebook,
  MessageCircle,
  Star,
  Heart,
  Sparkles,
  Cookie,
  Gift,
  ChefHat,
  Leaf,
  Users,
  ArrowRight,
  Send,
  Quote,
  PartyPopper,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetDescription,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import {
  useToast,
} from '@/hooks/use-toast';
import { useCartStore, type CartItem } from '@/store/cart';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { useMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

/* ──────────── Data ──────────── */

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  image: string;
}

const products: Product[] = [
  {
    id: 'chocolate-cookies',
    name: 'Cookies Chocolat',
    description: 'Nos célèbres cookies aux pépites de chocolat fondant',
    price: 8.0,
    unit: 'Boîte de 6',
    image: '/images/chocolate-cookies.png',
  },
  {
    id: 'cookies-assorted',
    name: 'Cookies Assortis',
    description: 'Un mélange délicieux de nos meilleurs cookies artisanaux',
    price: 15.0,
    unit: 'Boîte de 12',
    image: '/images/cookies-assorted.png',
  },
  {
    id: 'tunisian-pastries',
    name: 'Pâtisseries Tunisiennes',
    description: 'Baklawa, Makroudh et Kaak Warka faits maison',
    price: 20.0,
    unit: 'Assortiment',
    image: '/images/tunisian-pastries.png',
  },
  {
    id: 'sugar-cookies',
    name: 'Cookies Décorés',
    description: 'Cookies colorés décorés à la main, parfaits pour les fêtes',
    price: 12.0,
    unit: 'Boîte de 8',
    image: '/images/sugar-cookies.png',
  },
  {
    id: 'butter-cookies',
    name: 'Cookies Beurre',
    description: 'Cookies au beurre fondant avec amandes torréfiées',
    price: 10.0,
    unit: 'Boîte de 8',
    image: '/images/butter-cookies.png',
  },
  {
    id: 'gift-box',
    name: 'Coffret Cadeau',
    description:
      'Le coffret cadeau parfait avec assortiment de nos spécialités',
    price: 35.0,
    unit: 'Grand coffret',
    image: '/images/gift-box.png',
  },
];

const testimonials = [
  {
    name: 'Amina Ben Ali',
    location: 'Tunis',
    text: "Les cookies de Happy Kids sont absolument délicieux ! Ma fille en raffole et nous en commandons chaque semaine. Les cookies chocolat sont notre favori.",
    rating: 5,
  },
  {
    name: 'Mohamed Trabelsi',
    location: 'Sousse',
    text: "J'ai commandé le coffret cadeau pour l'anniversaire de mon fils et toute la famille a adoré. Les pâtisseries tunisiennes sont authentiques et faites avec amour.",
    rating: 5,
  },
  {
    name: 'Fatma Khelifi',
    location: 'Sfax',
    text: "Des produits de qualité exceptionnelle ! Les cookies décorés étaient magnifiques pour la fête de mon fils. Merci Happy Kids pour cette merveilleuse expérience.",
    rating: 5,
  },
];

const navLinks = [
  { href: '#accueil', label: 'Accueil' },
  { href: '#produits', label: 'Nos Produits' },
  { href: '#about', label: 'À Propos' },
  { href: '#offres', label: 'Offres Spéciales' },
  { href: '#contact', label: 'Contact' },
];

const features = [
  {
    icon: <HandMadeIcon />,
    title: 'Fait Main',
    description: 'Chaque cookie est préparé avec soin et passion par nos artisans',
  },
  {
    icon: <Leaf className="h-8 w-8" />,
    title: 'Ingrédients Naturels',
    description: "Nous utilisons uniquement des ingrédients frais et de qualité premium",
  },
  {
    icon: <ChefHat className="h-8 w-8" />,
    title: 'Tradition Tunisienne',
    description: "Des recettes authentiques transmises de génération en génération",
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: 'Pour Tous',
    description: "Des douceurs qui ravissent les petits comme les grands",
  },
];

/* ──────────── Helper Components ──────────── */

function HandMadeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-8 w-8"
    >
      <path d="M18 11h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1z" />
      <path d="M14 11V7a2 2 0 0 0-4 0v4" />
      <path d="M10 11V8a2 2 0 0 0-4 0v6" />
      <path d="M6 14a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2h12a3 3 0 0 0 3-3v-2a1 1 0 0 0-1-1h-4" />
    </svg>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            'h-4 w-4',
            i < rating ? 'fill-yellow text-yellow' : 'text-muted-foreground/30'
          )}
        />
      ))}
    </div>
  );
}

function AnimatedSection({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <section
      id={id}
      ref={ref}
      className={cn(
        'transition-all duration-700',
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8',
        className
      )}
    >
      {children}
    </section>
  );
}

/* ──────────── Navbar ──────────── */

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems, setIsOpen } = useCartStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const itemCount = totalItems();

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md'
          : 'bg-transparent'
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <a href="#accueil" className="flex items-center gap-2">
            <img
              src="/images/logo.png"
              alt="Happy Kids"
              className="h-10 w-10 md:h-12 md:w-12 rounded-full"
            />
            <span
              className="text-xl font-bold md:text-2xl text-dark-brown"
              style={{ fontFamily: 'var(--font-fredoka)' }}
            >
              Happy Kids
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-dark-brown hover:text-warm-orange transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-3">
            {/* Cart button */}
            <Button
              variant="outline"
              size="icon"
              className="relative border-golden bg-white hover:bg-cream text-dark-brown"
              onClick={() => setIsOpen(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-warm-orange text-xs font-bold text-white animate-bounce-in">
                  {itemCount}
                </span>
              )}
            </Button>

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-dark-brown hover:bg-cream"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-golden/20 animate-fade-in-up">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block px-4 py-3 rounded-lg text-dark-brown font-semibold hover:bg-cream transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

/* ──────────── Hero Section ──────────── */

function HeroSection() {
  return (
    <section
      id="accueil"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-banner.png"
          alt="Happy Kids Cookies"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-cream" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 text-center pt-20">
        <div className="animate-fade-in-up">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
            <Cookie className="h-5 w-5 text-yellow" />
            <span className="text-sm font-semibold text-white">
              Fabrique Artisanale Tunisienne
            </span>
          </div>
        </div>

        <h1
          className="mb-4 text-5xl font-bold text-white drop-shadow-lg sm:text-6xl md:text-7xl lg:text-8xl animate-fade-in-up animation-delay-100"
          style={{ fontFamily: 'var(--font-fredoka)' }}
        >
          Happy Kids
        </h1>

        <p
          className="mx-auto mb-8 max-w-2xl text-lg text-white/90 sm:text-xl md:text-2xl animate-fade-in-up animation-delay-200"
          style={{ fontFamily: 'var(--font-nunito)' }}
        >
          Des douceurs artisanales pour les petits et les grands
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-300">
          <Button
            asChild
            size="lg"
            className="bg-warm-orange hover:bg-warm-orange/90 text-white font-bold text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <a href="#produits">
              <Sparkles className="mr-2 h-5 w-5" />
              Découvrir nos produits
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-2 border-white text-white hover:bg-white hover:text-dark-brown font-bold text-lg px-8 py-6 rounded-full bg-white/10 backdrop-blur-sm transition-all"
          >
            <a
              href="https://wa.me/216XXXXXXXX?text=Bonjour%20Happy%20Kids%20!%20Je%20souhaite%20passer%20une%20commande."
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Commander maintenant
            </a>
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs text-dark-brown/60 font-medium">Scroll</span>
          <svg
            className="h-6 w-6 text-dark-brown/60"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}

/* ──────────── About Section ──────────── */

function AboutSection() {
  return (
    <AnimatedSection id="about" className="py-20 md:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-golden/20 text-golden-dark border-golden/30 px-4 py-1 text-sm font-semibold">
            <Heart className="mr-1 h-3 w-3" />
            Notre Histoire
          </Badge>
          <h2
            className="text-3xl font-bold text-dark-brown sm:text-4xl md:text-5xl mb-6"
            style={{ fontFamily: 'var(--font-fredoka)' }}
          >
            À Propos de Happy Kids
          </h2>
          <div className="mx-auto max-w-3xl text-muted-foreground text-lg leading-relaxed">
            <p>
              <span className="font-semibold text-dark-brown">Happy Kids</span> est
              une fabrique artisanale de cookies et de pâtisseries tunisiennes,
              née de la passion pour les douceurs faites maison. Nous croyons que
              chaque cookie doit être un moment de bonheur, partagé en famille ou
              entre amis.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <AnimatedSection key={feature.title}>
              <Card
                className={cn(
                  'text-center border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-cream group',
                  index === 0 && 'hover:bg-pink-light/30',
                  index === 1 && 'hover:bg-yellow-light/30',
                  index === 2 && 'hover:bg-golden-light/30',
                  index === 3 && 'hover:bg-pink-light/30'
                )}
              >
                <CardHeader className="pb-2 pt-8">
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-warm-orange/10 text-warm-orange group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg font-bold text-dark-brown">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-8">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

/* ──────────── Products Section ──────────── */

function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCartStore();
  const { toast } = useToast();
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    setJustAdded(true);
    toast({
      title: 'Ajouté au panier !',
      description: `${product.name} a été ajouté à votre panier.`,
      className:
        'bg-white border-golden text-dark-brown',
    });
    setTimeout(() => setJustAdded(false), 1000);
  };

  return (
    <Card className="group overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-cream">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3">
          <Badge className="bg-warm-orange text-white font-bold shadow-md">
            {product.price.toFixed(2)} TND
          </Badge>
        </div>
      </div>

      {/* Content */}
      <CardHeader className="pb-2 pt-4">
        <CardTitle
          className="text-lg font-bold text-dark-brown"
          style={{ fontFamily: 'var(--font-fredoka)' }}
        >
          {product.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-muted-foreground text-sm leading-relaxed mb-2">
          {product.description}
        </p>
        <p className="text-xs font-medium text-golden-dark">{product.unit}</p>
      </CardContent>
      <CardFooter className="pb-4">
        <Button
          onClick={handleAddToCart}
          className={cn(
            'w-full font-bold rounded-full transition-all duration-300',
            justAdded
              ? 'bg-green-500 hover:bg-green-500 text-white'
              : 'bg-warm-orange hover:bg-warm-orange/90 text-white hover:shadow-lg'
          )}
        >
          {justAdded ? (
            <>
              <PartyPopper className="mr-2 h-4 w-4" />
              Ajouté !
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Ajouter au panier
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

function ProductsSection() {
  return (
    <AnimatedSection id="produits" className="py-20 md:py-28 bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-pink/20 text-pink border-pink/30 px-4 py-1 text-sm font-semibold">
            <Cookie className="mr-1 h-3 w-3" />
            Nos Spécialités
          </Badge>
          <h2
            className="text-3xl font-bold text-dark-brown sm:text-4xl md:text-5xl mb-6"
            style={{ fontFamily: 'var(--font-fredoka)' }}
          >
            Nos Produits
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
            Découvrez notre sélection de cookies artisanaux et pâtisseries
            tunisiennes, préparés avec amour et des ingrédients naturels.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

/* ──────────── Special Offers Section ──────────── */

function OffersSection() {
  return (
    <AnimatedSection id="offres" className="py-20 md:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-yellow/20 text-yellow border-yellow/30 px-4 py-1 text-sm font-semibold">
            <Gift className="mr-1 h-3 w-3" />
            Offre Limitée
          </Badge>
          <h2
            className="text-3xl font-bold text-dark-brown sm:text-4xl md:text-5xl mb-6"
            style={{ fontFamily: 'var(--font-fredoka)' }}
          >
            Offres Spéciales
          </h2>
        </div>

        {/* Offer Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-warm-orange to-golden p-1 shadow-2xl">
          <div className="rounded-[22px] bg-gradient-to-r from-warm-orange/90 to-golden/90 p-6 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Text */}
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 mb-4 animate-pulse-glow">
                  <Badge className="bg-white text-warm-orange font-extrabold text-base px-4 py-1">
                    -29% ÉCONOMIE
                  </Badge>
                </div>
                <h3
                  className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4"
                  style={{ fontFamily: 'var(--font-fredoka)' }}
                >
                  Pack Économique Familial
                </h3>
                <p className="text-white/90 text-lg mb-6 max-w-lg">
                  5 types de douceurs pour seulement{' '}
                  <span className="font-bold text-2xl">25.00 TND</span>{' '}
                  <span className="line-through text-white/60 text-lg">
                    35.00 TND
                  </span>
                </p>
                <p className="text-white/80 mb-8 text-sm">
                  Inclut : Cookies Chocolat, Cookies Beurre, Cookies Décorés,
                  Pâtisseries Tunisiennes et une surprise bonus !
                </p>
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-warm-orange hover:bg-cream font-bold text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  <a
                    href="https://wa.me/216XXXXXXXX?text=Bonjour%20!%20Je%20suis%20intéressé(e)%20par%20le%20Pack%20Économique%20Familial%20à%2025%20TND."
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ArrowRight className="mr-2 h-5 w-5" />
                    Profiter de l&apos;offre
                  </a>
                </Button>
              </div>

              {/* Image */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="h-48 w-48 md:h-64 md:w-64 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                    <img
                      src="/images/cookies-assorted.png"
                      alt="Pack Famille"
                      className="h-40 w-40 md:h-56 md:w-56 object-cover rounded-full"
                    />
                  </div>
                  <div className="absolute -top-2 -right-2 h-12 w-12 rounded-full bg-yellow flex items-center justify-center shadow-lg animate-bounce">
                    <Gift className="h-6 w-6 text-dark-brown" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

/* ──────────── Testimonials Section ──────────── */

function TestimonialsSection() {
  return (
    <AnimatedSection className="py-20 md:py-28 bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-golden/20 text-golden-dark border-golden/30 px-4 py-1 text-sm font-semibold">
            <Star className="mr-1 h-3 w-3" />
            Avis Clients
          </Badge>
          <h2
            className="text-3xl font-bold text-dark-brown sm:text-4xl md:text-5xl mb-6"
            style={{ fontFamily: 'var(--font-fredoka)' }}
          >
            Ce Que Disent Nos Clients
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <AnimatedSection key={testimonial.name}>
              <Card className="h-full border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white group">
                <CardContent className="pt-8 pb-6 px-6">
                  <Quote className="h-8 w-8 text-golden/40 mb-4 group-hover:text-golden transition-colors" />
                  <p className="text-muted-foreground leading-relaxed mb-6 italic">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                  <Separator className="mb-6 bg-golden/20" />
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warm-orange/10 text-warm-orange font-bold text-lg">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-dark-brown text-sm">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.location}
                      </p>
                      <StarRating rating={testimonial.rating} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

/* ──────────── Contact Section ──────────── */

function ContactSection() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: 'Message envoyé !',
          description: data.message,
          className: 'bg-white border-green-500 text-dark-brown',
        });
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        toast({
          title: 'Erreur',
          description: data.error,
          variant: 'destructive',
          className: 'bg-white border-red-500 text-dark-brown',
        });
      }
    } catch {
      toast({
        title: 'Erreur',
        description: 'Impossible d\'envoyer le message. Veuillez réessayer.',
        variant: 'destructive',
        className: 'bg-white border-red-500 text-dark-brown',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatedSection id="contact" className="py-20 md:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-pink/20 text-pink border-pink/30 px-4 py-1 text-sm font-semibold">
            <Mail className="mr-1 h-3 w-3" />
            Contactez-nous
          </Badge>
          <h2
            className="text-3xl font-bold text-dark-brown sm:text-4xl md:text-5xl mb-6"
            style={{ fontFamily: 'var(--font-fredoka)' }}
          >
            Contact
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
            Une question, une commande spéciale ou une suggestion ? N&apos;hésitez
            pas à nous contacter !
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3
                className="text-2xl font-bold text-dark-brown mb-6"
                style={{ fontFamily: 'var(--font-fredoka)' }}
              >
                Nos Coordonnées
              </h3>
              <div className="space-y-5">
                <a
                  href="https://www.facebook.com/people/Happy-Kids/100092726604069/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-cream hover:bg-golden-light/30 transition-colors group"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white group-hover:scale-110 transition-transform">
                    <Facebook className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-dark-brown">Facebook</p>
                    <p className="text-sm text-muted-foreground">
                      Happy Kids - 1.1K abonnés
                    </p>
                  </div>
                </a>

                <a
                  href="https://wa.me/216XXXXXXXX?text=Bonjour%20Happy%20Kids%20!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-cream hover:bg-green-50 transition-colors group"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500 text-white group-hover:scale-110 transition-transform">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-dark-brown">WhatsApp</p>
                    <p className="text-sm text-muted-foreground">
                      +216 XX XXX XXX
                    </p>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-cream">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warm-orange text-white">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-dark-brown">Téléphone</p>
                    <p className="text-sm text-muted-foreground">
                      +216 XX XXX XXX
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-cream">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-golden text-white">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-dark-brown">Location</p>
                    <p className="text-sm text-muted-foreground">Tunisie</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="border-none shadow-lg bg-cream/50">
            <CardHeader>
              <CardTitle
                className="text-xl font-bold text-dark-brown"
                style={{ fontFamily: 'var(--font-fredoka)' }}
              >
                Envoyez-nous un message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-dark-brown font-semibold">
                    Nom complet <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Votre nom"
                    required
                    className="bg-white border-golden/30 focus:border-warm-orange focus:ring-warm-orange/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-dark-brown font-semibold">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="votre@email.com"
                    className="bg-white border-golden/30 focus:border-warm-orange focus:ring-warm-orange/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-dark-brown font-semibold">
                    Téléphone
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+216 XX XXX XXX"
                    className="bg-white border-golden/30 focus:border-warm-orange focus:ring-warm-orange/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-dark-brown font-semibold">
                    Message <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Votre message..."
                    required
                    rows={4}
                    className="bg-white border-golden/30 focus:border-warm-orange focus:ring-warm-orange/20 resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-warm-orange hover:bg-warm-orange/90 text-white font-bold rounded-full py-6 text-lg"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Envoi en cours...
                    </div>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Envoyer le message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AnimatedSection>
  );
}

/* ──────────── Cart Sidebar ──────────── */

function CartSidebar() {
  const {
    items,
    isOpen,
    setIsOpen,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  } = useCartStore();

  const itemCount = totalItems();
  const total = totalPrice();

  const handleWhatsApp = () => {
    const itemsText = items
      .map((item: CartItem) => `- ${item.name} x${item.quantity} (${(item.price * item.quantity).toFixed(2)} TND)`)
      .join('\n');
    const message = `Bonjour Happy Kids ! Je souhaite commander :\n\n${itemsText}\n\nTotal : ${total.toFixed(2)} TND`;
    window.open(
      `https://wa.me/216XXXXXXXX?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md bg-cream border-golden/20"
      >
        <SheetHeader className="pb-4">
          <SheetTitle
            className="text-xl font-bold text-dark-brown flex items-center gap-2"
            style={{ fontFamily: 'var(--font-fredoka)' }}
          >
            <ShoppingCart className="h-5 w-5 text-warm-orange" />
            Mon Panier
            {itemCount > 0 && (
              <Badge className="bg-warm-orange text-white ml-2">
                {itemCount} article{itemCount > 1 ? 's' : ''}
              </Badge>
            )}
          </SheetTitle>
          <SheetDescription className="text-muted-foreground">
            Vos douceurs sélectionnées
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto max-h-[60vh]">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Cookie className="h-16 w-16 text-golden/30 mb-4" />
              <p className="text-muted-foreground font-medium">
                Votre panier est vide
              </p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Ajoutez des délicieux cookies !
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item: CartItem) => (
                <div
                  key={item.id}
                  className="flex gap-3 rounded-xl bg-white p-3 shadow-sm"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-dark-brown text-sm truncate">
                      {item.name}
                    </p>
                    <p className="text-warm-orange font-bold text-sm">
                      {item.price.toFixed(2)} TND
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 border-golden/30 hover:bg-cream"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-semibold w-6 text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 border-golden/30 hover:bg-cream"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-400 hover:text-red-500 hover:bg-red-50"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <p className="text-sm font-bold text-dark-brown">
                      {(item.price * item.quantity).toFixed(2)} TND
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className="border-t border-golden/20 pt-4 space-y-3">
            <div className="flex items-center justify-between w-full">
              <span className="text-muted-foreground font-medium">Total</span>
              <span
                className="text-2xl font-bold text-dark-brown"
                style={{ fontFamily: 'var(--font-fredoka)' }}
              >
                {total.toFixed(2)} TND
              </span>
            </div>
            <Button
              onClick={handleWhatsApp}
              className="w-full bg-green-500 hover:bg-green-500/90 text-white font-bold rounded-full py-5 text-base"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Commander via WhatsApp
            </Button>
            <Button
              variant="outline"
              onClick={clearCart}
              className="w-full border-golden/30 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-full"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Vider le panier
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

/* ──────────── Footer ──────────── */

function Footer() {
  return (
    <footer className="bg-dark-brown text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/images/logo.png"
                alt="Happy Kids"
                className="h-12 w-12 rounded-full border-2 border-golden"
              />
              <span
                className="text-2xl font-bold"
                style={{ fontFamily: 'var(--font-fredoka)' }}
              >
                Happy Kids
              </span>
            </div>
            <p className="text-white/60 leading-relaxed text-sm">
              Fabrique artisanale de cookies et pâtisseries tunisiennes. Des
              douceurs faites avec amour pour les petits et les grands.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-golden">
              Liens Rapides
            </h4>
            <div className="space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block text-white/60 hover:text-golden transition-colors text-sm"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Social & Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4 text-golden">
              Suivez-nous
            </h4>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/people/Happy-Kids/100092726604069/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-blue-600 text-white transition-all hover:scale-110"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://wa.me/216XXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-green-500 text-white transition-all hover:scale-110"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
            <div className="mt-6 space-y-2 text-sm text-white/60">
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-golden" />
                +216 XX XXX XXX
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-golden" />
                Tunisie
              </p>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-white/10" />

        <div className="text-center text-sm text-white/40">
          <p>&copy; 2025 Happy Kids - Tous droits réservés</p>
        </div>
      </div>
    </footer>
  );
}

/* ──────────── WhatsApp Floating Button ──────────── */

function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/216XXXXXXXX?text=Bonjour%20Happy%20Kids%20!%20Je%20souhaite%20avoir%20des%20informations%20sur%20vos%20produits."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg hover:bg-green-500/90 hover:shadow-xl transition-all animate-float group"
      aria-label="Contacter via WhatsApp"
    >
      <MessageCircle className="h-7 w-7 group-hover:scale-110 transition-transform" />
      <span className="absolute -top-1 -right-1 flex h-4 w-4">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex h-4 w-4 rounded-full bg-green-500"></span>
      </span>
    </a>
  );
}

/* ──────────── Main Page ──────────── */

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <ProductsSection />
        <OffersSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
      <CartSidebar />
      <WhatsAppButton />
    </div>
  );
}
