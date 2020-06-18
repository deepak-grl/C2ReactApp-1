import React from 'react'
import { Form, Table } from 'react-bootstrap';
import FlexView from 'react-flexview/lib';
import { ClipLoader } from 'react-spinners';

import { basemodal } from '../../modals/BaseModal';


class Report extends React.Component{
    constructor(props){
        super(props);
        this.myRef=React.createRef()
        this.state = {
            loading: false,
            downloadBtnDisplay: 'inline'
        }
    }
        
    reportDone() {
        this.setState({
            loading: false,
            downloadBtnDisplay: 'inline'
        })
    }
   
   
    render(){
        return (
            
            <FlexView className="panel-setWidth" column>
                <p className="panelHeading">Report Generation</p>
                <FlexView column>
                    <Table striped bordered hover>
                        <tbody>
                       <tr>
                           <td colSpan="2" className="panelHeading">DUT Information</td>
                        </tr>
                        <tr>
                                <td className="panellabel">Manufacturer</td>
                                <td className="report-inputs"><Form.Control className="panelcontrol textbox" type="text" placeholder="" /></td>
                        </tr>
                        <tr>
                                <td className="panellabel">Model Number</td>
                                <td className="report-inputs"><Form.Control className="panelcontrol textbox" type="text" placeholder="" /></td>
                        </tr>
                        <tr>
                                <td className="panellabel">Serial Number</td>
                                <td className="report-inputs"><Form.Control className="panelcontrol textbox" type="text" placeholder="" /></td>
                        </tr>
                        <tr >
                            <td colSpan="2" className="panelHeading">Test Information</td>
                        </tr>
                        <tr>
                                <td className="panellabel">Test Lab</td>
                                <td className="report-inputs"><Form.Control className="panelcontrol textbox" type="text" placeholder="" /></td>
                        </tr>
                        <tr>
                                <td className="panellabel" >Test Engineer</td>
                                <td className="report-inputs" ><Form.Control className="panelcontrol textbox" type="text" placeholder="" /></td>
                        </tr>
                        <tr>
                                <td className="panellabel">Remarks/Comments</td>
                                <td className="report-inputs"><Form.Control className="panelcontrol textbox" type="text" placeholder="" /></td>
                        </tr>
                        </tbody>
                    </Table>
                </FlexView>
            </FlexView>
        )
    }
}

export default Report;