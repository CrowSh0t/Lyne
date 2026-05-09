import Image from 'next/image';


export default function Home() {
  return (
    <div>
      <Image src={"/images/firstImageForMainPage.png"} alt="preview" fill className="w-full h-[800px]"/>
    </div>
  );
}
