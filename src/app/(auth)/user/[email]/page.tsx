import PageClient from "./PageClient";

export function generateStaticParams() {
  return [
    { email: "monster9999%40gentlemonster.com" },
    { email: "monster%40gentlemonster.com" },
    { email: "admin.user%40gentlemonster.com" },
    { email: "monster9996%40gentlemonster.com" },
    { email: "monster9995%40gentlemonster.com" },
    { email: "monster9994%40gentlemonster.com" },
    { email: "monster9993%40gentlemonster.com" },
    { email: "monster9992%40gentlemonster.com" },
    { email: "monster9991%40gentlemonster.com" },
    { email: "monster9990%40gentlemonster.com" },
  ];
}

export default function Page() {
  return <PageClient />;
}
