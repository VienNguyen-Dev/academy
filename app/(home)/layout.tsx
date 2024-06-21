import TopBar from "@/components/layout/TopBar";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <TopBar />
      {children}
    </>
  );
};

export default HomeLayout;
