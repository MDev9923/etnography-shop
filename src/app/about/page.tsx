'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getTranslation } from '@/lib/i18n';
import { Camera, Award, Users } from 'lucide-react';
import { useApp } from '@/lib/context';

export default function AboutPage() {
  const { language } = useApp();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-secondary to-black text-white py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-repeat" style={{
            //backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='macedonian' x='0' y='0' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Cpath d='M20 5c0-1.1-.9-2-2s-.9 2-2 2 .9 2 2 2-.9 2-2-2zm0 8c0-1.1-.9-2-2s-.9 2-2 2 .9 2 2 2-.9 2-2-2zm0 8c0-1.1-.9-2-2s-.9 2-2 2 .9 2 2 2-.9 2-2-2z' fill='%23A52A2A' fill-opacity='0.15'/%3E%3Cpath d='M5 15c0-1.1-.9-2-2s-.9 2-2 2 .9 2 2 2-.9 2-2-2zm0 8c0-1.1-.9-2-2s-.9 2-2 2 .9 2 2 2-.9 2-2-2zm0 8c0-1.1-.9-2-2s-.9 2-2 2 .9 2 2 2-.9 2-2-2z' fill='%23A52A2A' fill-opacity='0.25'/%3E%3Cpath d='M35 15c0-1.1-.9-2-2s-.9 2-2 2 .9 2 2 2-.9 2-2-2zm0 8c0-1.1-.9-2-2s-.9 2-2 2 .9 2 2 2-.9 2-2-2zm0 8c0-1.1-.9-2-2s-.9 2-2 2 .9 2 2 2-.9 2-2-2z' fill='%23A52A2A' fill-opacity='0.2'/%3E%3Cpath d='M5 25c0-1.1-.9-2-2s-.9 2-2 2 .9 2 2 2-.9 2-2-2zm0 8c0-1.1-.9-2-2s-.9 2-2 2 .9 2 2 2-.9 2-2-2zm0 8c0-1.1-.9-2-2s-.9 2-2 2 .9 2 2 2-.9 2-2-2z' fill='%23A52A2A' fill-opacity='0.1'/%3E%3Cpath d='M35 25c0-1.1-.9-2-2s-.9 2-2 2 .9 2 2 2-.9 2-2-2zm0 8c0-1.1-.9-2-2s-.9 2-2 2 .9 2 2 2-.9 2-2-2zm0 8c0-1.1-.9-2-2s-.9 2-2 2 .9 2 2 2-.9 2-2-2z' fill='%23A52A2A' fill-opacity='0.05'/%3E%3Cpath d='M20 35c0-1.1-.9-2-2s-.9 2-2 2 .9 2 2 2-.9 2-2-2zm0 8c0-1.1-.9-2-2s-.9 2-2 2 .9 2 2 2-.9 2-2-2zm0 8c0-1.1-.9-2-2s-.9 2-2 2 .9 2 2 2-.9 2-2-2z' fill='%23A52A2A' fill-opacity='0.08'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='80' height='80' fill='url(%23macedonian)'/%3E%3C/svg%3E")`,
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
              <Camera className="relative z-10 h-16 w-16 mx-auto text-gray-300 opacity-80" />
            </div>
            
            <h1 className="relative z-10 text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
              {getTranslation(language, 'about.title')}
            </h1>
            <p className="relative z-10 text-xl text-white max-w-3xl mx-auto drop-shadow">
              {getTranslation(language, 'about.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            {/* Mission */}
            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {getTranslation(language, 'about.mission')}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {getTranslation(language, 'about.missionText')}
              </p>
            </div>

            {/* Expertise */}
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {getTranslation(language, 'about.expertise')}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {getTranslation(language, 'about.expertiseText')}
              </p>
            </div>

            {/* Quality */}
            <div className="text-center">
              <div className="bg-accent rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Camera className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {getTranslation(language, 'about.qualityAssurance')}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {getTranslation(language, 'about.qualityAssuranceText')}
              </p>
            </div>
          </div>

          {/* Story Section */}
          <div className="bg-card rounded-2xl shadow-lg p-12 border border-border">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6">
                  {getTranslation(language, 'about.ourStory')}
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    {getTranslation(language, 'about.storyPart1')}
                  </p>
                  <p>
                    {getTranslation(language, 'about.storyPart2')}
                  </p>
                  <p>
                    {getTranslation(language, 'about.storyPart3')}
                  </p>
                </div>
              </div>
              <div style={{ opacity: '65%' }} className="flex items-center justify-center">
                <img
                  src="100.png"
                  alt="Etnography"
                  className="w-full max-w-md h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
