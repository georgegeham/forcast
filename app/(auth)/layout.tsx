import AuthTabs from "./_components/AuthTabs";
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <AuthTabs>{children}</AuthTabs>
    </main>
  );
};

export default Layout;
