import React from 'react'
import { Form, Button } from 'react-bootstrap';
import { basemodal, mainstore } from '../../modals/BaseModal';
import { observe } from 'mobx';
import { map } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import polling from 'rx-polling';
import * as Constants from '../../Constants';
import FlexView from 'react-flexview/lib';
import { mouseBusy } from '../../utils';
import PopUpModal from './PopUpModal';
import ResultManager from '../PanelReportConfig/ResultManager';
import toastNotification from '../../utils/toastNotification';
class PopUpManager extends React.Component {
    constructor(props) {
        super(props);
        this.startPolling();
    }

    startPolling() {
        const request$ = ajax({
            url: Constants.URL_App + "GetMessageBox",
            crossDomain: true
        }).pipe(
            map(response => response.response || [])

        );
        polling(request$, { interval: 1000, backoffStrategy: "exponential", attempts: 2 })

            .subscribe(res => {
                if (res.isValid === true && res.index > mainstore.popUpInputs.popID) {
                    mainstore.popUpInputs.popID = res.index;
                    mainstore.popUpInputs.displayPopUp = res.isValid;
                    mainstore.popUpInputs.title = res.title;
                    mainstore.popUpInputs.message = res.message;
                    mainstore.popUpInputs.button = res.buttons;
                    mainstore.popUpInputs.image = res.imageName;
                    mainstore.popUpInputs.icon = res.icon;
                    mainstore.popUpInputs.comboBoxEntries = res.comboBoxEntries;
                    mainstore.popUpInputs.isFrontEndPopUp = false;
                    mainstore.popUpInputs.showTimer = res.showTimer;
                    mainstore.popUpInputs.defaultResponseButton = res.defaultResponseButton;
                    mainstore.popUpInputs.mandatePopUp = res.mandatePopUp;
                    if (mainstore.popUpInputs.showTimer)
                        mainstore.popUpInputs.showTimerForModal = res.timerCount;
                    mainstore.popUpInputs.spinnerID = res.spinnerId;
                    mainstore.popUpInputs.spinnerDesc = res.spinnerDesc;
                    mouseBusy(false)//Allow user to click when pop up shows up
                    basemodal.closePopUpAfterTimeOut();

                    if (res.title === '' && res.message === '') {
                        mainstore.popUpInputs.displayPopUp = false;                 //if title & message is empty('') at that time res.isValid is true,so we're making that to false.[res.isValid should be false by default if msg & title is null]
                        mainstore.popUpInputs.responseButton = res.defaultResponseButton
                        basemodal.sendPopUpDetails()
                    }
                }
            }, error => {
                console.log("PopUpManager :: startPolling ::  AJAX ERROR ::", error);
                if (error.status === 0) {
                    var showApplicationInActiveToast = new toastNotification("Please Restart the Application!", Constants.TOAST_ERROR, 10000)
                    showApplicationInActiveToast.show();
                }
            });
    }

    render() {
        return (<>
            <PopUpModal />
        </>);
    }
}
export default PopUpManager;