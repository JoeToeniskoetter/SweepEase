interface Profile {
  id: string;
  email: string;
  role: "USER" | "ADMIN" | "CREATOR";
  createdAt: string;
  updatedAt: string;
  company: Company | null;
  firstLogin: boolean;
}

interface SweepInspectrUser {
  id: string;
  email: string;
  role: keyof UserRole;
  createdAt: string;
  updatedAt: string;
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
  signaturesRequired: boolean;
  items: [];
  canEdit: boolean;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

interface CreateInspectionOrderInput {
  customerName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  templateId: string;
}

interface InspectionOrder {
  id: string;
  status: string;
  customerName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
  template?: InspectionOrderTemplate;
  signatures?: InspectionSignature[];
}

interface InspectionOrderTemplate {
  id: string;
  name: string;
  inspectionLevel: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  items?: InspectionItem[];
  signaturesRequired: boolean;
}

interface InspectionTemplateOption {
  id: string;
  name: string;
  inspectionLevel: string;
}

interface InspectionItem {
  id: string;
  name: string;
  options: Option[];
}

interface Option {
  id: string;
  name: string;
  description: string;
}
interface InspectionDetail {
  id: string;
  item: string;
  options: InspectionDetailOption[];
  condition: { name: string; description: string } | null;
  notes: string;
  photoUrl: string;
  isComplete: boolean;
  createdAt: string;
  updatedAt: string;
}
interface InspectionDetailOption {
  name: string;
  description: string;
}

interface InspectionSignature {
  id: string;
  type: string;
  imageUrl: string;
}

interface Page<T> {
  data: T[];
  meta: PageMeta;
}

interface PageMeta {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  sortBy: Array<string[]>;
}

interface UserInvite {
  id: string;
  userEmail: string;
  company: Company;
  createdAt: string;
}
