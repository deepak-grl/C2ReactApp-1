// import React from 'react'
// import FlexView from 'react-flexview/lib';
// import { Form, Button, Modal } from 'react-bootstrap';
// import { basemodal, mainstore } from '../../ViewModel/BaseModal';
// import { observer } from 'mobx-react';
// import { mouseBusy } from '../../utils';
// const SaveFileModal = observer(
//     class SaveFileModal extends React.Component {

//         saveAllTestResults = (event) => {
//             basemodal.generateReport(null)
//         }

//         saveHtmlReportFile = (event) => {
//             basemodal.getCurrentReportFile(null);
//         }

//         handleClose() {
//             mainstore.reportInputs.showReportDataModal = !mainstore.reportInputs.showReportDataModal;
//         }

//         handleRenameReportDataFile(event) {
//             mainstore.reportInputs.testReportData = event.target.value;

//         }

//         closeReportFile() {
//             mainstore.popUpInputs.showHtmlFileReport = !mainstore.popUpInputs.showHtmlFileReport;
//         }

//         renameReportFile(event) {

//             mainstore.reportInputs.testReportFileName = event.target.value;

//         }


//         render() {
//             return (
//                 <>

//                     {/* Save modals*/}

//                     <Modal show={mainstore.popUpInputs.displayPopUp} onHide={this.handleClose.bind(this)} size="md"
//                         aria-labelledby="contained-modal-title-vcenter"
//                         centered>
//                         <Modal.Header closeButton>
//                             <Modal.Title>Download Report</Modal.Title>
//                         </Modal.Header>
//                         <Modal.Body>
//                                 <div className="form-group">
//                                     <label className="col-sm-8 control-label"><strong>Please Enter the Report Name</strong></label>
//                                     <div className="col-sm-10">
//                                         <input type="text" className="form-control"
//                                             id="save" value={mainstore.reportInputs.testReportData} onChange={(e) => this.handleRenameReportDataFile(e)} required />
//                                     </div>
//                                 </div>
//                         </Modal.Body>
//                         <Modal.Footer className="modal-footer">
//                             <Button className="grl-button-blue" onClick={e => { this.saveAllTestResults(); this.handleClose.call(this, e); }}>
//                                 Download
//                             </Button>
//                         </Modal.Footer>
//                     </Modal>



//                     <Modal show={mainstore.popUpInputs.displayPopUp} onHide={this.closeReportFile.bind(this)} size="md"
//                         aria-labelledby="contained-modal-title-vcenter"
//                         centered>
//                         <Modal.Header closeButton>
//                             <Modal.Title>Download Report File</Modal.Title>
//                         </Modal.Header>
//                         <Modal.Body>
//                                 <div className="form-group">
//                                     <label className="col-sm-8 control-label"><strong>Please Enter the Report File Name</strong></label>
//                                     <div className="col-sm-10">
//                                         <input type="text" className="form-control"
//                                             id="save" value={mainstore.reportInputs.testReportFileName} onChange={(e) => this.renameReportFile(e)} required />
//                                     </div>
//                                 </div>
//                         </Modal.Body>
//                         <Modal.Footer className="modal-footer">
//                             <Button className="grl-button-blue" onClick={e => { this.saveHtmlReportFile(); this.closeReportFile.call(this, e); }}>
//                                 Download
//                             </Button>
//                         </Modal.Footer>
//                     </Modal>


//                 </>
//             )
//         }
//     })
// export default SaveFileModal;
