"use client";

import Image from "next/image";
import ellipse1 from "../../public/ellipse-1.svg";
import ellipse2 from "../../public/ellipse-2.svg";

export default function Home() {
  return (
    <main className="max-w-[360px] min-h-[560px] overflow-hidden mx-auto my-8 relative border">
      <div className="absolute -right-[80px] top-[-40px]  overflow-hidden w-[400px] h-[400px]">
        <Image src={ellipse1} alt="ellipse" fill={true} />
      </div>
      <div className="absolute -left-[80px] top-[120px]  overflow-hidden w-[400px] h-[400px]">
        <Image src={ellipse2} alt="ellipse" fill={true} />
      </div>
      <div className="absolute -right-[80px] top-[280px]  overflow-hidden w-[400px] h-[400px]">
        <Image src={ellipse1} alt="ellipse" fill={true} />
      </div>

      <section className="absolute top-0 w-full h-full">
        <nav className="p-4 bg-white absolute z-[6] top-0 w-full shadow-lg">
          navbar
        </nav>
        <div></div>
        <div className="bg-white p-3 shadow-md w-[340px] mx-auto absolute bottom-0 border z-[5]">
          test
        </div>
      </section>
    </main>
  );
}
