export interface Employee {
  id: number;
  name: string;
  avatarUrl: string;
  position: string;
  department: string;
  score: number;
  presentations: number;
  years: number[];
  quarters: number[];
  categories: string[];
}

export interface FilterState {
  year: string;
  quarter: string;
  category: string;
  search: string;
}
