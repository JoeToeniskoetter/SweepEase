interface Profile {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
  company: Company | null;
}

interface Company {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateCompanyInput {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
}

interface InspectionTemplate {
  id: string;
  name: string;
  inspectionLevel: "Level 1" | "Level 2" | "Level 3";
  items: [];
  createdAt: string;
  updatedAt: string;
}
