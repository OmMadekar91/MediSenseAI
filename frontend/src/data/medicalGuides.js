/**
 * Patient-friendly educational reference guides and biological plausibility ranges
 * for laboratory tests extracted by MediSense AI.
 * 
 * Sources: MedlinePlus (National Library of Medicine), NIH, NHLBI, NIDDK, AHA.
 */

export const MEDICAL_TEST_GUIDES = {
  hemoglobin: {
    displayName: "Hemoglobin (Hb)",
    category: "Complete Blood Count",
    whatItIs: "Hemoglobin is an iron-rich protein inside your red blood cells. It carries oxygen from your lungs to tissues throughout your body.",
    whyItMatters: "Low hemoglobin can mean fewer oxygen carriers (anemia), leading to fatigue or feeling cold. Higher levels can happen with dehydration, smoking, or living at higher altitudes.",
    doctorQuestions: [
      "Could nutritional factors such as iron, vitamin B12, or folate be affecting my hemoglobin?",
      "Do I need any follow-up tests or dietary changes based on this number?"
    ],
    minPlausible: 3.0,
    maxPlausible: 25.0,
    expectedUnits: ["g/dL", "g/L"]
  },
  wbc: {
    displayName: "White Blood Cells (WBC)",
    category: "Complete Blood Count",
    whatItIs: "White blood cells are the defense cells of your immune system that help fight infections and respond to inflammation.",
    whyItMatters: "Levels often rise temporarily when your body is fighting a cold, infection, or inflammation. Lower levels may occur with certain medications, viral illnesses, or immune changes.",
    doctorQuestions: [
      "Is this level consistent with any recent infections or illnesses I've had?",
      "Should we repeat this test after I recover from my recent symptoms?"
    ],
    minPlausible: 500, // or 0.5 in 10^3
    maxPlausible: 100000,
    expectedUnits: ["cells/uL", "cells/μL", "10^3/uL", "10^3/μL", "/uL"]
  },
  rbc: {
    displayName: "Red Blood Cells (RBC)",
    category: "Complete Blood Count",
    whatItIs: "Red blood cells are the primary cells that deliver oxygen to your organs and remove carbon dioxide.",
    whyItMatters: "A lower count is associated with anemia or fluid changes. A higher count can occur with low oxygen levels or dehydration.",
    doctorQuestions: [
      "How does my red blood cell count compare with my hemoglobin and hematocrit?",
      "Are there lifestyle or hydration factors that might explain this result?"
    ],
    minPlausible: 1.0,
    maxPlausible: 10.0,
    expectedUnits: ["million/uL", "million/μL", "10^6/uL", "10^12/L"]
  },
  platelets: {
    displayName: "Platelet Count (Plt)",
    category: "Complete Blood Count",
    whatItIs: "Platelets are small blood cell fragments that clump together to form clots, helping stop bleeding from cuts or injuries.",
    whyItMatters: "Low platelets can increase easy bruising or minor bleeding. High platelets frequently occur as a temporary reaction to inflammation or iron deficiency.",
    doctorQuestions: [
      "Do my platelet numbers explain any bruising or bleeding symptoms I have noticed?",
      "Are any of my current medications or supplements known to affect platelet counts?"
    ],
    minPlausible: 10,
    maxPlausible: 2000,
    expectedUnits: ["10^3/uL", "10^3/μL", "cells/uL", "/mcL"]
  },
  hematocrit: {
    displayName: "Hematocrit (Hct)",
    category: "Complete Blood Count",
    whatItIs: "Hematocrit measures the percentage of your total blood volume that consists of red blood cells.",
    whyItMatters: "It closely tracks with hemoglobin and helps evaluate oxygen-carrying capacity and hydration balance.",
    doctorQuestions: [
      "Does this hematocrit result align with my overall energy levels and hydration?",
      "Would you recommend checking my iron levels?"
    ],
    minPlausible: 10.0,
    maxPlausible: 75.0,
    expectedUnits: ["%"]
  },
  glucose: {
    displayName: "Fasting Blood Glucose",
    category: "Metabolic Panel",
    whatItIs: "Glucose is the primary sugar circulating in your blood, providing energy to your cells, brain, and muscles.",
    whyItMatters: "Elevated fasting levels can be a sign of prediabetes or diabetes. Lower levels can cause shakiness, sweating, or hunger.",
    doctorQuestions: [
      "Was my fasting window (typically 8–12 hours) sufficient for an accurate reading?",
      "Would an HbA1c test be helpful to check my average blood sugar over the last 3 months?"
    ],
    minPlausible: 25.0,
    maxPlausible: 1200.0,
    expectedUnits: ["mg/dL", "mmol/L"]
  },
  hba1c: {
    displayName: "Hemoglobin A1c (HbA1c)",
    category: "Diabetes & Metabolism",
    whatItIs: "HbA1c measures the percentage of your red blood cells coated with sugar, providing an estimate of your average blood sugar over the past 2 to 3 months.",
    whyItMatters: "Unlike daily blood sugar, A1c does not change based on what you ate this morning, making it a reliable diagnostic and monitoring tool.",
    doctorQuestions: [
      "What target A1c range is most appropriate for my age and health goals?",
      "What dietary, exercise, or medication steps are recommended for my current level?"
    ],
    minPlausible: 3.0,
    maxPlausible: 20.0,
    expectedUnits: ["%"]
  },
  creatinine: {
    displayName: "Serum Creatinine",
    category: "Kidney Function",
    whatItIs: "Creatinine is a natural waste byproduct from normal daily muscle activity that healthy kidneys filter out through urine.",
    whyItMatters: "If kidney filtration slows down or if you are dehydrated, creatinine levels in your blood can rise.",
    doctorQuestions: [
      "Could temporary dehydration or exercise have influenced this creatinine level?",
      "What does my calculated eGFR (filtration rate) show about my overall kidney function?"
    ],
    minPlausible: 0.1,
    maxPlausible: 25.0,
    expectedUnits: ["mg/dL", "μmol/L", "umol/L"]
  },
  bun: {
    displayName: "Blood Urea Nitrogen (BUN)",
    category: "Kidney Function",
    whatItIs: "BUN measures the amount of nitrogen in your blood that comes from the waste product urea, produced when your liver breaks down protein.",
    whyItMatters: "Elevations can happen with dehydration, high-protein intake, or changes in kidney filtration efficiency.",
    doctorQuestions: [
      "Is my BUN level mainly reflecting my hydration status?",
      "How does this result compare with my creatinine?"
    ],
    minPlausible: 1.0,
    maxPlausible: 200.0,
    expectedUnits: ["mg/dL", "mmol/L"]
  },
  egfr: {
    displayName: "eGFR (Kidney Filtration Rate)",
    category: "Kidney Function",
    whatItIs: "Estimated Glomerular Filtration Rate estimates how many milliliters of blood your kidneys clean every minute based on your blood creatinine.",
    whyItMatters: "A score of 90 or higher is generally normal. Scores below 60 that persist over months indicate kidney function changes.",
    doctorQuestions: [
      "Does this calculated filtration rate indicate any early kidney changes?",
      "Are there blood pressure or medication recommendations to protect my kidneys?"
    ],
    minPlausible: 2.0,
    maxPlausible: 200.0,
    expectedUnits: ["mL/min", "mL/min/1.73 m2", "mL/min/1.73m2"]
  },
  "total cholesterol": {
    displayName: "Total Cholesterol",
    category: "Lipid Panel",
    whatItIs: "Total cholesterol is the total amount of cholesterol found in your blood, including LDL, HDL, and other lipid fractions.",
    whyItMatters: "Keeping total cholesterol in a desirable range helps maintain healthy arteries and supports long-term cardiovascular health.",
    doctorQuestions: [
      "What do my specific HDL and LDL breakdowns indicate about my heart health?",
      "Would lifestyle, dietary adjustments, or medications be beneficial right now?"
    ],
    minPlausible: 50.0,
    maxPlausible: 800.0,
    expectedUnits: ["mg/dL", "mmol/L"]
  },
  "hdl cholesterol": {
    displayName: "HDL Cholesterol ('Good' Cholesterol)",
    category: "Lipid Panel",
    whatItIs: "High-density lipoprotein (HDL) absorbs cholesterol in the blood and carries it back to the liver, which flushes it from the body.",
    whyItMatters: "Higher levels of HDL (often above 50 or 60 mg/dL) are generally considered protective for heart health.",
    doctorQuestions: [
      "What aerobic exercises or healthy fats can help optimize my HDL level?",
      "How does my HDL to total cholesterol ratio look?"
    ],
    minPlausible: 10.0,
    maxPlausible: 180.0,
    expectedUnits: ["mg/dL", "mmol/L"]
  },
  "ldl cholesterol": {
    displayName: "LDL Cholesterol ('Bad' Cholesterol)",
    category: "Lipid Panel",
    whatItIs: "Low-density lipoprotein (LDL) transports cholesterol to tissues. When elevated, it can contribute to plaque buildup in artery walls.",
    whyItMatters: "Lowering LDL helps reduce the long-term risk of cardiovascular disease, heart attacks, and strokes.",
    doctorQuestions: [
      "What is my personal target LDL goal based on my overall cardiovascular risk?",
      "What specific dietary adjustments (such as soluble fiber or saturated fat reduction) do you recommend?"
    ],
    minPlausible: 15.0,
    maxPlausible: 600.0,
    expectedUnits: ["mg/dL", "mmol/L"]
  },
  triglycerides: {
    displayName: "Triglycerides",
    category: "Lipid Panel",
    whatItIs: "Triglycerides are the most common type of fat in your body, formed from calories you eat that your body doesn't need right away.",
    whyItMatters: "High levels are frequently linked to high dietary sugars, refined carbohydrates, alcohol intake, or metabolic syndrome.",
    doctorQuestions: [
      "Could recent meals or fasting duration have influenced this triglyceride number?",
      "What lifestyle changes are most effective for lowering triglycerides?"
    ],
    minPlausible: 15.0,
    maxPlausible: 2500.0,
    expectedUnits: ["mg/dL", "mmol/L"]
  },
  tsh: {
    displayName: "TSH (Thyroid Stimulating Hormone)",
    category: "Thyroid Function",
    whatItIs: "TSH is produced by the pituitary gland to tell your thyroid how much thyroid hormone to make.",
    whyItMatters: "Elevated TSH often signals an underactive thyroid (hypothyroidism, which can cause fatigue or feeling cold). Low TSH can signal an overactive thyroid (hyperthyroidism).",
    doctorQuestions: [
      "Does this TSH level explain symptoms like fatigue, weight changes, or temperature sensitivity?",
      "Should we check Free T4 or thyroid antibody levels to confirm?"
    ],
    minPlausible: 0.01,
    maxPlausible: 150.0,
    expectedUnits: ["mIU/L", "uIU/mL", "μIU/mL"]
  },
  alt: {
    displayName: "ALT (Alanine Aminotransferase)",
    category: "Liver Function",
    whatItIs: "ALT is an enzyme found mostly in liver cells. When liver cells are stressed or injured, ALT leaks into the bloodstream.",
    whyItMatters: "Mild elevations are common with medications, supplements, or fatty liver changes. Substantial elevations indicate active liver stress.",
    doctorQuestions: [
      "Could any medications, over-the-counter pain relievers, or supplements be stressing my liver?",
      "Should we repeat this test in a few weeks to see if it normalizes?"
    ],
    minPlausible: 2.0,
    maxPlausible: 3000.0,
    expectedUnits: ["U/L", "IU/L"]
  },
  ast: {
    displayName: "AST (Aspartate Aminotransferase)",
    category: "Liver & Muscle Function",
    whatItIs: "AST is an enzyme found in your liver, heart, and muscle tissue that helps metabolize amino acids.",
    whyItMatters: "Often evaluated together with ALT to determine whether elevations originate from liver tissue or muscle breakdown.",
    doctorQuestions: [
      "How does my AST compare with my ALT level?",
      "Could strenuous physical exercise have contributed to this number?"
    ],
    minPlausible: 2.0,
    maxPlausible: 3000.0,
    expectedUnits: ["U/L", "IU/L"]
  },
  "total bilirubin": {
    displayName: "Total Bilirubin",
    category: "Liver Function",
    whatItIs: "Bilirubin is a yellowish substance made during your body's normal process of breaking down old red blood cells.",
    whyItMatters: "Your liver processes bilirubin so it can be excreted. Higher levels can indicate bile duct blockage, liver stress, or increased red cell breakdown.",
    doctorQuestions: [
      "Are there any signs of bile duct or gallbladder issues related to this result?",
      "Do I need any imaging tests such as an ultrasound?"
    ],
    minPlausible: 0.05,
    maxPlausible: 40.0,
    expectedUnits: ["mg/dL", "μmol/L", "umol/L"]
  },
  ferritin: {
    displayName: "Serum Ferritin",
    category: "Iron Stores & Metabolism",
    whatItIs: "Ferritin is a blood protein that stores iron inside your cells, providing a direct window into your total body iron reserves.",
    whyItMatters: "Low ferritin indicates depleted iron stores (even before hemoglobin drops), which can cause fatigue, weakness, or exercise intolerance. Elevated levels can reflect inflammation or iron overload.",
    doctorQuestions: [
      "Could my ferritin level explain symptoms like fatigue, hair shedding, or low stamina?",
      "Do you recommend oral iron supplementation, vitamin C co-factor, or specific dietary iron sources?",
      "When should we re-test my ferritin and iron panel to monitor progress?"
    ],
    minPlausible: 1.0,
    maxPlausible: 5000.0,
    expectedUnits: ["ng/mL", "μg/L", "ug/L"]
  },
  "vitamin d": {
    displayName: "Vitamin D (25-Hydroxy)",
    category: "Bone & Immune Health",
    whatItIs: "25-hydroxy vitamin D is the main circulating form of vitamin D, which regulates calcium absorption, bone strength, and immune function.",
    whyItMatters: "Levels below 30 ng/mL represent insufficiency or deficiency, common with limited sunlight or low dietary intake, and can contribute to bone loss or fatigue.",
    doctorQuestions: [
      "What daily or weekly IU dosage of Vitamin D3 is best suited for my current level?",
      "Should I take vitamin D with a meal containing healthy fats for better absorption?",
      "In how many weeks should we repeat testing to confirm my levels have reached the optimal 40–60 ng/mL range?"
    ],
    minPlausible: 2.0,
    maxPlausible: 250.0,
    expectedUnits: ["ng/mL", "nmol/L"]
  },
  vitamind: {
    displayName: "Vitamin D (25-Hydroxy)",
    category: "Bone & Immune Health",
    whatItIs: "25-hydroxy vitamin D is the main circulating form of vitamin D, which regulates calcium absorption, bone strength, and immune function.",
    whyItMatters: "Levels below 30 ng/mL represent insufficiency or deficiency.",
    doctorQuestions: [
      "What daily or weekly IU dosage of Vitamin D3 is recommended for my current level?",
      "When should we re-test my vitamin D level to check for improvement?"
    ],
    minPlausible: 2.0,
    maxPlausible: 250.0,
    expectedUnits: ["ng/mL", "nmol/L"]
  },
  hdl: {
    displayName: "HDL Cholesterol",
    category: "Lipid Panel",
    whatItIs: "High-density lipoprotein (HDL) absorbs cholesterol in the blood and carries it back to the liver for clearance.",
    whyItMatters: "Higher levels of HDL are cardioprotective, helping clear excess lipids from arterial walls.",
    doctorQuestions: [
      "What aerobic exercises or dietary healthy fats can help maintain or optimize my HDL?",
      "How does my HDL level look in relation to my total cholesterol and triglycerides?"
    ],
    minPlausible: 10.0,
    maxPlausible: 180.0,
    expectedUnits: ["mg/dL", "mmol/L"]
  },
  ldl: {
    displayName: "LDL Cholesterol",
    category: "Lipid Panel",
    whatItIs: "Low-density lipoprotein (LDL) transports cholesterol throughout the body; elevated levels can contribute to arterial plaque.",
    whyItMatters: "Maintaining optimal LDL is key for cardiovascular risk reduction.",
    doctorQuestions: [
      "What is my personal target LDL goal based on my age and cardiovascular risk factors?",
      "What dietary adjustments (such as soluble fiber or saturated fat reduction) are recommended?"
    ],
    minPlausible: 15.0,
    maxPlausible: 600.0,
    expectedUnits: ["mg/dL", "mmol/L"]
  }
};

