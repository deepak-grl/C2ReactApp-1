import React from 'react'
import FlexView from 'react-flexview/lib';
import { Table, Form, Button, Modal } from 'react-bootstrap';
import { basemodal, mainstore } from '../../ViewModel/BaseModal';
import { observer } from 'mobx-react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { RP_REFRESH, RP_SAVE_REPORT, RP_SAVE_REPORT_DATA, RP_DELETE_REPORT, RP_SETTINGS, RP_DATA_SIZE } from '../../Constants/tooltip';
import SaveFileModal from './SaveFileModal';
import { DOWNLOAD_DUT_REPORT, DOWNLOAD_HTML_REPORT, REPORT_DATA_MGMT_BTN, REFRESH_REPORT_BTN, DELETE_REPORT, DOWNLOAD_REPORT } from '../../Constants/uilabels';

const ResultManager = observer(
    class ResultManager extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                testRunList: '',
                totalDataSize: 0,
            };

        }

        toggleTestArtifacts = () => {
            mainstore.displayResultsManager = !mainstore.displayResultsManager
            if (mainstore.displayResultsManager)
                basemodal.getResultsFolderList(this.loadListOfTestRuns.bind(this));

        }

        deleteTestResults = (index) => {
            basemodal.deleteTestResult(index, this.loadListOfTestRuns.bind(this))
        }

        downloadTestResults = (index) => {
            basemodal.downloadResults(index)
        }

        deleteAllTestResults = (event) => {
            basemodal.deleteAllTestResult(this.loadListOfTestRuns.bind(this))
        }

        refreshReports = (event) => {
            mainstore.currentReportFileName = "";
            basemodal.getCurrentReportFileName();
            return mainstore.currentReportFileName;
        }

        showReportFile() {
            basemodal.showPopUp('FileName', null, 'Download File', mainstore.reportFolderName + ".html", true, "OKCancel", null, this.downloadHtmlReport.bind(this))
        }

        showReportZipFile() {
            basemodal.showPopUp('FileName', null, 'Download File', mainstore.reportFolderName + ".zip", true, "OKCancel", null, this.downloadZipReport.bind(this))
        }

        downloadZipReport() {
            if (mainstore.popUpInputs.responseButton === "Ok")
                basemodal.generateReport(null);
        }

        downloadHtmlReport() {
            if (mainstore.popUpInputs.responseButton === "Ok")
                basemodal.getCurrentReportFile(null);
        }

        loadListOfTestRuns() {
            let totalSize = 0
            this.setState({
                testRunList: (
                    <Table className="results-manager" striped bordered hover>
                        <tbody>
                            <tr>
                                <th>Run No.</th>
                                <th>Folder Name</th>
                                <th>Size</th>
                                <th>Delete</th>
                                <th>Download</th>
                            </tr>
                            {mainstore.reportInputs.testRunInfo.map((runInfo, index) => {
                                totalSize += runInfo['folderSize']
                                return (<tr key={"rs-tr-" + index}>
                                    <td>#{index + 1}</td>
                                    {/* {(runInfo['resultsFolder'].split('\\').pop().length>50) ?  (<OverlayTrigger placement="right" overlay={<Tooltip>{runInfo['resultsFolder'].split('\\').pop()} </Tooltip>}><td>{runInfo['resultsFolder'].split('\\').pop()}</td></OverlayTrigger>):
                                        (<td>{runInfo['resultsFolder'].split('\\').pop()}</td>))
                                     }*/}
                                    <OverlayTrigger placement="right" overlay={<Tooltip>{runInfo['resultsFolder'].split('\\').pop()} </Tooltip>}><td>{runInfo['resultsFolder'].split('\\').pop()}</td></OverlayTrigger>
                                    <td>{runInfo['folderSize']} MBs</td>
                                    <td><Button id="reportManagementDeleteReportBtn" className="grl-button btn-primary refresh-btn" onClick={() => { this.deleteTestResults(index) }}>{DELETE_REPORT}</Button></td>
                                    <td><Button id="reportManagementDownloadReportBtn" className="grl-button btn-primary refresh-btn" onClick={() => { this.downloadTestResults(index) }}>{DOWNLOAD_REPORT}</Button></td>
                                </tr>)
                            })}
                        </tbody>
                    </Table>),
                totalDataSize: totalSize.toFixed(2)
            })
        }
        componentDidMount() {
            basemodal.getResultsFolderList(this.loadListOfTestRuns.bind(this))
        }

        bodyScrollPrevent(event) {
            event.stopPropagation();
        }

        render() {
            return (
                <>
                    <div className="resultsmanager-toolbar">
                        <div className="toolbar_btn_div"><OverlayTrigger placement="auto" overlay={<Tooltip> {RP_REFRESH} </Tooltip>}><Button id="reportToolbarViewReportBtn" className="grl-button btn-primary refresh-btn" onClick={this.refreshReports}>{REFRESH_REPORT_BTN}</Button></OverlayTrigger></div>
                        <div className="toolbar_btn_div"><OverlayTrigger placement="auto" trigger="hover" overlay={<Tooltip> {RP_SAVE_REPORT} </Tooltip>}><Button id="reportToolbarDownloadCurrentHtmlReportBtn" className="grl-button btn-primary refresh-btn" onClick={this.showReportFile.bind(this)}>{DOWNLOAD_HTML_REPORT}</Button></OverlayTrigger></div>
                        <div className="toolbar_btn_div"><OverlayTrigger placement="auto" trigger="hover" overlay={<Tooltip> {RP_SAVE_REPORT_DATA} </Tooltip>}><Button id="reportToolbarDownloadCurrentDutReportDataBtn" className="grl-button btn-primary refresh-btn" onClick={this.showReportZipFile.bind(this)}>{DOWNLOAD_DUT_REPORT}</Button></OverlayTrigger></div>
                        <div className="toolbar_btn_div"><OverlayTrigger placement="auto" trigger="hover" overlay={<Tooltip> {RP_SETTINGS} </Tooltip>}><Button id="reportToolbarReportDataManagementBtn" className="grl-button btn-primary refresh-btn" onClick={this.toggleTestArtifacts}>{REPORT_DATA_MGMT_BTN}</Button></OverlayTrigger></div>
                        <div className="toolbar_report_location">
                            <p>Test Reports Location</p>
                            <p>C:\GRL\USBPD-C2-Browser-App\Report\TempReport</p>
                        </div>

                    </div>
                    {<FlexView onWheel={(e) => this.bodyScrollPrevent(e)}>
                        <Modal className="resultsManager-modal" size="lg" show={mainstore.displayResultsManager} onHide={this.toggleTestArtifacts}>
                            <Modal.Header closeButton>
                                <OverlayTrigger placement="auto" overlay={<Tooltip> {RP_DELETE_REPORT} </Tooltip>}><Button id="reportManagementDeleteTestReportBtn" className="grl-button btn-primary refresh-btn" onClick={this.deleteAllTestResults}>Delete Test Report</Button></OverlayTrigger>
                                <OverlayTrigger placement="auto" overlay={<Tooltip> {RP_DATA_SIZE} </Tooltip>}><small className="artifacts-fonts">Test results folder size :{this.state.totalDataSize} MBs</small></OverlayTrigger>
                            </Modal.Header>
                            <Modal.Body>
                                <FlexView className="resultsmanager-modalcontainer" >
                                    {this.state.testRunList}
                                </FlexView>
                            </Modal.Body>
                        </Modal>
                    </FlexView>}
                    {/* <SaveFileModal /> */}

                </>
            )
        }
    })
export default ResultManager;