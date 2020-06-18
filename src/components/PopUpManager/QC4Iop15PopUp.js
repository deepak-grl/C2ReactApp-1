import React from 'react'
import {Button, Modal } from 'react-bootstrap';

class QC4Iop15PopUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showPopUp: true,
            attachDetachCount:10,
            testDescription:'',
        }
    }

    handleClosePopUp() {
        this.setState({ showPopUp: false })
    }

    handleAttachDetachValues = (event) =>{
        this.setState({attachDetachCount : event.target.value})
    }

    testDescriptionHandler = (event)=>{
        this.setState({testDescription : event.target.value})
    }
    render() {
        return (
            <Modal show={this.state.showPopUp} size="xl" aria-labelledby="contained-modal-title-vcenter" centered onHide={this.handleClosePopUp.bind(this)}>
                <Modal.Header closeButton className='popup-header-padding'>
                    <Modal.Title>Instruction</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group qc4iop-popup-text-align">
                        <p className="col-sm-12">
                            Step 1 - Disconnect the DUT from the power strip and reconnect randomly for several times and observe that DUT recovers VBUS voltage for every re-connect and performs PD Contract negotiation successfully
                        </p>
                        <p className="col-sm-12">
                            Step 2 - After performing the above step, enter the Attach/Detach count
                            <span className='align-attach-detach-popup-textbox'>
                                Attach/Detach Count
                                <input type="text" value={this.state.attachDetachCount} onChange={(e)=>this.handleAttachDetachValues(e)} />
                            </span>
                        </p>
                        <p className="col-sm-12">
                            Step 3 - Log your observation in the below test input field
                             <span className='align-attach-detach-popup-textbox'>
                                Test Description
                                <input type="text" className='popup-textbox-padding' onChange={(e)=>this.testDescriptionHandler(e)} />
                            </span>
                        </p>
                        <p className="col-sm-12">
                            (Example: DUT was disconnected from power strip and reconnected 10 times and observed that it recovered VBUS and performs PD contract negotiation successfully)
                        </p>
                    </div>
                </Modal.Body>
                <Modal.Footer className="modal-footer">
                    <Button className="grl-button" className="qc4iop-popup-footer" onClick={this.handleClosePopUp.bind(this)}>
                        OK
                     </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}
export default QC4Iop15PopUp;