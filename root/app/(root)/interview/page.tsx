import React from 'react'
import Agent from '@/components/Agent'
const Page = () => {
    return(
        <> 
            <h3>Interview Agent</h3>

            <Agent userName="You" userId="1" type="generate" />
        </>
    )
}

export default Page