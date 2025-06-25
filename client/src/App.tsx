import './index.css';
import Header from './components/layout/Header';
import ComingSoonContent from './components/ComingSoonContent';
import ProjectInquiryForm from './components/ProjectInquiryForm';
import BackgroundImage from './components/layout/BackgroundImage';

function App() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <BackgroundImage />
      
      {/* Fixed Header */}
      <Header />
      
      <div className="relative z-30 min-h-screen flex flex-col pt-20">
        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center p-6 md:p-8 lg:p-12">
          <div className="w-full max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left Column - Coming Soon Content */}
              <div className="space-y-8">
                <ComingSoonContent />
              </div>

              {/* Right Column - Project Inquiry Form */}
              <div className="flex justify-center lg:justify-end">
                <ProjectInquiryForm />
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 md:p-8 lg:p-12 bg-black text-white">
          <div className="text-center">
            <p className="font-poppins text-sm text-gray-400">
              © 2025 LIIGHT DESIGN INC. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;