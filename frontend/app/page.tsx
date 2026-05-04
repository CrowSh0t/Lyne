import Image from "next/image";
import Link from "next/link";


export default function Home() {
  return (
    <div>
      <div className="flex fixed top-0 left-0 w-full flex-1">

        <div className="flex-2 flex items-center justify-center">
          <h1 className="justify-center">LYNE</h1>
        </div>

        <div className="flex items-center justify-end">
          <Link href="/mainPage" className="p-4">
            <Image src="/images/searchIcon.png" alt="icon" width={33} height={33} />
          </Link>
          <Link href="/accountPage" className="p-4">
            <Image src="/images/usersIcon.png" alt="icon" width={29} height={29} />
          </Link>
          <Link href="/favoritePage" className="p-4">
            <Image src="/images/favoriteIcon.png" alt="icon" width={36} height={36} />
          </Link>
          <Link href="/cartPage" className="p-4">
            <Image src="/images/cartIcon.png" alt="icon" width={36} height={36} />
          </Link>
        </div>

      </div>
    </div>
  );
}
