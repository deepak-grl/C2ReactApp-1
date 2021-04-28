import React from 'react'
import { Form, Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import FlexView from 'react-flexview/lib';
import { observer } from 'mobx-react';
import { mainstore } from '../../ViewModel/BaseModal';
import { REPORT_FOLDER_PATH_SUCCESS } from '../../Constants/tooltip';

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

        handleOnReportFolderPathTextChange = (event) => {
            mainstore.reportUserInputs.reportFolderPath = event.target.value
        }

        render() {
            let imageName = "fail";
            if (mainstore.reportPathStatus.status)
                imageName = "pass"
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
                                    <td className="panel-input"><Form.Control className="panelcontrol textbox" id="tcReportManufacturerInputField" type="text" value={mainstore.reportUserInputs.manufacturer} onChange={this.handleOnManufacturerTextChange} /></td>
                                </tr>
                                <tr>
                                    <td className="panellabel">Model Number</td>
                                    <td className="panel-input"><Form.Control className="panelcontrol textbox" id="tcReportModelNumberInputField" type="text" value={mainstore.reportUserInputs.modelNumber} onChange={this.handleOnModelNumberTextChange} /></td>
                                </tr>
                                <tr>
                                    <td className="panellabel">Serial Number</td>
                                    <td className="panel-input"><Form.Control className="panelcontrol textbox" id="tcReportSerialNumberInputField" type="text" value={mainstore.reportUserInputs.serialNumber} onChange={this.handleOnSerialNumberTextChange} /></td>
                                </tr>
                                <tr >
                                    <td colSpan="2" className="panelHeading">Test Information</td>
                                </tr>
                                <tr>
                                    <td className="panellabel">Test Lab</td>
                                    <td className="panel-input"><Form.Control className="panelcontrol textbox" id="tcReportTestLabInputField" type="text" value={mainstore.reportUserInputs.testLab} onChange={this.handleOnTestLabTextChange} /></td>
                                </tr>
                                <tr>
                                    <td className="panellabel" >Test Engineer</td>
                                    <td className="panel-input"><Form.Control className="panelcontrol textbox" id="tcReportTestEngineerInputField" type="text" value={mainstore.reportUserInputs.testEngineer} onChange={this.handleOnTestEngineerTextChange} /></td>
                                </tr>
                                <tr>
                                    <td className="panellabel">Remarks/Comments</td>
                                    <td className="panel-input"><Form.Control className="panelcontrol textbox" id="tcReportRemarksInputField" type="text" value={mainstore.reportUserInputs.remarks} onChange={this.handleOnRemarkTextChange} /></td>
                                </tr>
                                <tr>
                                    <td className="panellabel">Report Folder Path</td>
                                    <td className="panel-input report-folder-path-td"><Form.Control className="panelcontrol textbox" id="tcReportFolderPathInputField" type="text" value={mainstore.reportUserInputs.reportFolderPath} onChange={this.handleOnReportFolderPathTextChange} />
                                        <OverlayTrigger placement="bottom" overlay={<Tooltip className="car-charger-tooltip-inner-content-align">{mainstore.reportPathStatus.status ? (REPORT_FOLDER_PATH_SUCCESS + mainstore.reportUserInputs.reportFolderPath) : mainstore.reportPathStatus.desc}</Tooltip>}>
                                            <img src={"../../images/" + imageName + ".png"} alt="info-irdrop" className="usb-device-url-img info-img-irdrop" />
                                        </OverlayTrigger>
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </FlexView>
                </FlexView>
            )
        }
    })

export default Report;