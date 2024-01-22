const ErrorMessage = ({ error }) => {
  return (
    <p className="text-sm text-muted-foreground text-red-500">
      {/* Enter your email address. */}
      {error}
    </p>
  );
};

export default ErrorMessage;
