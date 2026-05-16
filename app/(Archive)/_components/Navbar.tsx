import UserAvatar from "./UserAvatar";
import { getCurrentUser } from "@/lib/auth/hooks/getCurrentUserInfo";
import Logo from "./Logo";
const Navbar = async () => {
  const user = await getCurrentUser();

  return (
    <div className="h-nav w-full">
      <nav className="container max-sm:px-4 mx-auto flex h-full items-center justify-between overflow-hidden">
        <div className="flex items-center justify-center relative h-14 w-14 cursor-pointer hover:opacity-40">
          <Logo />
        </div>
        <div className="flex items-center gap-4">
          <UserAvatar user={user || null} />
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
