import Link from "next/link";

export default function BackElement() {
    return (
        <div className="p-4">
            <Link href={'/admin/main'}>
                <img src={'/images/icons/viewAllBtn.png'} alt={''} className='scale-x-[-1] pt-[36px]' width={47} height={34} />
            </Link>
        </div>
    )
}