function ErrorMessage({ txt }: { txt?: string }) {
  if (!txt) return null;

  return (
    <p className="mt-3 text-sm text-red-600" role="alert">
      {txt}
    </p>
  );
}

export default ErrorMessage;
