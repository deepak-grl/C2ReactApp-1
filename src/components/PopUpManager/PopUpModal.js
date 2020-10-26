
//TODO @Ajith Please clean up import
import React from 'react'
import { Form, Button, Dropdown, DropdownButton, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { basemodal, mainstore } from '../../modals/BaseModal';
import * as Constants from '../../Constants';
import FlexView from 'react-flexview/lib';
import { observer } from 'mobx-react';
import { observe } from 'mobx';

const PopUpModal = observer(
    class PopUpModal extends React.Component {
        //TODO @Ajith unused constructor

        componentWillUpdate = () => {
            setTimeout(() => {
                if (document.getElementsByClassName('popup-img')[0] !== undefined && mainstore.popUpInputs.image) {                           /*dynamically setting the width for the popup according to image's width*/
                    mainstore.imgHeight = document.getElementsByClassName('popup-img')[0].naturalHeight
                    mainstore.imgWidth = document.getElementsByClassName('popup-img')[0].naturalWidth
                    if (mainstore.imgWidth === 0 || mainstore.imgWidth > 1000) {
                        mainstore.imgWidth = 760
                    }
                }
                else {
                    mainstore.imgWidth = 760
                }
            }, 0);
        }

        comboBoxEntriesType(eventKey) {
            mainstore.popUpInputs.userTextBoxInput = eventKey;
        }
        userInputTextBoxChange = (event) => {
            mainstore.popUpInputs.userTextBoxInput = event.target.value
        }
        sendDetails = (e) => {
            mainstore.popUpInputs.responseButton = e.target.textContent;
            mainstore.popUpInputs.displayPopUp = false
            if (mainstore.popUpInputs.isFrontEndPopUp === false) {
                basemodal.sendPopUpDetails();
                mainstore.commonMoiSetting.defaultTimerForPopup = mainstore.popupTimer.restoreDefaultTimerValue;    //setting the popup timer to initial values for recursive popup's
            }
            else {
                mainstore.popUpInputs.isFrontEndPopUp = false;
                mainstore.popUpInputs.shouldTextBoxBeAdded = false;
                if (mainstore.popUpInputs.callBackMethod)
                    mainstore.popUpInputs.callBackMethod();
            }
        }

        displayButtons = () => {
            switch (mainstore.popUpInputs.button) {
                case 'OK':
                    return <Button className="popupButtons" variant="success" onClick={this.sendDetails}>Ok</Button>
                case 'OKCancel':
                    return (
                        <>
                            <Button className="popupButtons" variant="primary" onClick={this.sendDetails}>Ok</Button>
                            <Button className="popupButtons" variant="secondary" onClick={this.sendDetails}>Cancel</Button>
                        </>
                    )
                case 'AbortRetryIgnore':
                    return (
                        <>
                            <Button className="popupButtons" variant="danger" onClick={this.sendDetails}>Abort</Button>
                            <Button className="popupButtons" variant="warning" onClick={this.sendDetails}>Retry</Button>
                            <Button className="popupButtons" variant="info" onClick={this.sendDetails}>Ignore</Button>
                        </>
                    )
                case 'YesNoCancel':
                    return (
                        <>
                            <Button className="popupButtons" variant="success" onClick={this.sendDetails}>Yes</Button>
                            <Button className="popupButtons" variant="warning" onClick={this.sendDetails}>No</Button>
                            <Button className="popupButtons" variant="danger" onClick={this.sendDetails}>Cancel</Button>
                        </>
                    )
                case 'YesNo':
                    return (
                        <>
                            <Button className="popupButtons" variant="success" onClick={this.sendDetails}>Yes</Button>
                            <Button className="popupButtons" variant="danger" onClick={this.sendDetails}>No</Button>
                        </>
                    )
                case 'RetryCancel':
                    return (
                        <>
                            <Button className="popupButtons" variant="warning" onClick={this.sendDetails}>Retry</Button>
                            <Button className="popupButtons" variant="danger" onClick={this.sendDetails}>Cancel</Button>
                        </>
                    )

                default:
                    return <>
                        <Button className="popupButtons" variant="primary" onClick={this.sendDetails}>Ok</Button>
                    </>
            }
        }

        displayNotificationIcons = () => {
            switch (mainstore.popUpInputs.icon) {
                case 'None':
                case 'Information':
                    return <img src=" ../../images/popup/information.png" alt="notification" className="notification-icons" />
                case 'Hand':
                case 'error':
                case 'Stop':
                    return <img src=" ../../images/popup/error.png" alt="notification" className="notification-icons" />
                case 'Question':
                    return <img src=" ../../images/popup/questionMark.png" alt="notification" className="notification-icons" />
                case 'Exclamation':
                case 'Warning':
                    return <img src=" ../../images/popup/warning.png" alt="notification" className="notification-icons" />
                case 'Asterisk':
                    return <img src=" ../../images/popup/asterisk.png" alt="notification" className="notification-icons" />
                default:
                    return <img src=" ../../images/popup/error.png" alt="notification" className="notification-icons" />
            }
        }

        handleKeyPress = (target) => {
            if (target.charCode == 13) {
                this.sendDetails();
            }
        }


        //TODO @Ajith move the FlexView outside the return statement and put it in a variable this will avoid gaps or alignment issue when there is no image
        render() {
            var alignPopUpMessage = " ";
            var popupImage = mainstore.popUpInputs.image ? <img className="popup-img" src={"../../images/Setup Images/" + mainstore.popUpInputs.image} /> : null
            var popupInputTextBox = mainstore.popUpInputs.shouldTextBoxBeAdded === true && <Form.Control className="modal-textField-align" type="text" onChange={this.userInputTextBoxChange} onKeyPress={this.handleKeyPress} placeholder="Please enter additional details" value={mainstore.popUpInputs.userTextBoxInput} />
            var popupIcon = mainstore.popUpInputs.icon != null && this.displayNotificationIcons()
            var popupImgWidthHeight = " "
            if (mainstore.popUpInputs.image)
                popupImgWidthHeight = "popup-img-width-height"
            else
                popupImgWidthHeight = " "
            if (mainstore.alignTestResultsClearPopUp) {
                alignPopUpMessage = "align-popup-message"
            }

            var popupDropDown;
            if (mainstore.popUpInputs.comboBoxEntries != null && mainstore.popUpInputs.comboBoxEntries.length > 0) {
                popupDropDown = <Dropdown className="popup-dropdown-align" >
                    <Dropdown.Toggle className="dropdowncustom" variant="success" >{mainstore.popUpInputs.comboBoxEntries[0]}</Dropdown.Toggle>
                    <Dropdown.Menu>
                        {
                            mainstore.popUpInputs.comboBoxEntries.map((comboBoxValue, index) => {
                                return <Dropdown.Item key={index} eventKey={comboBoxValue} onSelect={this.comboBoxEntriesType}>{comboBoxValue}</Dropdown.Item>
                            })
                        }
                    </Dropdown.Menu>
                </Dropdown >
            }
            return (<>
                {(mainstore.popUpInputs.displayPopUp && mainstore.popUpInputs.title !== '' && mainstore.popUpInputs.message !== '') ? <>
                    <div className="modal-backdrop">
                        <FlexView column className={"custom-scroll-popup " + popupImgWidthHeight}>
                            <FlexView>
                                <p className={"popup-title "}><strong className="popup-heder-font-align" >{mainstore.popUpInputs.title}</strong></p>
                            </FlexView>
                            {popupImage ? null :
                                <hr className="horizontal-ruler" />
                            }
                            {popupImage}
                            <FlexView>
                                <FlexView className="form-group1">
                                    {popupIcon}
                                </FlexView>
                                <FlexView className="form-group2 display-message-div">
                                    <strong className={"displayMessage " + alignPopUpMessage}>{mainstore.popUpInputs.message}</strong>
                                </FlexView>

                            </FlexView>
                            <FlexView className="form-group2">
                                {popupInputTextBox}
                                {/* {mainstore.popUpInputs.isFrontEndPopUp === true && <Form.Control className="modal-input-field-align" type="text" onChange={(e) => this.userInputTextBoxChange(e)} value={mainstore.popUpInputs.textBoxString} />} */}
                            </FlexView>
                            <div>{popupDropDown}</div>

                            <hr className="horizontal-ruler" />
                            <FlexView className="popupbuttons-align">
                                <div className="align-timer-text">
                                    {mainstore.popUpInputs.showTimer || mainstore.enableOrDisableAllPopups && mainstore.popUpInputs.mandatePopUp === false ?
                                        <OverlayTrigger placement="right" trigger="hover" overlay={<Tooltip style={{ zIndex: '99999', position: 'relative' }}>Pop Up will close after {mainstore.popUpInputs.showTimerForModal} secs</Tooltip>}>
                                            <label>Time Left(sec):   <p className={"modal-timer-align"}>{mainstore.popUpInputs.showTimerForModal}</p></label>
                                        </OverlayTrigger>
                                        : null}
                                </div>
                                {this.displayButtons()}
                            </FlexView>
                        </FlexView>
                    </div>
                </> : null}
            </>);
        }
    });
export default PopUpModal;