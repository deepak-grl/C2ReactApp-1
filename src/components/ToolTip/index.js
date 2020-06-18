import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

class ToolTip extends React.Component {
    render(){
        if(!this.props.hideIcon){
            return(
                <OverlayTrigger  placement="right"  overlay={ <Tooltip> {this.props.value} </Tooltip> }>
                    <i className="fa fa-question-circle" aria-hidden="true"></i>
                </OverlayTrigger>
            )
        }else{
            return(
                <OverlayTrigger  placement="right"  overlay={ <Tooltip> {this.props.value} </Tooltip> }>
                    <span></span>
                </OverlayTrigger>
            )
        }
    }
}

export default ToolTip;