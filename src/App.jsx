import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ChevronDown, Award, Flame, Users, MapPin, Clock, Menu, X, Eye } from 'lucide-react';

// Animated section component
const AnimatedSection = ({ children, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Stagger container for menu items
const StaggerContainer = ({ children, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className={className}>
      {React.Children.map(children, (child, i) => (
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
          transition={{ 
            duration: 0.6, 
            delay: i * 0.15,
            ease: [0.22, 1, 0.36, 1]
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
};

export default function EdoRestaurant() {
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [menuOpen, setMenuOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.2]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.3]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      const sections = ['hero', 'story', 'bertha', 'experience', 'menu', 'visit'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'story', label: 'Story' },
    { id: 'bertha', label: 'Bertha' },
    { id: 'experience', label: 'Experience' },
    { id: 'menu', label: 'Menu' },
    { id: 'visit', label: 'Visit' }
  ];

  return (
    <div className="bg-zinc-950 text-zinc-100 font-sans overflow-x-hidden">
      {/* Top Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 w-full z-50 transition-all duration-500"
        style={{
          backgroundColor: scrollY > 100 ? 'rgba(9, 9, 11, 0.95)' : 'transparent',
          backdropFilter: scrollY > 100 ? 'blur(20px)' : 'none'
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo and Badges */}
          <div className="flex items-center gap-4">
            <motion.img
              src="/edo-logo.svg"
              alt="EDŌ Restaurant"
              className="h-12 md:h-14 w-auto"
              whileHover={{ scale: 1.15 }}
              transition={{ duration: 0.3 }}
            />
            <div className="hidden sm:flex items-center gap-2">
              <img src="/edo-michelin.png" alt="Michelin Bib Gourmand" className="h-8 md:h-12 w-auto" />
              <img src="/edo-best-of.png" alt="Best of Belfast" className="h-8 md:h-10 w-auto" />
            </div>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex gap-6 text-sm tracking-wide">
              {['story', 'experience', 'menu', 'visit'].map((section) => (
                <motion.button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className="hover:text-amber-500 transition-colors duration-300 capitalize"
                  whileHover={{ y: -2 }}
                >
                  {section}
                </motion.button>
              ))}
              <motion.a
                href="https://360spaces.co.uk/EDO_Restaurant/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-500 transition-colors duration-300 flex items-center gap-1"
                whileHover={{ y: -2 }}
              >
                <Eye className="w-4 h-4" />
                Virtual Tour
              </motion.a>
            </div>
            <motion.button
              className="bg-amber-600 hover:bg-amber-500 text-zinc-950 px-6 py-2 text-sm font-medium tracking-wide transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Need a Table?
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-zinc-950/98 z-40 md:hidden flex items-center justify-center"
        >
          <div className="text-center space-y-8">
            {navItems.map((item, i) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => scrollToSection(item.id)}
                className="block text-3xl font-light hover:text-amber-500 transition"
              >
                {item.label}
              </motion.button>
            ))}
            <motion.a
              href="https://360spaces.co.uk/EDO_Restaurant/"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navItems.length * 0.1 }}
              className="text-3xl font-light hover:text-amber-500 transition flex items-center justify-center gap-2"
            >
              <Eye className="w-8 h-8" />
              Virtual Tour
            </motion.a>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (navItems.length + 1) * 0.1 }}
              className="bg-amber-600 hover:bg-amber-500 text-zinc-950 px-8 py-3 text-base font-medium tracking-wide transition"
            >
              Need a Table?
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Side Navigation - Desktop Only */}
      {scrollY > 400 && (
        <motion.nav 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:block fixed left-8 top-1/2 -translate-y-1/2 z-40"
        >
          <div className="space-y-6">
            {navItems.map((item, i) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => scrollToSection(item.id)}
                className="flex items-center gap-3 group"
              >
                <motion.div 
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    activeSection === item.id 
                      ? 'bg-amber-500 scale-150' 
                      : 'bg-zinc-600 group-hover:bg-amber-500'
                  }`}
                  whileHover={{ scale: 1.5 }}
                />
                <span 
                  className={`text-xs tracking-wider transition-all duration-300 ${
                    activeSection === item.id 
                      ? 'text-amber-500 opacity-100' 
                      : 'text-zinc-500 opacity-0 group-hover:opacity-100 group-hover:text-amber-500'
                  }`}
                >
                  {item.label}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.nav>
      )}

      {/* Hero Section with Video Background */}
      <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-zinc-950/60 via-zinc-950/40 to-zinc-950 z-10"
          style={{ opacity: heroOpacity }}
        />
        
        {/* Video Background - Replace src with actual EDŌ footage */}
        <motion.div 
          className="absolute inset-0"
          style={{ scale: heroScale }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            poster="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&h=1080&fit=crop&q=80"
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-chef-cooking-in-a-restaurant-kitchen-43347-large.mp4" type="video/mp4" />
          </video>
        </motion.div>
        
        <div className="relative z-20 text-center px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <Award className="w-5 h-5 text-amber-500" />
            <span className="text-sm tracking-widest text-amber-500">MICHELIN BIB GOURMAND</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-7xl md:text-9xl font-light tracking-[0.2em] mb-6"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            EDŌ
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-xl md:text-2xl font-light tracking-wide text-zinc-300 mb-12 max-w-2xl mx-auto"
          >
            Contemporary European dining in the heart of Belfast
          </motion.p>
          
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="bg-amber-600 hover:bg-amber-500 text-zinc-950 px-10 py-4 text-base font-medium tracking-wide transition-all duration-300"
            whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(217, 119, 6, 0.3)' }}
            whileTap={{ scale: 0.95 }}
          >
            Book Your Table
          </motion.button>
        </div>

        <motion.button 
  initial={{ opacity: 0 }}
  animate={{ 
    opacity: 1,
    y: [0, 10, 0]
  }}
  transition={{ 
    opacity: { delay: 1.2 },
    y: { repeat: Infinity, duration: 2 }
  }}
  onClick={() => scrollToSection('story')}
  className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
>
  <ChevronDown className="w-8 h-8 text-zinc-400" />
</motion.button>
      </section>

      {/* Story Section */}
      <section id="story" className="min-h-screen flex items-center py-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <AnimatedSection>
            <span className="text-amber-500 text-sm tracking-widest uppercase mb-4 block">The Story</span>
            <h2 className="text-5xl md:text-6xl font-light mb-6 leading-tight">
              Passion forged<br />in fire
            </h2>
            <div className="space-y-4 text-zinc-400 text-lg leading-relaxed">
              <p>
                Founded by Head Chef Jonny Elliott, EDŌ brings decades of European culinary experience to Belfast's vibrant dining scene.
              </p>
              <p>
                Trained under Gordon Ramsay and Gary Rhodes, Jonny's passion for authentic European flavours and wood-fired cooking has created something truly special in Northern Ireland.
              </p>
              <p>
                Every dish tells a story of craft, dedication, and the relentless pursuit of excellence—balanced with the warmth and genuine hospitality that makes EDŌ feel like home.
              </p>
            </div>
          </AnimatedSection>
          
          <AnimatedSection>
            <div className="relative h-[600px] overflow-hidden rounded-sm group">
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent z-10"></div>
              <motion.img 
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=1000&fit=crop&q=80"
                alt="Chef at work"
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.6 }}
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Bertha Oven Feature */}
      <section id="bertha" className="relative min-h-screen flex items-center overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/90 to-transparent z-10"></div>
        <motion.div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1525351326368-efbb5cb6814d?w=1920&h=1080&fit=crop&q=80)',
            scale: useTransform(scrollYProgress, [0.2, 0.5], [1, 1.15])
          }}
        />
        
        <div className="relative z-20 max-w-7xl mx-auto px-6">
          <AnimatedSection className="max-w-2xl">
            <Flame className="w-12 h-12 text-amber-500 mb-6" />
            <h2 className="text-5xl md:text-7xl font-light mb-6 leading-tight">
              The Bertha<br />Oven
            </h2>
            <p className="text-xl text-zinc-300 leading-relaxed mb-8">
              One of only a handful in Northern Ireland, our wood-fired Bertha oven burns apple and pear wood, creating depth and character that simply can't be replicated.
            </p>
            <p className="text-lg text-zinc-400 leading-relaxed">
              From charred octopus to perfectly blistered steaks, every flame-kissed dish carries the signature of true craft.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-24 px-6 bg-zinc-900">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <span className="text-amber-500 text-sm tracking-widest uppercase mb-4 block">The Experience</span>
            <h2 className="text-5xl md:text-6xl font-light">Tapas. Theatre. Taste.</h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=600&fit=crop&q=80',
                title: 'Share & Savour',
                desc: 'European tapas designed for sharing. Three or four dishes per person—the perfect way to explore our menu.'
              },
              {
                img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=600&fit=crop&q=80',
                title: 'Open Kitchen',
                desc: 'Watch the brigade move in perfect harmony. Sit at the kitchen counter and feel the energy of service.'
              },
              {
                img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&h=600&fit=crop&q=80',
                title: 'Curated Pairings',
                desc: 'From natural wines to signature cocktails, every sip is chosen to complement your journey.'
              }
            ].map((item, i) => (
              <AnimatedSection key={i}>
                <div className="group cursor-pointer">
                  <div className="relative h-80 overflow-hidden rounded-sm mb-6">
                    <motion.img 
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60"></div>
                  </div>
                  <h3 className="text-2xl font-light mb-3">{item.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Virtual Tour Section */}
          <AnimatedSection className="mt-16">
            <div className="relative overflow-hidden rounded-sm bg-gradient-to-r from-amber-900/20 to-zinc-800/20 border border-amber-900/30">
              <div className="grid md:grid-cols-2 gap-8 items-center p-8 md:p-12">
                <div>
                  <Eye className="w-10 h-10 text-amber-500 mb-4" />
                  <h3 className="text-3xl md:text-4xl font-light mb-4">Explore EDŌ Virtually</h3>
                  <p className="text-zinc-400 text-lg leading-relaxed mb-6">
                    Take a 360° tour of our restaurant. Experience the atmosphere, peek into the open kitchen, and find your perfect spot before you visit.
                  </p>
                  <motion.a
                    href="https://360spaces.co.uk/EDO_Restaurant/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-zinc-950 px-8 py-3 text-sm font-medium tracking-wide transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Launch Virtual Tour
                  </motion.a>
                </div>
                <div className="relative h-64 md:h-80 overflow-hidden rounded-sm">
                  <motion.img
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop&q=80"
                    alt="Restaurant interior"
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Eye className="w-16 h-16 text-white opacity-80" />
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Food Gallery with Zoom Effect */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {[
              'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=800&fit=crop&q=80',
              'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=800&fit=crop&q=80',
              'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=800&fit=crop&q=80',
              'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&h=800&fit=crop&q=80'
            ].map((src, i) => (
              <AnimatedSection key={i}>
                <div className="relative h-96 overflow-hidden rounded-sm group cursor-pointer">
                  <motion.img 
                    src={src}
                    alt={`Dish ${i + 1}`}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Highlight */}
      <section id="menu" className="py-24 px-6 bg-zinc-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
            <AnimatedSection className="relative h-[500px] overflow-hidden rounded-sm order-2 md:order-1 group">
              <motion.img 
                src="https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&h=800&fit=crop&q=80"
                alt="Signature dish"
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.6 }}
              />
            </AnimatedSection>
            
            <AnimatedSection className="order-1 md:order-2">
              <span className="text-amber-500 text-sm tracking-widest uppercase mb-4 block">The Menu</span>
              <h2 className="text-5xl font-light mb-6 leading-tight">
                European soul,<br />local heart
              </h2>
              <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                Our menu celebrates the finest European traditions while championing the incredible produce from our doorstep. Every dish honours both heritage and locality.
              </p>
              <motion.button 
                className="border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-zinc-950 px-8 py-3 text-sm font-medium tracking-wide transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Full Menu
              </motion.button>
            </AnimatedSection>
          </div>

          {/* Sample Dishes - Staggered Animation */}
          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Pil Pil Prawns', desc: 'Olive oil, chilli, garlic, sourdough' },
              { name: 'Beef Cheeks', desc: 'Red wine, root vegetables, horseradish cream' },
              { name: 'Charred Octopus', desc: 'Paprika oil, crispy potatoes, lemon aioli' }
            ].map((dish, i) => (
              <div key={i} className="border-t border-zinc-800 pt-6">
                <h3 className="text-xl font-light mb-2">{dish.name}</h3>
                <p className="text-zinc-500 text-sm tracking-wide">{dish.desc}</p>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Visit Section */}
      <section id="visit" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <span className="text-amber-500 text-sm tracking-widest uppercase mb-4 block">Visit Us</span>
            <h2 className="text-5xl md:text-6xl font-light mb-6">Heart of Belfast</h2>
          </AnimatedSection>

          <StaggerContainer className="grid md:grid-cols-3 gap-12 mb-16">
            <div className="text-center">
              <MapPin className="w-8 h-8 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Location</h3>
              <p className="text-zinc-400">Unit 2 Capital House<br />3 Upper Queen Street<br />Belfast BT1 6FB</p>
            </div>
            <div className="text-center">
              <Clock className="w-8 h-8 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Hours</h3>
              <p className="text-zinc-400">Tuesday - Saturday<br />12:00 - Late</p>
            </div>
            <div className="text-center">
              <Users className="w-8 h-8 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Reservations</h3>
              <p className="text-zinc-400">+44 28 9031 3054<br />Book online 24/7</p>
            </div>
          </StaggerContainer>

          <AnimatedSection className="text-center">
            <motion.button 
              className="bg-amber-600 hover:bg-amber-500 text-zinc-950 px-12 py-4 text-base font-medium tracking-wide transition-all duration-300"
              whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(217, 119, 6, 0.3)' }}
              whileTap={{ scale: 0.95 }}
            >
              Reserve Your Table
            </motion.button>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-zinc-800 bg-zinc-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <img src="/edo-logo.svg" alt="EDŌ Restaurant" className="h-12 w-auto" />
          <div className="flex gap-8 text-sm text-zinc-400">
            <motion.a href="#" className="hover:text-amber-500 transition" whileHover={{ y: -2 }}>Instagram</motion.a>
            <motion.a href="#" className="hover:text-amber-500 transition" whileHover={{ y: -2 }}>Facebook</motion.a>
            <motion.a href="#" className="hover:text-amber-500 transition" whileHover={{ y: -2 }}>Contact</motion.a>
          </div>
          <div className="text-sm text-zinc-500">
            © 2025 EDŌ Belfast. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}