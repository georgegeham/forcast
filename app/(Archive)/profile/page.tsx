import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ProfileForm from "./_components/ProfileForm";
import {
  CurrentUser,
  getCurrentUser,
} from "@/lib/auth/hooks/getCurrentUserInfo";

const page = async () => {
  const user = await getCurrentUser();
  return (
    <Card className="w-full max-sm:my-10">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Manage Your Profile</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <ProfileForm user={user as CurrentUser} />
        </form>
      </CardContent>
    </Card>
  );
};

export default page;
