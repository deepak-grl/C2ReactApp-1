import React from 'react';
import FlexView from 'react-flexview/lib';
import { Form, Table } from 'react-bootstrap';
import * as Constants from '../../Constants';
import { mainstore, basemodal } from '../../ViewModel/BaseModal';
import { observer } from 'mobx-react';

const MfgWwcConfig = observer((props) => {
    var displayFrSwapBoard, displayFlirCamera;
    let cbChargerInfo = mainstore.testConfiguration.cbChargerConfiguration;

    const isFRSwapBoardConnectedToTheDut = (event) => {
        cbChargerInfo.is_FRSwapConnected = event.target.checked;
    }

    const isFLIRCameraConnectedToTheDut = (event) => {
        cbChargerInfo.is_FLIRConnected = event.target.checked;
    }

    const showFrSwapBoardSetupImagePopUp = () => {
        basemodal.showPopUp(null, null, 'FR_Swap Board Setup Diagram', null, false, null, "CB_FR_Swap.png", null)
    }

    const showFlirCameraSetupImagePopUp = () => {
        basemodal.showPopUp(null, null, 'FLIR Camera Setup Diagram', null, false, null, "CB_FLIR.png", null)

    }

    const makeCBChargerMoiVisible = () => {
        var selectedTestCaseList = mainstore.testConfiguration.selectedTestList;
        if (selectedTestCaseList.includes(Constants.CBChargerTid10) || selectedTestCaseList.includes(Constants.CBChargerTid14)) {
            displayFrSwapBoard = <>
                <Form.Check className="form-check-align" id="tcMfgFRSwapBoardInputCheckBox" label="FR_Swap Board" type='checkbox' onChange={isFRSwapBoardConnectedToTheDut} checked={cbChargerInfo.is_FRSwapConnected} />
                <a href="javascript:void(0);" td="tcMfgFRSwapBoardSetupDiagramLinkLabel" onClick={showFrSwapBoardSetupImagePopUp} className="connection-setup-image cb-setup-image">Setup Diagram</a>
            </>
        }
        if (selectedTestCaseList.includes(Constants.CBChargerTid11)) {
            displayFlirCamera = <>
                <Form.Check className="form-check-align" id="tcMfgFLIRCameraCheckBox" label="FLIR Camera" type='checkbox' onChange={isFLIRCameraConnectedToTheDut} checked={cbChargerInfo.is_FLIRConnected} />
                <a href="javascript:void(0);" id="tcMfgFLIRCameraSetupDiagramLinkLabel" onClick={showFlirCameraSetupImagePopUp} className="connection-setup-image cb-setup-image">Setup Diagram</a>
            </>
        }
    }

    return (
        <>
            {makeCBChargerMoiVisible()}
            {displayFlirCamera || displayFrSwapBoard ?
                <FlexView column style={{ display: props.display }}>
                    <p className='panelHeading'>MFG and WWC Charger Test Configuration</p>
                    <FlexView column>
                        <Table striped bordered hover>
                            <tbody>
                                {displayFrSwapBoard ?
                                    <tr>
                                        <td colSpan="2">
                                            {displayFrSwapBoard}
                                        </td>
                                    </tr> : null}
                                {displayFlirCamera ?
                                    <tr>
                                        <td colSpan="2">
                                            {displayFlirCamera}
                                        </td>
                                    </tr> : null}
                            </tbody>
                        </Table>
                    </FlexView>
                </FlexView > : null}
        </>
    )
}
)

export default MfgWwcConfig;