function generateKeyFeatures(plantType) {
    const keyFeaturesMap = {
      "Outdoor Plant": {
        Season: "All Seasons",
        CareLevel: "Moderate",
        Lifespan: "Varies",
      },
      "Spring Bulb": {
        Season: "Spring",
        CareLevel: "Easy",
        Lifespan: "Perennial",
      },
      "Houseplant": {
        Season: "All Seasons",
        CareLevel: "Moderate",
        Lifespan: "Varies",
      },
      "Perennial": {
        Season: "Varies",
        CareLevel: "Easy",
        Lifespan: "Perennial",
      },
      "Summer Bulb": {
        Season: "Summer",
        CareLevel: "Moderate",
        Lifespan: "Perennial",
      },
      "Annual": {
        Season: "One Season",
        CareLevel: "Easy",
        Lifespan: "Annual",
      },
      "Summer Perennial": {
        Season: "Summer",
        CareLevel: "Moderate",
        Lifespan: "Perennial",
      },
    };
  
    return keyFeaturesMap[plantType] || {};
  }

  export default generateKeyFeatures;
  
  // Example usage
//   const plantType = "Tulips";
//   const keyFeatures = generateKeyFeatures(plantType);
//   console.log(`Key features for ${plantType}:`);
//   console.log(keyFeatures);
  