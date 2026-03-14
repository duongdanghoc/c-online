import React from "react";
import Info from "./info";
import Sidebar from "./sidebar";

const Layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="container mx-auto grid grid-cols-12 gap-4 py-8">
      <div className="col-span-12 row-start-1 h-fit lg:col-span-4 xl:col-span-3">
        <Info />
      </div>
      <div className="col-span-12 row-start-3 lg:col-span-4 lg:row-start-2 xl:col-span-3">
        <Sidebar />
      </div>
      <div className="col-span-12 row-start-2 overflow-hidden lg:col-span-8 lg:row-start-1 lg:row-end-4 xl:col-span-9">
        {children}
      </div>
    </div>
  );
};

export default Layout;
