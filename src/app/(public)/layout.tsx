import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <main className="lg:bg-gray-150 bg-gray-200">{children}</main>
      <Footer withIntroductionBanner={true} />
    </>
  );
};

export default Layout;
