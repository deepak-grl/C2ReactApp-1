import React from 'react'
import {Chart} from '../Chart'

class Plot extends  React.Component{
    
    render(){
        return(
            <div className="chart-container">
            <Chart/>
            </div>
        )
    }
}

export default Plot;