/**
 * Validates whether an extracted lab result value is biologically plausible or likely truncated/malformed.
 * e.g., Hemoglobin = 1, HbA1c = 1, Platelets = 1 are biological outliers that must be flagged for verification.
 */
export function checkBiologicalPlausibility(testName, value, unit) {
  const guide = MEDICAL_TEST_GUIDES[testName?.toLowerCase()];
  if (!guide) {
    return { isPlausible: true, warning: null };
  }

  // Check absolute minimum threshold
  if (guide.minPlausible !== undefined && value < guide.minPlausible) {
    // Specifically handle units that scale differently (e.g., WBC in 10^3 vs raw cells)
    if (testName === "wbc" && value >= 1.0 && value <= 50.0) {
      // Could be 10^3/uL notation
      return { isPlausible: true, warning: null };
    }
    return {
      isPlausible: false,
      warning: `This value (${value} ${unit || ""}) is unusually low or truncated in extraction. Please confirm this reading with your original paper report.`
    };
  }

  // Check extreme upper threshold
  if (guide.maxPlausible !== undefined && value > guide.maxPlausible) {
    return {
      isPlausible: false,
      warning: `This value (${value} ${unit || ""}) appears unexpectedly high. Please verify against your original report.`
    };
  }

  return { isPlausible: true, warning: null };
}

