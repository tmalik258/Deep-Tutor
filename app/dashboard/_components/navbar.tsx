import NavbarRoutes from "@/components/navbar-routes";
import MobileSidebar from "./mobile-sidebar";

const Navbar = () => {
	return (
    <div className="p-4 h-full flex items-center justify-between">
      <MobileSidebar />
      <NavbarRoutes />
    </div>
  );
};

export default Navbar;
