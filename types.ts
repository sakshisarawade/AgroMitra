export interface DiseaseAnalysis {
  isLeaf: boolean;
  diseaseName?: string;
  confidence?: number;
  description?: string;
  treatment?: string;
  preventativeMeasures?: string[];
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface UploadedImage {
  file: File;
  previewUrl: string;
  base64: string;
}

export type Language = 'en' | 'hi' | 'mr' | 'gu';