/**
 * Maps raw backend status and plausibility into patient-friendly badge details.
 */
export function getPatientFriendlyStatus(item) {
  const plausibility = checkBiologicalPlausibility(item.test_name, item.observed_value, item.unit);

  if (!plausibility.isPlausible) {
    return {
      code: "needs_verification",
      label: "Needs verification",
      icon: "⚠️",
      badgeClass: "badge-verify",
      description: "Extracted value requires checking against paper report",
      plausibilityWarning: plausibility.warning
    };
  }

  if (item.status === "within_reported_range") {
    return {
      code: "within_range",
      label: "Within lab range",
      icon: "✓",
      badgeClass: "badge-normal",
      description: "Result matches the stated lab reference range",
      plausibilityWarning: null
    };
  }

  if (item.status === "above_reported_range") {
    return {
      code: "outside_range",
      label: "Above lab range",
      icon: "▲",
      badgeClass: "badge-outside",
      description: "Result is higher than the lab's stated reference interval",
      plausibilityWarning: null
    };
  }

  if (item.status === "below_reported_range") {
    return {
      code: "outside_range",
      label: "Below lab range",
      icon: "▼",
      badgeClass: "badge-outside",
      description: "Result is lower than the lab's stated reference interval",
      plausibilityWarning: null
    };
  }

  return {
    code: "range_unavailable",
    label: "Reference range unavailable",
    icon: "ℹ",
    badgeClass: "badge-neutral",
    description: "No stated reference interval found on this report line",
    plausibilityWarning: null
  };
}
