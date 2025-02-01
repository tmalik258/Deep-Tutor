import Navbar from "./_components/navbar";
import SideBar from "./_components/sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
	return (
    <div className="bg-gradient-to-r from-violet-200 to-white min-h-screen">
      <nav className="h-[50px] left-[16.5rem] rounded-xl shadow-xl fixed top-5 right-5 bg-white inset-y-0 inset-x-16 z-50">
        <Navbar />
      </nav>
      <div className="hidden md:flex w-56 flex-col fixed inset-y-5 rounded-xl left-5 bg-white shadow-xl z-50">
        <SideBar />
      </div>
      <main className="md:pl-[16.5rem] pr-5 pt-[100px] h-full">{children}</main>
    </div>
  );
};

export default DashboardLayout;
