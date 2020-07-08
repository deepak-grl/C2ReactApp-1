import React from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import FlexView from 'react-flexview/lib';
import { basemodal, mainstore } from '../../modals/BaseModal';
import { chartstore } from '../../modals/ChartStoreModal';
import { observer } from 'mobx-react';
import { TC_RUN_BTN, TC_STOP_BTN } from '../../Constants/tooltip';
import { mouseBusy, resizeSplitterPaneToNormalMode } from '../../utils';
import * as Constants from '../../Constants';
import { observe } from 'mobx';

const TestExecutionButton = observer(
    class TestExecutionButton extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                currentPanelIndex: 0,//Kept to avoid making the whole app as observer                
            };
            //mainstore.testConfiguration.selectedTestList.length > 0 || mainstore.status.appState
            this.isDisabled = mainstore.testConfiguration.selectedTestList.length > 0 || mainstore.status.appState;
            this.isStopButtonAlreadyClicked = false;
            // basemodal.syncDataFromServer();
            observe(mainstore, "currentPanelIndex", (change) => {
                this.setState({
                    currentPanelIndex: mainstore.currentPanelIndex
                });
            });
        }

        startExecutionHandler = () => {
            setTimeout(() => {
                this.setMouseReady()
            }, 3000);
            mainstore.status.appState = Constants.BUSY;
            chartstore.AppState = Constants.BUSY;
            basemodal.syncDataToServer();
            mainstore.renderDefaultMerge = true;
            mainstore.enableOrDisableAllPopups = mainstore.commonMoiSetting.isDisableAllPopupChecked;
            // basemodal.postSelectedTestList();
            basemodal.chartModal.resetPlot();
            mainstore.currentPanelIndex = 3;
            this.resettingVariablesToDefaults();
            mainstore.handleAutoClosePopup = true
            resizeSplitterPaneToNormalMode();            //splitterpane will be close if previously open,while running the testcase
            basemodal.putCommonTestConfiguration()
        }

        resettingVariablesToDefaults = () => {
            mainstore.results.testResultsList = [];
            mainstore.isTestResultInOfflineMode = false;
            mainstore.isFivePortStartedExecution = false;
            mainstore.showMarkerByDefault = false;
            mainstore.renderGlassPaneWhileGetcaps = false;
            mainstore.enableMergeByDefault = true;
            chartstore.showVerticalBar = false;
            chartstore.channelList = [];     //after doing getcaps channel list is not getting clear(so that test case execution chart is not displaying),so here clearing the channel list
        }

        runHandler = () => {
            mouseBusy(true);
            var runTest = !(mainstore.status.appState === Constants.BUSY ? true : false)
            if (runTest) {
                this.props.sortMoiOrder(this.startExecutionHandler.bind(this));              //sorting the selected test list according to moi order and executing the test case(calling start execution method)
            }
            else {
                basemodal.getStopTestExecution(this.setMouseReady.bind(this));
                this.isStopButtonAlreadyClicked = true;
            }
        }

        setMouseReady = () => {
            mouseBusy(false)
        }

        render() {
            this.isStopButtonAlreadyClicked = mainstore.status.appState === Constants.READY ? false : this.isStopButtonAlreadyClicked;
            this.isDisabled = ((mainstore.testConfiguration.selectedTestList.length > 0 || mainstore.status.appState === Constants.BUSY) && this.isStopButtonAlreadyClicked === false)
            var buttonText = mainstore.status.appState === Constants.BUSY ? "Stop Execution" : "Start Execution";
            var buttonClass = mainstore.status.appState === Constants.BUSY ? "stopbtn" : "runbtn";
            var buttonToolTip = mainstore.status.appState === Constants.BUSY ? TC_STOP_BTN : TC_RUN_BTN;
            return (<FlexView column className="testexecutionbutton-container">
                <OverlayTrigger placement="auto" trigger="hover" delay={{ show: 0, hide: 1 }} overlay={<Tooltip> {buttonToolTip} </Tooltip>}>
                    <Button id={Constants.PANELS[this.state.currentPanelIndex].name + "_" + buttonText + "_button"} onClick={this.runHandler} disabled={!this.isDisabled} className={buttonClass}>{buttonText}</Button>
                </OverlayTrigger>
            </FlexView >);
        }
    })
export default TestExecutionButton;
