export interface Seller {
  id: string;
  name: string;
  slug: string;
  email: string;
  whatsapp: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SellerIdentity {
  id: string;
  name: string;
  slug: string;
  whatsapp: string;
  active: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  role: 'super_admin' | 'seller';
  seller: SellerIdentity | null;
}

export interface SellerFormData {
  name: string;
  email: string;
  password: string;
  whatsapp: string;
  slug?: string;
}
