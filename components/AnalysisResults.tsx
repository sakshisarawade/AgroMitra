import React from 'react';
import { DiseaseAnalysis, Language } from '../types';
import { getTranslation } from '../utils/translations';

interface AnalysisResultsProps {
  result: DiseaseAnalysis;
  onReset: () => void;
  lang: Language;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result, onReset, lang }) => {
  const t = getTranslation(lang);

  if (!result.isLeaf) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center shadow-sm">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-red-800 mb-2">{t.notLeafTitle}</h3>
        <p className="text-red-600 mb-6">
          {t.notLeafDesc}
        </p>
        <button
          onClick={onReset}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
        >
          {t.tryAgain}
        </button>
      </div>
    );
  }

  // Determine styling based on the specific classes from the MATLAB model
  const diseaseLower = result.diseaseName?.toLowerCase() || '';
  
  // Mapping API result to Display Text
  let displayDiseaseName = result.diseaseName;
  let displayStatus = t.labels.infection;

  if (diseaseLower.includes('healthy')) {
    displayDiseaseName = t.labels.healthy;
    displayStatus = t.labels.healthy;
  } else if (diseaseLower.includes('bacterial')) {
    displayDiseaseName = t.labels.bacterial;
  } else if (diseaseLower.includes('mosaic')) {
    displayDiseaseName = t.labels.mosaic;
  }

  let colorTheme = {
    bg: 'bg-green-50',
    border: 'border-green-100',
    text: 'text-green-900',
    badgeBg: 'bg-green-200',
    badgeText: 'text-green-900',
    stroke: 'text-green-500',
    iconColor: 'text-green-600'
  };

  if (diseaseLower.includes('healthy')) {
    colorTheme = {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-800',
      badgeBg: 'bg-emerald-200',
      badgeText: 'text-emerald-800',
      stroke: 'text-emerald-500',
      iconColor: 'text-emerald-600'
    };
  } else if (diseaseLower.includes('bacterial')) {
    // Orange theme for Bacterial
    colorTheme = {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-900',
      badgeBg: 'bg-orange-200',
      badgeText: 'text-orange-900',
      stroke: 'text-orange-500',
      iconColor: 'text-orange-600'
    };
  } else if (diseaseLower.includes('mosaic')) {
    // Yellow/Amber theme for Mosaic
    colorTheme = {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-900',
      badgeBg: 'bg-yellow-200',
      badgeText: 'text-yellow-900',
      stroke: 'text-yellow-500',
      iconColor: 'text-yellow-600'
    };
  } else {
    // Default Red/Amber for other diseases
    colorTheme = {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-900',
      badgeBg: 'bg-red-200',
      badgeText: 'text-red-900',
      stroke: 'text-red-500',
      iconColor: 'text-red-600'
    };
  }

  const confidencePercent = Math.round((result.confidence || 0) * 100);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-green-100 overflow-hidden">
      <div className={`p-6 ${colorTheme.bg} border-b ${colorTheme.border}`}>
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2 mb-1">
               {diseaseLower.includes('healthy') ? (
                 <span className="text-2xl">🌿</span>
               ) : diseaseLower.includes('bacterial') ? (
                 <span className="text-2xl">🦠</span>
               ) : diseaseLower.includes('mosaic') ? (
                 <span className="text-2xl">🟡</span>
               ) : (
                 <span className="text-2xl">🍂</span>
               )}
               <h2 className={`text-2xl font-bold ${colorTheme.text}`}>
                {displayDiseaseName}
              </h2>
            </div>
            
            <div className="flex items-center mt-2 space-x-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${colorTheme.badgeBg} ${colorTheme.badgeText}`}>
                {displayStatus}
              </span>
              <span className="text-sm opacity-80 font-medium text-current">
                {t.sections.confidence}: {confidencePercent}%
              </span>
            </div>
          </div>
          
          {/* Circular Confidence Meter */}
          <div className="relative w-16 h-16">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                className="text-black/10"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className={`${colorTheme.stroke} transition-all duration-1000 ease-out`}
                strokeDasharray={`${confidencePercent}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <div className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${colorTheme.text}`}>
              {confidencePercent}%
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-green-700/60 uppercase tracking-wider mb-2">{t.sections.analysis}</h3>
          <p className="text-green-900 leading-relaxed">
            {result.description}
          </p>
        </div>

        {result.treatment && (
          <div>
            <h3 className="text-sm font-semibold text-green-700/60 uppercase tracking-wider mb-2">{t.sections.treatment}</h3>
            <div className="bg-green-50/50 rounded-lg p-4 border border-green-100 text-green-900 flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              {result.treatment}
            </div>
          </div>
        )}

        {result.preventativeMeasures && result.preventativeMeasures.length > 0 && (
          <div>
             <h3 className="text-sm font-semibold text-green-700/60 uppercase tracking-wider mb-2">{t.sections.preventative}</h3>
             <ul className="space-y-2">
                {result.preventativeMeasures.map((measure, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-green-900 bg-green-50/30 p-2 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">{measure}</span>
                  </li>
                ))}
             </ul>
          </div>
        )}

        <div className="pt-4 border-t border-green-100">
          <button
            onClick={onReset}
            className="w-full py-3 bg-green-800 hover:bg-green-900 text-white font-semibold rounded-lg transition-all transform active:scale-[0.98] shadow-md hover:shadow-lg"
          >
            {t.analyzeAnother}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;