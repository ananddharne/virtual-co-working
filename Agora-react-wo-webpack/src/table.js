import React, {} from "react"

const table = (tables) => {
    return (
        <div className="box">
        {  
            tables.map((t, i) => 
            <ul key = {i}>
            <li className='box-row'>
                <span>
                    <h4>table length is</h4>
                </span>
            </li>
            <hr/>
            </ul>
        )
            
            }
        </div> 
    )
}

export default table