import React from 'react'
import { Button, Modal, Tab, Tabs, OverlayTrigger, Tooltip } from 'react-bootstrap';
import FlexView from 'react-flexview/lib';
import { basemodal, mainstore } from '../../modals/BaseModal';
import Switch from "react-switch";
import { EDIT_TEXTBOX, PC_CLEAR_BTN } from '../../Constants/tooltip';
import { observer } from 'mobx-react';

const Mode = observer(
    class Mode extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
            }
        }

        handleModeOnChange = (event) => {
            mainstore.modeStatus.captureLocation = event.target.value
        }

        handleModeOnClick = () => {
            basemodal.putUserData()
        }

        modeToggleButtonClicked = () => {
            mainstore.modeStatus.isOldRep = !mainstore.modeStatus.isOldRep;
        }

        render() {
            return (
                <FlexView className="mode-div">
                    <label className="mode-label" >Test capture folder location :</label>
                    <input type="text" id="modeInput" className="mode-name-input-field" value={this.state.adminDebugModeText} onChange={(e) => this.handleModeOnChange(e)} />
                    <Button className="mode-button" id="mode-button" onClick={() => { this.handleModeOnClick() }} >Execute</Button>

                    <FlexView className="edit-vif-toggle-btn">
                        <div className="toggle-switch">
                            <Switch
                                id="ModeToggleSwitch"
                                checked={mainstore.modeStatus.isOldRep}
                                onChange={() => this.modeToggleButtonClicked()}
                                onColor="#0000ff"
                                offColor="#c1c1c1"
                                offHandleColor="#06789a"
                                onHandleColor="#06789a"
                                handleDiameter={20}
                                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                height={20}
                                width={50}
                                uncheckedIcon={<div style={{ color: "black", paddingLeft: 3, fontWeight: 600 }}> Old </div>}
                                checkedIcon={<div style={{ color: "White", paddingLeft: 3, fontWeight: 600 }}> New </div>}
                            />
                        </div>
                    </FlexView>
                </FlexView>
            )
        }
    }
)

export default Mode;