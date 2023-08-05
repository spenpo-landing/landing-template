"use client";
import { useRouter } from "next/navigation";
import Landing from "./components/landing";
import { NextPage } from "next";

const Home: NextPage = () => {
  const router = useRouter();
  return (
    <Landing
      title={process.env.NEXT_PUBLIC_TITLE || "not found"}
      name={process.env.NEXT_PUBLIC_NAME || "not found"}
      subtitle={process.env.NEXT_PUBLIC_SUBTITLE || "not found"}
      socialUrls={JSON.parse(process.env.NEXT_PUBLIC_SOCIALS || "[]")}
      headshotSrc={`/${process.env.NEXT_PUBLIC_HEADSHOT}`}
      actionClick={() => router.push(process.env.NEXT_PUBLIC_ACTION || "/")}
      actionText={process.env.NEXT_PUBLIC_ACTION_STATEMENT || "not found"}
    />
  );
};

export default Home;
