// eslint-disable-next-line no-unused-vars
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Database, Lock, Upload, Download, Server, Users, FileText,  ChevronDown, Github, Twitter, Linkedin, ArrowRight } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const [activeSection, setActiveSection] = useState("hero");

  // Scroll-based animations
  const yMove = useTransform(scrollYProgress, [0, 1], ["0px", "-200px"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.2]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

  // Track which section is in view
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section');
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(section.id);
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={scrollRef} className="w-full bg-black text-white overflow-hidden">
      {/* Particle Background Effect */}
      <ParticleBackground />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
              EtherStore
            </span>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden md:flex items-center gap-8"
          >
            <NavLink href="#features" isActive={activeSection === "features"}>Features</NavLink>
            <NavLink href="#how-it-works" isActive={activeSection === "how-it-works"}>How It Works</NavLink>
            <NavLink href="#testimonials" isActive={activeSection === "testimonials"}>Testimonials</NavLink>
            <NavLink href="#faq" isActive={activeSection === "faq"}>FAQ</NavLink>
          </motion.div>
          
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            onClick={() => navigate("/auth")}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 transform hover:-translate-y-1"
          >
            Launch App
          </motion.button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 relative">
        <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 to-transparent pointer-events-none" />
        
        <motion.img 
  src="/ethereum1.svg" 
  alt="Ethereum Logo"
  className=" w-72 absolute top-32 md:top-40 opacity-80"
  style={{ y: yMove, opacity, scale }}
  initial={{ opacity: 0, y: 50 }}
  animate={{ 
    opacity: 0.8, 
    y: [0, -10, 0]  // Moves up and down smoothly
  }}
  transition={{ 
    duration: 2, 
    repeat: Infinity,  // Loop animation
    repeatType: "reverse", // Reverse animation for smooth effect
    ease: "easeInOut"
  }}
/>

        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-4xl mx-auto z-10"
        >
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
              Secure & Decentralized
            </span>
            <br />File Storage
          </h1>
          
          <p className="mt-6 text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Experience blockchain-powered file storage with 
            <span className="font-semibold text-blue-400"> Ethereum </span> 
            and 
            <span className="font-semibold text-purple-400"> IPFS</span>.
            Secure, private, and censorship-resistant.
          </p>
          
          <div className="mt-10 flex flex-col md:flex-row gap-4 justify-center">
            <motion.button 
              onClick={() => navigate("/auth")}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-white font-semibold text-lg shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </motion.button>
            
            <motion.button 
              onClick={() => window.open("https://github.com/MohdSaquib114/Decentrailized-Data-Storage-App", "_blank")}
              className="px-8 py-4 bg-transparent border border-gray-700 rounded-full text-white font-semibold text-lg hover:bg-white/5 transition-all duration-300 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Github className="w-5 h-5" />
              View on GitHub
            </motion.button>
          </div>
          
          <div className="mt-16 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="flex flex-col items-center gap-2"
            >
              <p className="text-gray-400">Scroll to explore</p>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
              >
                <ChevronDown className="w-6 h-6 text-gray-400" />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Floating elements for visual interest */}
        <div className="absolute bottom-10 left-10 w-32 h-32 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute top-40 right-10 w-40 h-40 rounded-full bg-blue-500/10 blur-3xl" />
      </section>

      {/* Stats Section */}
      <section className="py-20 px-8 bg-black relative border-t border-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard value="10TB+" label="Data Stored" icon={<Database className="w-6 h-6 text-purple-400" />} />
            <StatCard value="99.9%" label="Uptime" icon={<Server className="w-6 h-6 text-blue-400" />} />
            <StatCard value="50,000+" label="Users" icon={<Users className="w-6 h-6 text-purple-400" />} />
            <StatCard value="1M+" label="Files Secured" icon={<FileText className="w-6 h-6 text-blue-400" />} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-8 bg-gradient-to-b from-black to-gray-900 relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="Why Choose Us?"
            subtitle="Our platform offers unique advantages powered by blockchain technology"
          />
          
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <FeatureCard 
              icon={<Database className="w-10 h-10 text-purple-400" />}
              title="Decentralized Storage" 
              description="Files are stored securely on IPFS, ensuring censorship resistance and global availability without central points of failure." 
            />
            <FeatureCard 
              icon={<Shield className="w-10 h-10 text-blue-400" />}
              title="Ethereum Security" 
              description="Your data is secured by blockchain technology, providing immutable records and cryptographic verification of file integrity." 
            />
            <FeatureCard 
              icon={<Lock className="w-10 h-10 text-purple-400" />}
              title="User-Owned Data" 
              description="Only you control your files with private key encryption. No third-party access or data mining of your personal information." 
            />
          </div>
          
          <div className="mt-16 grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-gray-800 shadow-xl"
            >
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">Advanced Encryption</h3>
              <p className="text-gray-300 mb-6">We encrypt your files before they are uploaded, ensuring that your data remains private and secure at all times. With decentralized storage, only you have access to your files, protecting them from unauthorized access or breaches.</p>
              <ul className="space-y-3">
                {["End-to-end encryption", "Zero-knowledge architecture", "Quantum-resistant algorithms"].map((item, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span className="text-gray-300">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
              className="relative"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur opacity-30"></div>
              <div className="relative bg-black rounded-2xl overflow-hidden border border-gray-800">
                <div className="p-4 bg-gray-900/50 border-b border-gray-800 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="ml-4 text-sm text-gray-400">EtherStore Dashboard</div>
                </div>
                <div className="p-6">
                  <img 
                    src="/placeholder.svg?height=300&width=500" 
                    alt="Dashboard Preview" 
                    className="rounded-lg shadow-2xl border border-gray-800 w-full"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-8 bg-black relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="How It Works"
            subtitle="Our decentralized storage solution is simple to use yet powerful"
          />
          
          <div className="mt-16 relative">
            {/* Connection line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-blue-600 transform -translate-y-1/2 hidden md:block"></div>
            
            <div className="grid md:grid-cols-3 gap-8 relative z-10">
              <StepCard 
                step="1" 
                icon={<Upload className="w-8 h-8" />}
                title="Upload File" 
                description="Select a file from your device and upload it to IPFS. Your file is encrypted before leaving your browser for maximum security." 
              />
              <StepCard 
                step="2" 
                icon={<Database className="w-8 h-8" />}
                title="Store CID on Blockchain" 
                description="Your file's Content Identifier (CID) is stored securely on the Ethereum blockchain, creating a permanent, tamper-proof record." 
              />
              <StepCard 
                step="3" 
                icon={<Download className="w-8 h-8" />}
                title="Retrieve Anytime" 
                description="Access your files securely from anywhere by connecting your wallet. Only you have the keys to decrypt and download your data." 
              />
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mt-20 p-8 bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 shadow-xl"
          >
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2">
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                  Technical Architecture
                </h3>
                <p className="text-gray-300 mb-6">
                  Our platform combines the best of blockchain and distributed storage technologies to create a robust, secure file storage solution.
                </p>
                <ul className="space-y-4">
                  {[
                    "Smart contracts manage access control and file ownership",
                    "IPFS provides content-addressed storage for efficiency",
                    "Ethereum blockchain ensures immutable record-keeping",
                    "Client-side encryption keeps your data private"
                  ].map((item, i) => (
                    <motion.li 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center mt-0.5">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <span className="text-gray-300">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div className="md:w-1/2">
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl blur opacity-30"></div>
                  <div className="relative bg-black p-6 rounded-xl border border-gray-800">
                    <img 
                      src="/architecture.webp" 
                      alt="Technical Architecture Diagram" 
                      className="w-full rounded-lg h-88 "
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      {/* <section id="testimonials" className="py-24 px-8 bg-gradient-to-b from-gray-900 to-black relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="What Our Users Say"
            subtitle="Join thousands of satisfied users who trust our platform"
          />
          
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <TestimonialCard 
              quote="EtherStore has completely changed how I think about file storage. The peace of mind knowing my data is secure on the blockchain is invaluable."
              author="Alex Johnson"
              role="Blockchain Developer"
              avatar="/placeholder.svg?height=100&width=100"
            />
            <TestimonialCard 
              quote="As a photographer, I need reliable storage for my work. The decentralized nature means I never worry about server outages or data loss."
              author="Sarah Chen"
              role="Professional Photographer"
              avatar="/placeholder.svg?height=100&width=100"
            />
            <TestimonialCard 
              quote="The integration with my Ethereum wallet makes the experience seamless. I can access my files from anywhere while maintaining complete control."
              author="Michael Rodriguez"
              role="Digital Nomad"
              avatar="/placeholder.svg?height=100&width=100"
            />
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mt-20 p-8 bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 shadow-xl"
          >
            <div className="flex flex-col items-center text-center">
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.svg 
                    key={star}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: star * 0.1 }}
                    viewport={{ once: true }}
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-8 w-8 text-yellow-400" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </motion.svg>
                ))}
              </div>
              <h3 className="mt-6 text-2xl font-bold">Trusted by over 50,000 users worldwide</h3>
              <p className="mt-4 text-gray-400 max-w-2xl">
                Join our growing community of privacy-conscious individuals and organizations who trust EtherStore with their valuable data.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/upload")}
                className="mt-8 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-white font-semibold text-lg shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
              >
                Start Your Free Trial
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section> */}

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-8 bg-black relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            title="Frequently Asked Questions"
            subtitle="Find answers to common questions about our platform"
          />
          
          <div className="mt-16 space-y-6">
            <FaqItem 
              question="Is my data truly private?" 
              answer="Yes! Your files are encrypted before they leave your device, and only you have the decryption keys. Neither we nor anyone else can access your encrypted files without your permission." 
            />
            <FaqItem 
              question="What happens if I lose my Ethereum wallet?" 
              answer="Your files remain on IPFS, but access control depends on your Ethereum wallet. We strongly recommend backing up your wallet's seed phrase securely. You can also add backup wallets as authorized users for your files." 
            />
            <FaqItem 
              question="Are there any fees?" 
              answer="Storing data on IPFS through our platform is free for basic usage. Ethereum transactions may require small gas fees when registering files on the blockchain. Premium plans are available for users with larger storage needs." 
            />
            <FaqItem 
              question="How does the technology compare to traditional cloud storage?" 
              answer="Unlike traditional cloud storage where your files sit on centralized servers, our decentralized approach distributes your encrypted files across the IPFS network. This eliminates single points of failure, censorship risks, and unauthorized access concerns." 
            />
            <FaqItem 
              question="Can I share my files with others?" 
              answer="Yes! You can generate secure sharing links or grant specific Ethereum addresses permission to access your files. All sharing is managed through smart contracts, giving you complete control and transparency." 
            />
            <FaqItem 
              question="What file types are supported?" 
              answer="Our platform supports all file types, including documents, images, videos, audio files, and more. There are no restrictions on the types of files you can store, though file size limits may apply depending on your plan." 
            />
          </div>
        </div>
      </section>

      {/* Team Section */}
      {/* <section className="py-24 px-8 bg-gradient-to-b from-black to-gray-900 relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="Meet Our Team"
            subtitle="The experts behind our decentralized storage solution"
          />
          
          <div className="mt-16 grid md:grid-cols-4 gap-8">
            <TeamMember 
              name="Dr. Emma Chen"
              role="Founder & CEO"
              bio="Blockchain researcher with 10+ years in distributed systems"
              avatar="/placeholder.svg?height=200&width=200"
            />
            <TeamMember 
              name="David Kim"
              role="CTO"
              bio="Former lead developer at Ethereum Foundation"
              avatar="/placeholder.svg?height=200&width=200"
            />
            <TeamMember 
              name="Sophia Patel"
              role="Head of Security"
              bio="Cryptography expert with background in quantum computing"
              avatar="/placeholder.svg?height=200&width=200"
            />
            <TeamMember 
              name="Marcus Johnson"
              role="Lead Developer"
              bio="Full-stack engineer specializing in Web3 technologies"
              avatar="/placeholder.svg?height=200&width=200"
            />
          </div>
        </div>
      </section> */}

      {/* Call-to-Action (CTA) Section */}
      <section className="py-24 px-8 bg-gradient-to-r from-purple-900 to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full opacity-20 blur-3xl" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold"
          >
            Start Storing Your Files Securely Today
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-6 text-xl text-gray-200 max-w-2xl mx-auto"
          >
            Join thousands of users who trust our decentralized platform for their most important data. Get started in minutes with no credit card required.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/auth")}
              className="px-8 py-4 bg-white rounded-full text-purple-900 font-semibold text-lg shadow-lg hover:shadow-white/30 transition-all duration-300"
            >
              Get Started Free
            </motion.button>
            
           
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-8 bg-black border-t border-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                  EtherStore
                </span>
              </div>
              <p className="text-gray-400">
                Secure, decentralized file storage powered by Ethereum and IPFS.
              </p>
              <div className="flex gap-4">
                <SocialLink icon={<Twitter className="w-5 h-5" />} href="https://twitter.com" />
                <SocialLink icon={<Github className="w-5 h-5" />} href="https://github.com" />
                <SocialLink icon={<Linkedin className="w-5 h-5" />} href="https://linkedin.com" />
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <FooterLink href="#features">Features</FooterLink>
                <FooterLink href="#how-it-works">How It Works</FooterLink>
                <FooterLink href="#pricing">Pricing</FooterLink>
                <FooterLink href="#faq">FAQ</FooterLink>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <FooterLink href="/docs">Documentation</FooterLink>
                <FooterLink href="/api">API</FooterLink>
                <FooterLink href="/blog">Blog</FooterLink>
                <FooterLink href="/community">Community</FooterLink>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <FooterLink href="/about">About Us</FooterLink>
                <FooterLink href="/careers">Careers</FooterLink>
                <FooterLink href="/contact">Contact</FooterLink>
                <FooterLink href="/legal">Legal</FooterLink>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} EtherStore. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="/privacy" className="text-gray-500 hover:text-gray-300 text-sm">Privacy Policy</a>
              <a href="/terms" className="text-gray-500 hover:text-gray-300 text-sm">Terms of Service</a>
              <a href="/cookies" className="text-gray-500 hover:text-gray-300 text-sm">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Reusable Components

const NavLink = ({ href, children, isActive }) => (
  <a 
    href={href} 
    className={`text-sm font-medium transition-colors hover:text-white ${isActive ? 'text-white' : 'text-gray-400'}`}
  >
    {children}
  </a>
);

const SectionHeader = ({ title, subtitle }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true, margin: "-100px" }}
    className="text-center max-w-3xl mx-auto"
  >
    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
      {title}
    </h2>
    <p className="mt-4 text-xl text-gray-400">
      {subtitle}
    </p>
  </motion.div>
);

