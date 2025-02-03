import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import SideBar from "./sidebar";

const MobileSidebar = () => {
	return (
		<Sheet>
			<SheetTrigger className="md:hidden hover:opacity-75 transition">
				<Menu />
			</SheetTrigger>
			<SheetContent side={"left"} className="p-0">
				<SideBar />
			</SheetContent>
		</Sheet>
	);
};

export default MobileSidebar;
