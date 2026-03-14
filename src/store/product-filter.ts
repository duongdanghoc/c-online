import { SearchAggregations } from "@/app/api/search";
import { create } from "zustand";

export const priceFilterOptions = [
  {
    title: "Dưới 100.000đ",
    max: 100000,
  },
  {
    title: "Từ 100.000đ - 200.000đ",
    min: 100000,
    max: 200000,
  },
  {
    title: "Từ 200.000đ - 500.000đ",
    min: 200000,
    max: 500000,
  },
  {
    title: "Trên 500.000đ",
    min: 500000,
  },
];

export const sortTypes = [
  {
    title: "Mặc định",
    value: undefined,
  },
  {
    title: "Giá thấp",
    value: 1,
  },
  {
    title: "Giá cao",
    value: 2,
  },
];

type ProductFilterStore = {
  brands?: string[];
  setBrands: (brands: string[]) => void;
  removeBrand: (brand: string) => void;
  indications?: string[];
  setIndications: (indications: string[]) => void;
  removeIndication: (indication: string) => void;
  aggregations?: SearchAggregations;
  setAggregations: (aggregations?: SearchAggregations) => void;
  priceFilter?: {
    title: string;
    min?: number;
    max?: number;
  };
  priceFilterOptions: {
    title: string;
    min?: number;
    max?: number;
  }[];
  setPriceFilter: (text: string) => void;
  sortType?: number;
  setSortType: (sortType?: number) => void;
};

export const useProductFilterStore = create<ProductFilterStore>((set) => ({
  priceFilterOptions,
  setBrands: (brands) => set({ brands }),
  setIndications: (indications) => set({ indications }),
  setAggregations: (aggregations) => set({ aggregations }),
  setPriceFilter: (text) =>
    set({
      priceFilter: priceFilterOptions.find((option) => option.title === text),
    }),
  setSortType: (sortType) => set({ sortType }),
  sortType: undefined,
  removeBrand: (brand) =>
    set((state) => ({
      brands: state.brands?.filter((b) => b !== brand),
    })),
  removeIndication: (indication) =>
    set((state) => ({
      indications: state.indications?.filter((i) => i !== indication),
    })),
}));
