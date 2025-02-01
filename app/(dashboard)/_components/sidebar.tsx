import Logo from "./logo";
import SidebarRoutes from "./sidebar-routes";

const SideBar = () => {
	return (
		<div className="h-full flex flex-col overflow-y-auto shadow-sm">
			<div className="p-6">
				<Logo />
			</div>
			<div className="flex flex-col w-full">
				<SidebarRoutes />
			</div>
		</div>
	);
};

export default SideBar;
