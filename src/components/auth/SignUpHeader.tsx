
import { Logo } from "@/components/layout/Logo";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const SignUpHeader = () => {
  return (
    <>
      <div className="text-center mb-8">
        <Logo />
      </div>
      
      <CardHeader>
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>
          Get started with your free account
        </CardDescription>
      </CardHeader>
    </>
  );
};

export default SignUpHeader;
