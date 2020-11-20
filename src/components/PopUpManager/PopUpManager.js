import React from 'react'
import { basemodal, mainstore } from '../../modals/BaseModal';
import { observe } from 'mobx';
import { map } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import polling from 'rx-polling';
import * as Constants from '../../Constants';
import { mouseBusy } from '../../utils';
import PopUpModal from './PopUpModal';
import toastNotification from '../../utils/toastNotification';
class PopUpManager extends React.Component {
    constructor(props) {
        super(props);
        this.startPolling();

        const disposer1 = observe(mainstore.apiMode, "isAppModeAPI", (change) => {
            if (mainstore.apiMode.isAppModeAPI) {
                mainstore.currentPanelIndex = 3;
            } else {
                mainstore.currentPanelIndex = 0;
            }
        });
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

                /*  Handling the API Mode or CTS mode polling  --- starts    */
                if (!mainstore.isSetAppModeToggled) {
                    mainstore.apiMode.appState = res.appState;
                    mainstore.apiMode.isAppModeAPI = res.isAppModeAPI;
                }
                if (res.appState === Constants.READY)
                    mainstore.isChartPollingForApiModeStarted = false
                if (res.appState === Constants.BUSY && res.isAppModeAPI && !mainstore.isChartPollingForApiModeStarted) {
                    mainstore.isChartPollingForApiModeStarted = true
                    mainstore.panelResultPolling = true;      //Start polling      
                    mainstore.chartPollEnabled = true;
                }
                /*  Handling the API Mode or CTS mode polling  --- ends */

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