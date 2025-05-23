import React, { useState } from 'react';
import { Upload, AlertCircle, FileWarning, Star, Shield, Brain, Activity, Users, Menu, X } from 'lucide-react';
const BASE_URL = "http://localhost:3000";
console.log(BASE_URL)
interface AnalysisResult {
  condition: string;
  fullName: string;
  confidence: number;
  medications: string[];
  precautions: string[];
  severity: string;
}

interface Testimonial {
  name: string;
  role: string;
  content: string;
  image: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    name: "Dr. Sarah Johnson",
    role: "Dermatologist",
    content: "DermaLens has revolutionized how I provide initial consultations. The accuracy of its AI analysis is remarkable.",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Patient",
    content: "The instant analysis helped me understand my condition before visiting my doctor. It's an invaluable tool for skin health awareness.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300&h=300",
    rating: 5
  },
  {
    name: "Dr. Emily Rodriguez",
    role: "Clinical Researcher",
    content: "The accuracy and depth of analysis provided by DermaLens is impressive. It's a game-changer in dermatological screening.",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300",
    rating: 5
  }
];

const features = [
  {
    icon: <Shield className="h-6 w-6 text-emerald-400" />,
    title: "Privacy First",
    description: "Your data is encrypted and never stored. We prioritize your privacy and security."
  },
  {
    icon: <Brain className="h-6 w-6 text-emerald-400" />,
    title: "Advanced AI",
    description: "Powered by state-of-the-art machine learning models trained on millions of cases."
  },
  {
    icon: <Activity className="h-6 w-6 text-emerald-400" />,
    title: "Quick Results",
    description: "Get instant analysis and recommendations within seconds."
  },
  {
    icon: <Users className="h-6 w-6 text-emerald-400" />,
    title: "Expert Validated",
    description: "Our system is validated by leading dermatologists and healthcare professionals."
  }
];

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
      setResult(null);
      setShowAnalysis(true);
      await analyzeImage(file);
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
      setResult(null);
      setShowAnalysis(true);
      await analyzeImage(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const analyzeImage = async (file: File) => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`http://localhost:5001/upload`, {
        method: 'POST',
        body: formData,
        headers: {
         'Accept': 'application/json',
       },
        //body: JSON.stringify({ key: "value" }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      //console.log("Server response:", data);
     // if (!data || Object.keys(data).length === 0) {
         // throw new Error(" No data received from server.");
     // }
      
      setResult(data);
    } catch (err) {
        //console.error ('Analysis error:', err);
      setError(err instanceof Error ? err.message : "Failed to analyze image.");
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 text-gray-100">
      {/* Navigation */}
      <nav className="bg-navy-800 fixed w-full z-50 top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-emerald-400">DermaLens</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('home')}
                className={`text-sm font-medium ${activeSection === 'home' ? 'text-emerald-400' : 'text-gray-300 hover:text-emerald-400'}`}
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className={`text-sm font-medium ${activeSection === 'about' ? 'text-emerald-400' : 'text-gray-300 hover:text-emerald-400'}`}
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('features')}
                className={`text-sm font-medium ${activeSection === 'features' ? 'text-emerald-400' : 'text-gray-300 hover:text-emerald-400'}`}
              >
                Features
              </button>
              
              <button 
                onClick={() => scrollToSection('contact')}
                className={`text-sm font-medium ${activeSection === 'contact' ? 'text-emerald-400' : 'text-gray-300 hover:text-emerald-400'}`}
              >
                Contact
              </button>
            </div>
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-300 hover:text-emerald-400"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-navy-800 border-t border-navy-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {['home', 'about', 'features', 'testimonials', 'contact'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-300 hover:text-emerald-400"
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div id="home" className="relative pt-16">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80"
            alt="Dermatologist examining patient"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              AI-Powered Skin Analysis
            </h1>
            <p className="mt-4 text-xl text-gray-400">
              Get instant, accurate skin condition analysis powered by advanced AI
            </p>
            <button
              onClick={() => {
                setShowAnalysis(true);
                document.getElementById('file-upload')?.click();
              }}
              className="mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700"
            >
              <Upload className="mr-2 h-5 w-5" />
              Analyze Skin Condition
            </button>
          </div>
        </div>
      </div>

      {/* Analysis Section */}
      {showAnalysis && (
        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="bg-navy-800 rounded-lg shadow-xl p-6">
              <div
                className="border-2 border-dashed border-navy-600 rounded-lg p-8 text-center"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-64 mx-auto mb-4 rounded-lg"
                  />
                ) : (
                  <div className="space-y-4">
                    <Upload className="mx-auto h-12 w-12 text-gray-500" />
                    <div className="text-gray-400">
                      <label htmlFor="file-upload" className="cursor-pointer text-emerald-400 hover:text-emerald-300">
                        Upload a file
                      </label>
                      {" or drag and drop"}
                    </div>
                    <p className="text-sm text-gray-500">PNG, JPG, JPEG up to 10MB</p>
                  </div>
                )}
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-900 rounded-md flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                  <p className="text-red-200">{error}</p>
                </div>
              )}
            </div>

            {/* Results Section */}
            <div className="bg-navy-800 rounded-lg shadow-xl p-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto"></div>
                  <p className="mt-4 text-gray-400">Analyzing your image...</p>
                </div>
              ) : result ? (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-white">{result.condition}</h2>
                    <p className="mt-2 text-gray-400">{result.fullName}</p>
                    <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-900 text-emerald-200">
                      {result.severity} Severity
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-white">Recommended Medications</h3>
                    <ul className="mt-2 space-y-2">
                    {result?.medications?.length ? (
  result.medications.map((med, index) => (
    <li key={index} className="bg-navy-700 p-3 rounded-md">
      <p className="text-white">{med}</p>
    </li>
  ))
) : (
  <p className="text-gray-400">No medications available</p>
)}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium text-white">Precautions</h3>
                    <ul className="mt-2 space-y-2">
                    {result?.precautions?.length ? (
  result.precautions.map((precaution, index) => (
    <li key={index} className="flex items-center text-gray-400">
      <span className="mr-2">•</span>
      {precaution}
    </li>
  ))
) : (
  <p className="text-gray-400">No precautions available</p>
)}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-navy-700">
                    <p className="text-sm text-gray-400">
                    
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <FileWarning className="h-12 w-12 mx-auto text-gray-600" />
                  <p className="mt-4">Upload an image to see the analysis results</p>
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      {/* Features Section */}
      <section id="features" className="py-16 bg-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Advanced Features</h2>
            <p className="mt-4 text-gray-400">Powered by cutting-edge technology and medical expertise</p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div key={index} className="bg-navy-900 p-6 rounded-lg">
                <div className="bg-navy-800 rounded-lg p-2 inline-block">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-lg font-medium text-white">{feature.title}</h3>
                <p className="mt-2 text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Contact Us</h2>
            <p className="mt-4 text-gray-400">Get in touch with our team</p>
          </div>
          <div className="mt-12 max-w-lg mx-auto">
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 block w-full rounded-md bg-navy-900 border-navy-700 text-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full rounded-md bg-navy-900 border-navy-700 text-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300">Message</label>
                <textarea
                  id="message"
                  rows={4}
                  className="mt-1 block w-full rounded-md bg-navy-900 border-navy-700 text-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Medical Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-navy-800 rounded-lg p-6">
          <h2 className="text-lg font-medium text-white">Important Notice</h2>
          <p className="mt-2 text-gray-400">
            This tool is for educational purposes only and should not be used as a substitute for professional medical advice. 
            Always consult with a qualified healthcare provider for proper diagnosis and treatment of skin conditions.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;