const FeatureCard = ({ icon, title, description }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true, margin: "-100px" }}
    className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-gray-800 shadow-xl hover:shadow-purple-500/5 transition-all duration-300 hover:-translate-y-1"
  >
    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </motion.div>
);

const StepCard = ({ step, icon, title, description }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: parseInt(step) * 0.1 }}
    viewport={{ once: true, margin: "-100px" }}
    className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-gray-800 shadow-xl relative"
  >
    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold z-10">
      {step}
    </div>
    <div className="pt-4 text-center">
      <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  </motion.div>
);

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, margin: "-100px" }}
      className="border border-gray-800 rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full p-6 text-left bg-gradient-to-br from-gray-900 to-black hover:from-gray-800 hover:to-black transition-colors"
      >
        <h3 className="text-lg font-semibold">{question}</h3>
        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-6 bg-black/50 border-t border-gray-800 text-gray-300">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const TestimonialCard = ({ quote, author, role, avatar }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true, margin: "-100px" }}
    className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-gray-800 shadow-xl"
  >
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <svg className="h-8 w-8 text-purple-400 opacity-80" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
          <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
        </svg>
      </div>
      <p className="text-gray-300 flex-grow">{quote}</p>
      <div className="flex items-center mt-6 pt-6 border-t border-gray-800">
        <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
          <img src={avatar || "/placeholder.svg"} alt={author} className="w-full h-full object-cover" />
        </div>
        <div>
          <h4 className="font-semibold">{author}</h4>
          <p className="text-sm text-gray-400">{role}</p>
        </div>
      </div>
    </div>
  </motion.div>
);

