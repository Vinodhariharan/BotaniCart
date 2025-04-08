function generateLongDescription(product) {
    const baseDescription = product.description;
    let longDescription = `${product.title} delight your senses with `;
    
    switch (product.Type) {
      case "Outdoor Plant":
        longDescription += ` Vibrant foliage and fragrant blooms, perfect for adding beauty and attracting pollinators to your garden.`;
        break;
      case "Indoor Plant":
        longDescription += ` Bring nature indoors with this elegant and low-maintenance option, ideal for purifying the air and adding a touch of zen.`;
        break;
      case "Perennial":
        longDescription += ` Enjoy year after year with these stunning blooms that return season after season, adding lasting color and charm to your landscape.`;
        break;
      case "Spring Bulb":
        longDescription += ` Herald the arrival of spring with these cheerful bursts of color, perfect for brightening up your garden after the winter slumber.`;
        break;
      case "Summer Bulb":
        longDescription += ` Soak up the summer sun with these vibrant blooms, adding drama and elegance to your garden landscape.`;
        break;
      case "Annual":
        longDescription += ` Make a statement with these bold and beautiful blooms that bring a splash of color for a single season.`;
        break;
      default:
        break;
    }
  
    longDescription += ` ${baseDescription}.`;
    return longDescription;
  }
  

export default generateLongDescription;