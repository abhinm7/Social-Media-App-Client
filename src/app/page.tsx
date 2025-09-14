import Image from "next/image";

export default function Home() {
  const bro = process.env.NEXT_PUBLIC_API_URL
  return (
    <div>
      hello : {bro}
    </div>
  );
}
