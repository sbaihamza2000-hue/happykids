'use client';

import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from 'react';
import {
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
import { Separator } from '@/components/ui/separator';
import {
  useToast,
} from '@/hooks/use-toast';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { cn } from '@/lib/utils';
import { Navbar } from '@/components/site/navbar';
import { Footer } from '@/components/site/footer';
import { CartSidebar } from '@/components/site/cart-sidebar';
import { WhatsAppButton } from '@/components/site/whatsapp-button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

/* ──────────── Data ──────────── */

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
  children: ReactNode;
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
          src="https://res.cloudinary.com/dd9s1ry6j/image/upload/v1775902360/vecteezy_delicious-assorted-cookies-stacked-high-creating-temptation_72219466_dzbnlq.jpg"
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
            <a href="/products">
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
              href="https://wa.me/21628886302?text=Bonjour%20Happy%20Kids%20!%20Je%20souhaite%20passer%20une%20commande."
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

/* ──────────── Special Offers Section ──────────── */

function OffersSection() {
  const [offers, setOffers] = useState<
    Array<{
      id: string
      name: string
      price: number
      originalPrice: number | null
      image: string
    }>
  >([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadOffers() {
      try {
        const response = await fetch('/api/products', { cache: 'no-store' })
        if (!response.ok) return
        const data: unknown = await response.json()
        if (
          typeof data === 'object' &&
          data !== null &&
          'products' in data &&
          Array.isArray((data as { products: unknown }).products)
        ) {
          const products = (data as { products: Array<Record<string, unknown>> }).products
          const mapped = products
            .filter((p) => p && p.onOffer === true)
            .map((p) => ({
              id: String(p.id ?? ''),
              name: String(p.name ?? ''),
              price: typeof p.price === 'number' ? p.price : Number(p.price ?? 0),
              originalPrice:
                typeof p.originalPrice === 'number'
                  ? p.originalPrice
                  : p.originalPrice === null
                    ? null
                    : null,
              image: String(p.image ?? ''),
            }))
            .filter((p) => p.id && p.name && Number.isFinite(p.price) && p.image)

          if (!cancelled) setOffers(mapped)
        }
      } catch {
      } finally {
        if (!cancelled) setLoaded(true)
      }
    }

    loadOffers()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <AnimatedSection id="offres" className="py-20 md:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-yellow/20 text-yellow border-yellow/30 px-4 py-1 text-sm font-semibold">
            <Gift className="mr-1 h-3 w-3" />
            Offres en cours
          </Badge>
          <h2
            className="text-3xl font-bold text-dark-brown sm:text-4xl md:text-5xl mb-6"
            style={{ fontFamily: 'var(--font-fredoka)' }}
          >
            Offres Spéciales
          </h2>
        </div>

        {offers.length > 0 ? (
          <div className="relative">
            {offers.length > 1 ? (
              <Carousel opts={{ loop: true }} className="px-12">
                <CarouselContent>
                  {offers.map((p) => {
                    const hasOriginal =
                      typeof p.originalPrice === 'number' &&
                      Number.isFinite(p.originalPrice) &&
                      p.originalPrice > p.price
                    const percent =
                      hasOriginal && p.originalPrice
                        ? Math.round((1 - p.price / p.originalPrice) * 100)
                        : null

                    return (
                      <CarouselItem key={p.id} className="md:basis-1/2 lg:basis-1/3">
                        <Card className="border-none shadow-lg bg-white overflow-hidden">
                          <div className="relative aspect-square overflow-hidden bg-cream">
                            <img
                              src={p.image}
                              alt={p.name}
                              onError={(e) => {
                                e.currentTarget.src = '/images/logo.png'
                              }}
                              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                            />
                            <div className="absolute top-3 left-3">
                              <Badge className="bg-warm-orange text-white font-bold shadow-md">
                                {percent ? `-${percent}%` : 'Promo'}
                              </Badge>
                            </div>
                          </div>
                          <CardHeader className="pb-2 pt-4">
                            <CardTitle
                              className="text-lg font-bold text-dark-brown"
                              style={{ fontFamily: 'var(--font-fredoka)' }}
                            >
                              {p.name}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pb-4">
                            <div className="flex items-baseline gap-2">
                              <span className="text-xl font-bold text-warm-orange">
                                {p.price.toFixed(2)} TND
                              </span>
                              {hasOriginal ? (
                                <span className="text-sm text-muted-foreground line-through">
                                  {p.originalPrice!.toFixed(2)} TND
                                </span>
                              ) : null}
                            </div>
                          </CardContent>
                          <CardFooter className="pb-5">
                            <Button asChild className="w-full font-bold rounded-full">
                              <a href={`/products/${encodeURIComponent(p.id)}`}>
                                Voir détails
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </a>
                            </Button>
                          </CardFooter>
                        </Card>
                      </CarouselItem>
                    )
                  })}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            ) : (
              <div className="mx-auto max-w-3xl">
                {offers.map((p) => {
                  const hasOriginal =
                    typeof p.originalPrice === 'number' &&
                    Number.isFinite(p.originalPrice) &&
                    p.originalPrice > p.price
                  const percent =
                    hasOriginal && p.originalPrice
                      ? Math.round((1 - p.price / p.originalPrice) * 100)
                      : null

                  return (
                    <Card key={p.id} className="border-none shadow-lg bg-white overflow-hidden">
                      <div className="grid grid-cols-1 md:grid-cols-2">
                        <div className="relative aspect-square bg-cream">
                          <img
                            src={p.image}
                            alt={p.name}
                            onError={(e) => {
                              e.currentTarget.src = '/images/logo.png'
                            }}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-warm-orange text-white font-bold shadow-md">
                              {percent ? `-${percent}%` : 'Promo'}
                            </Badge>
                          </div>
                        </div>
                        <div className="p-6 flex flex-col justify-between">
                          <div>
                            <h3
                              className="text-2xl font-bold text-dark-brown"
                              style={{ fontFamily: 'var(--font-fredoka)' }}
                            >
                              {p.name}
                            </h3>
                            <div className="mt-4 flex items-baseline gap-2">
                              <span className="text-2xl font-bold text-warm-orange">
                                {p.price.toFixed(2)} TND
                              </span>
                              {hasOriginal ? (
                                <span className="text-sm text-muted-foreground line-through">
                                  {p.originalPrice!.toFixed(2)} TND
                                </span>
                              ) : null}
                            </div>
                          </div>
                          <Button asChild size="lg" className="mt-6 w-full font-bold rounded-full">
                            <a href={`/products/${encodeURIComponent(p.id)}`}>
                              Voir détails
                              <ArrowRight className="ml-2 h-5 w-5" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        ) : loaded ? (
          <div className="text-center text-muted-foreground">
            Aucune offre pour le moment.
          </div>
        ) : (
          <div className="text-center text-muted-foreground">Chargement...</div>
        )}
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
          {testimonials.map((testimonial) => (
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
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
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
                  href="https://wa.me/21628886302?text=Bonjour%20Happy%20Kids%20!"
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
                      +216 28 886 302
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
                      +216 28 886 302 / +216 26 906 333
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-cream">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-golden text-white">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-dark-brown">Location</p>
                    <p className="text-sm text-muted-foreground">
                      Zone industrielle Souassi, Mahdia, 5140 Tunisie
                    </p>
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
                    placeholder="+216 22 222 222"
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

/* ──────────── Main Page ──────────── */

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
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
