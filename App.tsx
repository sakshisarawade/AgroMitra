import React, { useState } from 'react';
import ImageUpload from './components/ImageUpload';
import AnalysisResults from './components/AnalysisResults';
import { analyzeLeafImage } from './services/geminiService';
import { AnalysisStatus, DiseaseAnalysis, UploadedImage, Language } from './types';
import { getTranslation } from './utils/translations';

const App: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [currentImage, setCurrentImage] = useState<UploadedImage | null>(null);
  const [analysisResult, setAnalysisResult] = useState<DiseaseAnalysis | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('en');

  const t = getTranslation(language);

  const handleImageSelected = async (file: File) => {
    // Create local preview
    const previewUrl = URL.createObjectURL(file);
    
    // Convert to Base64 for API
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setCurrentImage({ file, previewUrl, base64 });
      runAnalysis(base64);
    };
    reader.readAsDataURL(file);
  };

  const runAnalysis = async (base64: string) => {
    setStatus(AnalysisStatus.ANALYZING);
    setErrorMsg(null);
    try {
      const result = await analyzeLeafImage(base64, language);
      setAnalysisResult(result);
      setStatus(AnalysisStatus.SUCCESS);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "An unexpected error occurred");
      setStatus(AnalysisStatus.ERROR);
    }
  };

  const handleReset = () => {
    setStatus(AnalysisStatus.IDLE);
    setCurrentImage(null);
    setAnalysisResult(null);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-green-50 pb-12 font-sans selection:bg-green-200">
      {/* Header */}
      <header className="bg-white border-b border-green-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
             <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-1.5 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
             </div>
             <div>
               <h1 className="text-xl font-bold text-green-900 tracking-tight leading-none">{t.appTitle}</h1>
               <p className="text-[10px] text-green-600 font-medium uppercase tracking-wide">{t.modelLabel}</p>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-green-50 border border-green-200 text-green-800 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block p-2 outline-none cursor-pointer hover:bg-green-100 transition-colors"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="mr">मराठी (Marathi)</option>
              <option value="gu">ગુજરાતી (Gujarati)</option>
            </select>
            <div className="text-sm font-medium text-green-600/60 hidden sm:block border-l border-green-100 pl-4">
              {t.poweredBy}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Intro Section - Only show when idle */}
        {status === AnalysisStatus.IDLE && (
          <div className="text-center mb-12 animate-fade-in-up">
            
            {/* Tomato Plant Image */}
            <div className="flex justify-center mb-8">
               <div className="relative group">
                 <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                 <img 
                   src="https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400&h=400&fit=crop&q=80" 
                   alt="Tomato Plant" 
                   className="relative w-40 h-40 sm:w-48 sm:h-48 object-cover rounded-2xl shadow-xl border-4 border-white transform transition-transform duration-500 hover:scale-105"
                 />
                 <div className="absolute -bottom-4 -right-4 bg-white p-2 rounded-full shadow-lg border border-green-100 z-10">
                    <span className="text-2xl" role="img" aria-label="tomato">🍅</span>
                 </div>
               </div>
            </div>

            <h2 className="text-3xl font-extrabold text-green-900 sm:text-4xl mb-4">
              {t.heroTitle}
            </h2>
            <p className="text-lg text-green-800/70 max-w-2xl mx-auto mb-8">
              {t.heroDesc}
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold text-sm border border-green-600 shadow-sm">
                🌿 {t.labels.healthy}
              </span>
              <span className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full font-semibold text-sm border border-orange-200 shadow-sm">
                🦠 {t.labels.bacterial}
              </span>
              <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full font-semibold text-sm border border-yellow-200 shadow-sm">
                🟡 {t.labels.mosaic}
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Upload & Preview */}
          <div className={`lg:col-span-${status === AnalysisStatus.SUCCESS ? '5' : '12'} transition-all duration-500 ease-in-out`}>
            
            {status === AnalysisStatus.IDLE && (
               <div className="bg-white p-8 rounded-2xl shadow-sm border border-green-100">
                  <h3 className="text-lg font-semibold text-green-900 mb-4">{t.uploadTitle}</h3>
                  <ImageUpload onImageSelected={handleImageSelected} lang={language} />
               </div>
            )}

            {(status === AnalysisStatus.ANALYZING || status === AnalysisStatus.SUCCESS || status === AnalysisStatus.ERROR) && currentImage && (
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-green-100">
                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-green-50">
                  <img 
                    src={currentImage.previewUrl} 
                    alt="Uploaded leaf" 
                    className="h-full w-full object-cover"
                  />
                   {/* Scanning Overlay Animation */}
                   {status === AnalysisStatus.ANALYZING && (
                    <div className="absolute inset-0 bg-green-900/20 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center">
                       <div className="absolute top-0 left-0 w-full h-1 bg-green-400 shadow-[0_0_20px_rgba(74,222,128,1)] animate-scan"></div>
                       <div className="bg-white px-6 py-4 rounded-2xl shadow-xl flex flex-col items-center space-y-3">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                          <span className="font-semibold text-green-900 text-sm">{t.processing}</span>
                       </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {status === AnalysisStatus.ERROR && (
               <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-start space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="font-semibold">{t.analysisError}</h4>
                    <p className="text-sm mt-1">{errorMsg}</p>
                    <button onClick={handleReset} className="text-sm font-medium underline mt-2 hover:text-red-800">{t.tryAgain}</button>
                  </div>
               </div>
            )}
          </div>

          {/* Right Column: Results */}
          {status === AnalysisStatus.SUCCESS && analysisResult && (
            <div className="lg:col-span-7 animate-fade-in-right">
              <AnalysisResults result={analysisResult} onReset={handleReset} lang={language} />
            </div>
          )}
          
        </div>
      </main>
      
      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan {
          animation: scan 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @keyframes fade-in-right {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in-right {
          animation: fade-in-right 0.6s ease-out forwards;
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;