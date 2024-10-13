import Navbar from "./_components/navbar";
import SideBar from "./_components/sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="h-full">
			<nav className="md:pl-56 h-[50px] bg-white shadow-sm w-full fixed inset-y-0">
				<Navbar />
			</nav>
			<div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
				<SideBar />
			</div>
			<main className="md:pl-56 pt-[50px] h-full">{children}</main>
		</div>
	);
};

export default DashboardLayout;
