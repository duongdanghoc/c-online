import { getCategories } from "@/app/api/category";
import HeaderContent from "./HeaderContent";

const Header = async () => {
  const { data: categories } = await getCategories();

  return <HeaderContent categories={categories ?? []} />;
};

export default Header;
