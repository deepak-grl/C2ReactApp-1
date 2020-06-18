import React from 'react'
import {Chart} from '../Chart'

class PanelPlot extends  React.Component{
    render(){
        return(
            <div className="panelplot-container">
            <Chart/>
            </div>
        )
    }
}

export default PanelPlot;