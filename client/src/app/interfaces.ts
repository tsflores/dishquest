
// Recipe type for the model schema

export interface Recipe {
  _id: string;
  name: string;
  chef: string;
  description: string;
  meal: string;
  preptime: string;
  cooktime: string;
  image: string;
  recipePDF: string;
  favorites?: boolean | null;
  imageDisplay: string;
  updatedAt?: Date; 
  createdAt: Date | null;
}