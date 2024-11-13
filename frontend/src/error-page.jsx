import { Link, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-4 text-white">
      <h1 className="text-5xl font-bold">Oops!</h1>
      <p className="font-light">Sorry, an unexpected error has occurred.</p>
      <p>
        <Link
          to="/"
          className="text-sm font-light text-[#C6FF46] underline underline-offset-8"
        >
          Redirect to Home
        </Link>
      </p>
    </div>
  );
}
