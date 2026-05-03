import { HairCondition, DietAudit, TreatmentPlan } from './types';

export const CONDITION_DETAILS: Record<HairCondition, { title: string; description: string }> = {
  'Healthy': {
    title: 'Optimal Scalp Health',
    description: 'Your scalp shows regular density and healthy follicle patterns. Current hair fall is likely within normal range (50-100 strands/day).'
  },
  'Telogen Effluvium': {
    title: 'Telogen Effluvium (Stress-Induced Shedding)',
    description: 'Abrupt hair thinning often triggered by physical or emotional stress, nutritional deficiencies, or hormonal shifts.'
  },
  'Androgenetic Alopecia': {
    title: 'Androgenetic Alopecia (Pattern Thinning)',
    description: 'Hereditary thinning characterized by a predictable pattern, often related to sensitivity to dihydrotestosterone (DHT).'
  },
  'Seborrheic Dermatitis': {
    title: 'Scalp Inflammation / Seborrheic Dermatitis',
    description: 'Redness and scaling of the scalp which can weaken follicles and lead to temporary inflammatory shedding.'
  },
  'Alopecia Areata': {
    title: 'Alopecia Areata (Patchy Loss)',
    description: 'Autoimmune condition causing specific circular patches of hair loss.'
  }
};

export const NUTRIENT_FOOD_MAP: Record<string, { nutrient: string; foods: string[] }> = {
  'Spinach': { nutrient: 'Iron', foods: ['Lentils', 'Red Meat', 'Pumpkin Seeds'] },
  'Eggs': { nutrient: 'Biotin', foods: ['Almonds', 'Walnuts', 'Sweet Potatoes'] },
  'Oysters': { nutrient: 'Zinc', foods: ['Chickpeas', 'Beef', 'Cashews'] },
  'Salmon': { nutrient: 'Omega-3', foods: ['Flaxseeds', 'Chia Seeds', 'Soybeans'] },
  'Citrus': { nutrient: 'Vitamin C', foods: ['Bell Peppers', 'Strawberries', 'Broccoli'] },
};

export function auditDiet(consumedFoods: string[]): DietAudit {
  const missingNutrients: string[] = [];
  const foodsToAdd: string[] = [];
  
  // Simple logic: if common hair-health foods aren't mentioned, suggest them
  Object.entries(NUTRIENT_FOOD_MAP).forEach(([food, info]) => {
    const mentionsFood = consumedFoods.some(f => f.toLowerCase().includes(food.toLowerCase()) || f.toLowerCase().includes(info.nutrient.toLowerCase()));
    if (!mentionsFood) {
      missingNutrients.push(info.nutrient);
      foodsToAdd.push(...info.foods.slice(0, 2));
    }
  });

  return {
    missingNutrients: [...new Set(missingNutrients)],
    foodsToAdd: [...new Set(foodsToAdd)],
    foodsToAvoid: ['Refined Sugar', 'High-Mercury Fish', 'Excessive Alcohol', 'Trans Fats']
  };
}

export function getTreatmentPlan(condition: HairCondition, age: number): TreatmentPlan {
  const basePlan: TreatmentPlan = {
    topical: ['Rosemary Oil (diluted)', 'Weekly Scalp Massage'],
    maintenance: ['Silk Pillowcase', 'Cold Water Rinses', 'Low-Heat Styling'],
    supplements: ['Multivitamin with Zinc']
  };

  if (condition === 'Androgenetic Alopecia') {
    basePlan.topical.push('Minoxidil 5% (Consult Doctor)', 'Ketoconazole Shampoo');
    basePlan.supplements.push('Saw Palmetto', 'Pumpkin Seed Oil');
  } else if (condition === 'Telogen Effluvium') {
    basePlan.topical.push('Scalp Soothing Serums');
    basePlan.supplements.push('Iron (if deficient)', 'Ashwagandha for Stress');
  } else if (condition === 'Seborrheic Dermatitis') {
    basePlan.topical = ['Antifungal Shampoo', 'Tea Tree Oil (diluted)'];
    basePlan.maintenance.push('Avoid Heavy Oils', 'Wash Scalp Frequently');
  }

  return basePlan;
}
