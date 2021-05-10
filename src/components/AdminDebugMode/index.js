import { observer } from 'mobx-react';
import React from 'react';
import { Button } from 'react-bootstrap';
import FlexView from 'react-flexview/lib';
import { ClipLoader } from 'react-spinners';
import { basemodal, mainstore } from '../../ViewModel/BaseModal';
import Switch from "react-switch";


let executeButtonSpinnerDescription = '';

const Mode = observer(
    class Mode extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                    executeUpdateLoading: false,
            }
        }

        handleModeOnChange = (event) => {
            mainstore.modeStatus.captureLocation = event.target.value
           
        }

        handleModeOnClick = () => {
            this.setState({ executeUpdateLoading: true })
            mainstore.popUpPolling = true;
            basemodal.putUserData(this.doneExecuteUpdate.bind(this));
        
        }

        modeToggleButtonClicked = () => {
            mainstore.modeStatus.isOldRep = !mainstore.modeStatus.isOldRep;
        }


        doneExecuteUpdate = () => {
            executeButtonSpinnerDescription = ""
            this.setState({ executeUpdateLoading: false })
          }

          settingExecuteButtonSpinnerDescription = () => {
            if (mainstore.popUpInputs.spinnerID === 10)
                executeButtonSpinnerDescription =mainstore.popUpInputs.spinnerDesc
           
          }

        render() {
            this.settingExecuteButtonSpinnerDescription();
            return (
                <div>
                <FlexView className="mode-div">
                    <label className="mode-label" >Test capture folder location :</label>
                    <input type="text" id="modeInput" className="mode-name-input-field" value={this.state.adminDebugModeText} onChange={(e) => this.handleModeOnChange(e)} />
                    <Button className="mode-button" id="mode-button" onClick={() => { this.handleModeOnClick() }} >Execute</Button>
                   <div className="spinner"> <ClipLoader  sizeUnit={"px"} size={25} color={'#123abc'} loading={this.state.executeUpdateLoading} /></div>
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
                <FlexView>
                <p> {executeButtonSpinnerDescription}</p>
                </FlexView>
                </div>
            )
        }
    
    }
)

export default Mode;