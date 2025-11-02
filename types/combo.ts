export interface Combo {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  category: string;
  available: boolean;
  created_at: string;
  updated_at: string;
}

export interface ComboFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  image?: File | null;
}
