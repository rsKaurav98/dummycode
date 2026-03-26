import AuthForm from "../components/AuthForm";

export default function SignupPage() {
  return (
    <AuthForm
      mode="signup"
      eyebrow="New User"
      title="Create your account"
      subtitle="Sign up with your email address and a password to store your account in MongoDB Atlas."
      submitLabel="Create account"
      alternateLabel="Already registered?"
      alternatePath="/login"
      alternateActionLabel="Login"
    />
  );
}
