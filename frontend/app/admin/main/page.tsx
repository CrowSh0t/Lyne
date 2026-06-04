'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function MainPage() {

    return (
        <div className='pt-[80px]'>
            <div>
                <h3>Your stats</h3>
                <Image src={'/images/admin/MounthStats.png'} alt='stats' width={916} height={206}/>
            </div>
        </div>
    );
}