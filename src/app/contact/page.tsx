'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useApp } from '@/lib/context';
import { getTranslation } from '@/lib/i18n';
import { Mail, Phone, MapPin, Send, Instagram } from 'lucide-react';

export default function ContactPage() {
  const { language } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitMessage(language === 'en' 
        ? 'Thank you for your message! We will get back to you soon.' 
        : 'Ви благодариме за пораката! Ќе ве контактираме наскоро.'
      );
      setFormData({ name: '', email: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-secondary to-black text-white py-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-repeat" style={{
            //backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='macedonian' x='0' y='0' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Cpath d='M20 5c0-1.1-.9-2-2s-.9 2-2 2 .9 2 2 2-.9 2-2-2zm0 8c0-1.1-.9-2-2s-.9 2-2 2 .9 2 2 2-.9 2-2-2zm0 8c0-1.1-.9-2-2s-.9 2-2 2 .9 2 2 2-.9 2-2-2z' fill='%23A52A2A' fill-opacity='0.15'/%3E%3Cpath d='M5 15c0-1.1-.9-2-2s-.9 2-2 2 .9 2 2 2-.9 2-2-2zm0 8c0-1.1-.9-2-2s-.9 2-2 2 .9 2 2 2-.9 2-2-2zm0 8c0-1.1-.9-2-2s-.9 2-2 2 .9 2 2 2-.9 2-2-2z' fill='%23A52A2A' fill-opacity='0.25'/%3E%3Cpath d='M35 15c0-1.1-.9-2-2s-.9 2-2 2 .9 2 2 2-.9 2-2-2zm0 8c0-1.1-.9-2-2s-.9 2-2 2 .9 2 2 2-.9 2-2-2zm0 8c0-1.1-.9-2-2s-.9 2-2 2 .9 2 2 2-.9 2-2-2z' fill='%23A52A2A' fill-opacity='0.2'/%3E%3Cpath d='M5 25c0-1.1-.9-2-2s-.9 2-2 2 .9 2 2 2-.9 2-2-2zm0 8c0-1.1-.9-2-2s-.9 2-2 2 .9 2 2 2-.9 2-2-2zm0 8c0-1.1-.9-2-2s-.9 2-2 2 .9 2 2 2-.9 2-2-2z' fill='%23A52A2A' fill-opacity='0.1'/%3E%3Cpath d='M35 25c0-1.1-.9-2-2s-.9 2-2 2 .9 2 2 2-.9 2-2-2zm0 8c0-1.1-.9-2-2s-.9 2-2 2 .9 2 2 2-.9 2-2-2zm0 8c0-1.1-.9-2-2s-.9 2-2 2 .9 2 2 2-.9 2-2-2z' fill='%23A52A2A' fill-opacity='0.15'/%3E%3Cpath d='M5 35c0-1.1-.9-2-2s-.9 2-2 2 .9 2 2 2-.9 2-2-2zm0 8c0-1.1-.9-2-2s-.9 2-2 2 .9 2 2 2-.9 2-2-2zm0 8c0-1.1-.9-2-2s-.9 2-2 2 .9 2 2 2-.9 2-2-2z' fill='%23A52A2A' fill-opacity='0.05'/%3E%3Cpath d='M35 35c0-1.1-.9-2-2s-.9 2-2 2 .9 2 2 2-.9 2-2-2zm0 8c0-1.1-.9-2-2s-.9 2-2 2 .9 2 2 2-.9 2-2-2zm0 8c0-1.1-.9-2-2s-.9 2-2 2 .9 2 2 2-.9 2-2-2z' fill='%23A52A2A' fill-opacity='0.08'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='80' height='80' fill='url(%23macedonian)'/%3E%3C/svg%3E")`,
            backgroundSize: '80px 80px'
          }}></div>
        </div>

        {/* Background Image */}
        <div className="absolute inset-0 opacity-45">
          <img
            src="/catalog-camera.JPG"
            alt="Etnography Background"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            {/* Logo as background element */}
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <img
                  src="/Logo.png"
                  alt="Etnography Logo Background"
                  className="w-96 h-96 object-contain"
                />
              </div>
              <Mail className="relative z-10 h-16 w-16 mx-auto text-gray-300 opacity-80" />
            </div>
            
            <h1 className="relative z-10 text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
              Etnography
            </h1>
            <p className="relative z-10 text-xl text-white max-w-3xl mx-auto drop-shadow">
              {getTranslation(language, 'contact.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-card p-8 rounded-lg shadow-md border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {getTranslation(language, 'common.sendMessage')}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    {getTranslation(language, 'contact.name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
                    placeholder={getTranslation(language, 'common.yourName')}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    {getTranslation(language, 'contact.email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
                    placeholder={getTranslation(language, 'common.yourEmail')}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    {getTranslation(language, 'contact.message')}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground resize-none"
                    placeholder={getTranslation(language, 'common.yourMessage')}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-accent transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground"></div>
                      <span>{getTranslation(language, 'common.sending')}</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>{getTranslation(language, 'contact.send')}</span>
                    </>
                  )}
                </button>

                {submitMessage && (
                  <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                    {submitMessage}
                  </div>
                )}
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8 h-full">
              {/* Contact Details */}
              <div className="bg-card p-8 rounded-lg shadow-md border border-border h-full">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  {getTranslation(language, 'common.getInTouch')}
                </h2>
                
                <div className="space-y-6 flex flex-col h-full">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 rounded-full p-3">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {getTranslation(language, 'contact.emailLabel')}
                      </h3>
                      <a 
                        href="mailto:etnography35mk@gmail.com"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        etnography35mk@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-pink-100 rounded-full p-3">
                      <Instagram className="h-6 w-6 text-pink-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {getTranslation(language, 'contact.instagram')}
                      </h3>
                      <p className="text-muted-foreground">_etnography</p>
                      <a
                        href="https://ig.me/_etnography"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-accent font-medium transition-colors"
                      >
                        {getTranslation(language, 'common.followInstagram')}
                      </a>
                      <p className="text-sm text-muted-foreground mt-2">
                        {language === 'en' 
                          ? 'DM us to buy products directly!' 
                          : 'Испратете ни порака за директна купување на производи!'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex-grow flex items-center justify-center relative pb-8">
                    <div className="relative h-64 rounded-lg overflow-hidden">
                      <img 
                        src="/qr-background.jpg" 
                        alt="QR Code Background" 
                        className="w-full h-full object-cover opacity-20"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <img 
                            src="/qr-code.png" 
                            alt="Etnography QR Code" 
                            className="w-48 h-48 mx-auto mb-2"
                          />
                          <p className="text-sm text-muted-foreground">
                            {getTranslation(language, 'common.scanContact')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
