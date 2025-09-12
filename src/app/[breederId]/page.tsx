'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Phone, Mail, MapPin, Star, Award, Heart } from 'lucide-react';
import { useAppSelector } from '@/store/hook';
import { AboutSection, FooterSection, HeaderSection, HeroSection, LayoutConfig, PetListSection, SectionType } from '@/types';
import { useMyPetsData } from '@/lib/hooks/useMyPetsData';
import { useUserData } from '@/lib/hooks/useUserData';
import { useParams } from 'next/navigation';


interface BreederInfo {
  name: string;
  title: string;
  description: string;
  experience: string;
  pets: string;
  rating: number;
  phone: string;
  email: string;
  address: string;
  heroImages: string[];
}

export default function BreederLandingPage() {
  // Get state from Redux store
  const {
    layoutConfig,
    headerConfig,
    heroConfig,
    petlistConfig,
    aboutConfig,
    footerConfig,
    loading,
    error,
    breederId
  } = useAppSelector((state) => state.userSite);

  const params = useParams()
  const userId = params.breederId as string

  const { myPets } = useMyPetsData();
  const { user } = useUserData(userId);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeSection, setActiveSection] = useState('home');

  const testimonials = [
    {
      name: "Sarah Johnson",
      text: "We got our Golden Retriever from Golden Grace Breeders and couldn't be happier. Bella is healthy, well-trained, and has the sweetest temperament.",
      rating: 5
    },
    {
      name: "Mike Chen",
      text: "Professional, caring, and knowledgeable. Our Yorkshire Terrier Charlie has been a perfect addition to our family.",
      rating: 5
    },
    {
      name: "Emily Davis",
      text: "The entire experience was wonderful. They really care about their dogs and it shows in the quality of the puppies.",
      rating: 5
    }
  ];

  useEffect(() => {
    const imagesLength = heroConfig?.imageUrls?.length || 0;
    if (imagesLength > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % imagesLength);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [heroConfig?.imageUrls]);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % myPets.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + myPets.length) % myPets.length);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              {headerConfig?.logoUrl && (
              <img
                src={headerConfig?.logoUrl}
                alt="Logo"
                width={100}
                height={50}
                className="object-contain w-12 h-12 rounded-full bg-black"
              />
              )}
              <span className="font-bold text-xl text-blue-900">{headerConfig?.businessName}</span>
            </div>
            <div className="hidden md:flex space-x-8">
              {['home', 'pets', 'about', 'contact'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`capitalize font-medium transition-colors ${activeSection === section
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                    }`}
                >
                  {section}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          {heroConfig?.imageUrls && heroConfig.imageUrls.length > 0 ? (
            // Có ảnh thì hiển thị slideshow
            heroConfig.imageUrls.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
              >
                <img
                  src={image} // Cloudinary URL
                  alt={`Hero ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ zIndex: index === currentSlide ? 10 : 0 }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-transparent" />
              </div>
            ))
          ) : (
            // Không có ảnh thì hiển thị ảnh mặc định
            <div className="absolute inset-0">
              <Image
                src="/api/placeholder/1920/1080" // Ảnh mặc định
                alt="Default Hero Background"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-transparent" />
            </div>
          )}
        </div>

        {/* Hero Navigation - chỉ hiển thị khi có nhiều ảnh */}
        {heroConfig?.imageUrls && heroConfig.imageUrls.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors z-20"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors z-20"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Hero Content */}
        <div className="relative z-30 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h1 className="text-5xl font-bold text-white mb-4">
                {heroConfig?.title}
              </h1>
              <p className="text-xl text-white/90 mb-8">
                {heroConfig?.subtitle}
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => scrollToSection('pets')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  View Our Pets
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Indicators - chỉ hiển thị khi có nhiều ảnh */}
        {heroConfig?.imageUrls && heroConfig.imageUrls.length > 1 && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-40">
            {heroConfig.imageUrls.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? 'bg-white' : 'bg-white/50'
                  }`}
              />
            ))}
          </div>
        )}
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{aboutConfig?.title}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {aboutConfig?.content}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{user?.id}</h3>
              <p className="text-gray-600">Years of Experience</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{user?.totalPetsSold}</h3>
              <p className="text-gray-600">Happy Families</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{user?.rating}</h3>
              <p className="text-gray-600">Average Rating</p>
            </div>
          </div>

          {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Image
                src="/api/placeholder/600/400"
                alt="About us"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Mission</h3>
              <p className="text-gray-600 mb-6">
                We believe that every puppy deserves the best start in life. Our breeding program focuses on health, temperament, and conformation. All our breeding dogs undergo comprehensive health testing, and we provide ongoing support to our puppy families.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Star className="w-5 h-5 text-blue-600 mt-1 mr-3" />
                  <span className="text-gray-600">Health tested breeding dogs</span>
                </li>
                <li className="flex items-start">
                  <Star className="w-5 h-5 text-blue-600 mt-1 mr-3" />
                  <span className="text-gray-600">Early socialization program</span>
                </li>
                <li className="flex items-start">
                  <Star className="w-5 h-5 text-blue-600 mt-1 mr-3" />
                  <span className="text-gray-600">Lifetime support for families</span>
                </li>
                <li className="flex items-start">
                  <Star className="w-5 h-5 text-blue-600 mt-1 mr-3" />
                  <span className="text-gray-600">AKC registered bloodlines</span>
                </li>
              </ul>
            </div>
          </div> */}
        </div>
      </section>

      {/* Pets Section */}
      <section id="pets" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Beautiful Pets</h2>
            <p className="text-xl text-gray-600">Available puppies ready for their forever homes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {myPets.map((pet) => (
              <div key={pet.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img
                    src={pet.images[0] || '/api/placeholder/300/300'}
                    alt={pet.name}
                    width={300}
                    height={300}
                    className="w-full h-64 object-cover"
                  />
                  {/* {pet.featured && (
                    <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
                      Featured
                    </div>
                  )} */}
                  {!pet.isAvailable && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Sold
                    </div>
                  )}
                  {pet.isAvailable && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Available
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{pet.name}</h3>
                  <p className="text-gray-600 mb-2">{pet.breed.name_vi}</p>
                  <p className="text-gray-600 mb-4">{pet.age} old</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">{pet.price}</span>
                    <button
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${pet.isAvailable
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      disabled={!pet.isAvailable}
                    >
                      {pet.isAvailable ? 'Inquire' : 'Sold'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {/* <section className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Families Say</h2>
            <p className="text-xl text-gray-600">Hear from families who found their perfect companion</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-lg">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                <p className="font-semibold text-gray-900">- {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Get In Touch</h2>
            <p className="text-xl text-gray-300">Ready to welcome a new family member? Contact us today!</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <Phone className="w-6 h-6 text-blue-400 mt-1 mr-4" />
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p className="text-gray-300">{footerConfig?.phone}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="w-6 h-6 text-blue-400 mt-1 mr-4" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-gray-300">{footerConfig?.email}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 text-blue-400 mt-1 mr-4" />
                  <div>
                    <p className="font-semibold">Address</p>
                    <p className="text-gray-300">{footerConfig?.address}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-6">Send us a message</h3>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell us about what you're looking for..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2024 {user?.name}. All rights reserved. Built with love for our furry friends.
          </p>
        </div>
      </footer>
    </div>
  );
}