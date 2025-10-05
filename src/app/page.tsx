import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-[#1D6BA5] h-screen w-screen">
      <div className="brightness-100 grayscale-100 invert-100 flex flex-col items-center justify-center gap-5 h-full">
        <Image src="/logo.png" alt="Dealighted Logo" width={300} height={300} />
        <div className="text-2xl text-center">
          <p className="font-semibold text-[#1D6BA5]">Our website is coming soon.</p>
          <p className="text-[#1D6BA5]">We are working hard to giving you best experience.</p>
        </div>
      </div>
    </div>
  );
}
