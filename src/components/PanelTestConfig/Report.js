import React from 'react'
import { Form, Table } from 'react-bootstrap';
import FlexView from 'react-flexview/lib';
import { observer } from 'mobx-react';
import { mainstore } from '../../modals/BaseModal';

const Report = observer(
    class Report extends React.Component {
        constructor(props) {
            super(props);
            this.myRef = React.createRef()
        }

        handleOnManufacturerTextChange = (event) => {
            mainstore.reportUserInputs.manufacturer = event.target.value
        }

        handleOnModelNumberTextChange = (event) => {
            mainstore.reportUserInputs.modelNumber = event.target.value
        }

        handleOnSerialNumberTextChange = (event) => {
            mainstore.reportUserInputs.serialNumber = event.target.value
        }

        handleOnTestLabTextChange = (event) => {
            mainstore.reportUserInputs.testLab = event.target.value
        }

        handleOnTestEngineerTextChange = (event) => {
            mainstore.reportUserInputs.testEngineer = event.target.value
        }

        handleOnRemarkTextChange = (event) => {
            mainstore.reportUserInputs.remarks = event.target.value
        }

        render() {
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
                                    <td className="panel-input"><Form.Control className="panelcontrol textbox" type="text" value={mainstore.reportUserInputs.manufacturer} onChange={this.handleOnManufacturerTextChange} /></td>
                                </tr>
                                <tr>
                                    <td className="panellabel">Model Number</td>
                                    <td className="panel-input"><Form.Control className="panelcontrol textbox" type="text" value={mainstore.reportUserInputs.modelNumber} onChange={this.handleOnModelNumberTextChange} /></td>
                                </tr>
                                <tr>
                                    <td className="panellabel">Serial Number</td>
                                    <td className="panel-input"><Form.Control className="panelcontrol textbox" type="text" value={mainstore.reportUserInputs.serialNumber} onChange={this.handleOnSerialNumberTextChange} /></td>
                                </tr>
                                <tr >
                                    <td colSpan="2" className="panelHeading">Test Information</td>
                                </tr>
                                <tr>
                                    <td className="panellabel">Test Lab</td>
                                    <td className="panel-input"><Form.Control className="panelcontrol textbox" type="text" value={mainstore.reportUserInputs.testLab} onChange={this.handleOnTestLabTextChange} /></td>
                                </tr>
                                <tr>
                                    <td className="panellabel" >Test Engineer</td>
                                    <td className="panel-input"><Form.Control className="panelcontrol textbox" type="text" value={mainstore.reportUserInputs.testEngineer} onChange={this.handleOnTestEngineerTextChange} /></td>
                                </tr>
                                <tr>
                                    <td className="panellabel">Remarks/Comments</td>
                                    <td className="panel-input"><Form.Control className="panelcontrol textbox" type="text" value={mainstore.reportUserInputs.remarks} onChange={this.handleOnRemarkTextChange} /></td>
                                </tr>
                            </tbody>
                        </Table>
                    </FlexView>
                </FlexView>
            )
        }
    })

export default Report;