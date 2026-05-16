import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import SignUpForm from "../_components/SignUpForm";

const page = () => {
  return (
    <TabsContent value="signup">
      <Card className="w-100">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>To Join Our Archive</CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default page;