const StatCard = ({ value, label, icon }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true, margin: "-100px" }}
    className="text-center"
  >
    <div className="flex justify-center mb-4">
      {icon}
    </div>
    <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
      {value}
    </div>
    <div className="text-gray-400 mt-1">{label}</div>
  </motion.div>
);

const TeamMember = ({ name, role, bio, avatar }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true, margin: "-100px" }}
    className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-2xl border border-gray-800 shadow-xl text-center"
  >
    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4 border-2 border-purple-500/30">
      <img src={avatar || "/placeholder.svg"} alt={name} className="w-full h-full object-cover" />
    </div>
    <h3 className="text-lg font-semibold">{name}</h3>
    <p className="text-purple-400 text-sm mb-2">{role}</p>
    <p className="text-gray-400 text-sm">{bio}</p>
    <div className="flex justify-center gap-3 mt-4">
      <SocialLink icon={<Twitter className="w-4 h-4" />} href="#" small />
      <SocialLink icon={<Linkedin className="w-4 h-4" />} href="#" small />
      <SocialLink icon={<Github className="w-4 h-4" />} href="#" small />
    </div>
  </motion.div>
);

const SocialLink = ({ icon, href, small = false }) => (
  <motion.a
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.97 }}
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`${small ? 'w-8 h-8' : 'w-10 h-10'} rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-gray-700 hover:text-white transition-colors`}
  >
    {icon}
  </motion.a>
);

const FooterLink = ({ href, children }) => (
  <li>
    <a href={href} className="text-gray-400 hover:text-white transition-colors">
      {children}
    </a>
  </li>
);

// Background Components
const ParticleBackground = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-purple-500/20"
          initial={{ 
            x: Math.random() * 100 + "%", 
            y: Math.random() * 100 + "%",
            opacity: Math.random() * 0.5 + 0.3
          }}
          animate={{ 
            x: [
              Math.random() * 100 + "%", 
              Math.random() * 100 + "%", 
              Math.random() * 100 + "%"
            ],
            y: [
              Math.random() * 100 + "%", 
              Math.random() * 100 + "%", 
              Math.random() * 100 + "%"
            ]
          }}
          transition={{ 
            duration: Math.random() * 20 + 20, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      ))}
    </div>
  );
};
