"use client";

export default function ForbiddenPage() {
  return (
    <div className="bg-background flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center text-center text-[14px]">
        <h1 className="">Forbidden</h1>
        <p className="">403</p>
        <p className="">You don’t have permission to access this resource</p>
      </div>
    </div>
  );
}
