import React, { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const RootLayout = async ({children}: {children: ReactNode}) => {
    return(
        <div className='root-layout' >
            <nav className='flex gap-3' >
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/logo.svg" alt='logo' width={38} height={32} />
                </Link>
                <h2 className='text-primary-100' >MockView</h2>
            </nav>
            {children}
        </div>
    )
}

export default RootLayout