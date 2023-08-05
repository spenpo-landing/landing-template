"use client";
import { useRouter } from "next/navigation";
import Landing from "./components/landing";
import { NextPage } from "next";

const Home: NextPage = () => {
  const router = useRouter();
  return (
    <Landing
      title="investor & entrepreneur"
      name={process.env.NEXT_PUBLIC_NAME || "not found"}
      subtitle="Building an unconventional life"
      socialUrls={[
        "https://twitter.com/s_pop3",
        "https://github.com/spope851",
        "mailto:spenpo@spenpo.com",
        "https://www.youtube.com/@spope",
        "https://www.twitch.tv/spenpo",
      ]}
      headshotSrc="/headshot.jpeg"
      actionClick={() => router.push("/demo")}
      actionText="get a landing page like this one"
    />
  );
};

export default Home;
