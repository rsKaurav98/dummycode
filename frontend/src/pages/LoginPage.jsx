import AuthForm from "../components/AuthForm";

export default function LoginPage() {
  return (
    <AuthForm
      mode="login"
      eyebrow="Existing User"
      title="Login to Dummycode"
      subtitle="Enter the email and password you used when creating your account."
      submitLabel="Login"
      alternateLabel="Need an account?"
      alternatePath="/signup"
      alternateActionLabel="Sign up"
    />
  );
}
