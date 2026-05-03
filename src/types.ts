export type HairCondition = 'Healthy' | 'Telogen Effluvium' | 'Androgenetic Alopecia' | 'Seborrheic Dermatitis' | 'Alopecia Areata';

export interface ScanResult {
  condition: HairCondition;
  confidence: number;
  observations: string[];
  recommendations: string[];
}

export interface IntakeData {
  age: number;
  gender: string;
  sleepHours: number;
  stressLevel: number; // 1-10
  dietType: string;
  consumedFoods: string[];
}

export interface DietAudit {
  missingNutrients: string[];
  foodsToAdd: string[];
  foodsToAvoid: string[];
}

export interface TreatmentPlan {
  topical: string[];
  maintenance: string[];
  supplements: string[];
}

export interface FullDiagnosis {
  scan: ScanResult;
  diet: DietAudit;
  treatment: TreatmentPlan;
}
