export interface BoundingBox {
    // Uri Corresponding to image
    imageID: number;
  
    // Coordinates of Bounding Box
    xMin: number;
    yMin: number;
    xMax: number;
    yMax: number;
  
    // Label of object in Bounding Box
    label: string;
  
    // Message for text to speech feature
    message: string;
  }