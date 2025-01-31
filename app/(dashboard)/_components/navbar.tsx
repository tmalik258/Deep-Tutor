import NavbarRoutes from "@/components/navbar-routes";
import MobileSidebar from "./mobile-sidebar";

const Navbar = () => {
	return (
		<div className="p-4 border-b h-full flex items-center justify-between bg-blue-500 z-50">
			<MobileSidebar />
			<NavbarRoutes />
		</div>
	);
};

export default Navbar;
