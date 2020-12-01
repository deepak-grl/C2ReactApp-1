import React from 'react'
import CheckboxTree from 'react-checkbox-tree';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faIgloo } from '@fortawesome/free-solid-svg-icons'
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import { Button } from 'react-bootstrap';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { SCROLL_TO_TESTCASE, STOP_SCROLL_TO_TESTCASE } from '../../Constants/tooltip';
import { map } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import polling from 'rx-polling';
import * as Constants from '../../Constants';
import FlexView from 'react-flexview/lib';
import { mainstore, basemodal } from '../../modals/BaseModal';
import { chartstore } from '../../modals/ChartStoreModal';
import { observe } from 'mobx';
import ProgressBar from 'react-bootstrap/ProgressBar'
import { ClipLoader } from 'react-spinners';
import { mouseBusy, resizeSplitterPaneToNormalMode } from '../../utils';
import TestExecutionButton from '../PanelTestConfig/TestExecutionButton';
import PanelTestConfig from '../PanelTestConfig/index'
import toastNotification from '../../utils/toastNotification';
import utils from '../../utils';
var scrollToTestCaseBackground = " unlive-scroll-btn-color";

var panelTestConfig = new PanelTestConfig();
library.add(faIgloo)
class PanelResults extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: [],
            icon: '',
            treeNodes: [],
            pass: 0,
            warning: 0,
            fail: 0,
            totalTestCase: 0,
            treeViewCollpaseCheckValue: true,
            repeatCount: "",
            isScrollingToCurrentTestCaseEnabled: false,
            exPortNumber: 'None'
        };
        this.HaveTestsBeenExecuted = false;
        this.testCompletionToast = null
        this.connectionErrorToast = null
        this.randomNumber = 0;
        this.executedTestCaseCount = 0;
        //this.pollingObj = this.startPolling();

        const disposer = observe(mainstore, "panelResultPolling", (change) => {
            if (mainstore.panelResultPolling) {
                this.setState({
                    treeNodes: [],
                    expanded: [],
                })
                setTimeout(() => {
                    this.pollingObj = this.startPolling()
                }, 1000);//Adding timeout to allow backend to create new test list
                chartstore.packetTimingDetails = {}             //clearing the packet time details  
                chartstore.ccPacket.packetDetails = []          //clearing the packet details
                mainstore.isPollingChecked = false;
                mainstore.currentCClinePacketsClicked = -1;
            } else {
                mainstore.isPollingChecked = true;
                this.pollingObj = this.stopPolling();
            }
        });
        const disposer1 = observe(mainstore, "isTestResultInOfflineMode", () => {
            if (mainstore.isTestResultInOfflineMode === true && mainstore.status.appState === Constants.READY)
                this.setState({ treeNodes: [] });
        });

        const disposer2 = observe(mainstore.results, "testResultsList", () => {
            if (mainstore.results.testResultsList.length < 1) {
                this.setState({
                    treeNodes: [],
                });
                this.clearProgressBarValues()
                setTimeout(() => {
                    this.setState({ totalTestCase: 0 }) //totaltestcase setstate not working in previous setstate method  , so added timeout to work 
                }, 10);
            }
        });
    }

    clearProgressBarValues = () => {
        this.setState({
            pass: 0,
            fail: 0,
            warning: 0,
        })
    }

    startPolling() {
        if (this.pollingObj !== null) {
            this.stopPolling();
        }

        var resultsPollingURLEndPoint = "GetTestResults"
        if (mainstore.isGetDeviceCapsInProgress) {
            this.clearProgressBarValues()
            resultsPollingURLEndPoint = "GetCapsResults"
        }
        else if (mainstore.configControllerCaptureInProgress) {
            this.clearProgressBarValues()
            resultsPollingURLEndPoint = "GetConfigureControllerResults"
        }
        else if (mainstore.isTestResultInOfflineMode) {
            this.clearProgressBarValues()
            resultsPollingURLEndPoint = "GetTestResultOffline"          //this api is used to call after the loading the trace file , only one time we'll call this api 
        }

        const request$ = ajax({
            url: Constants.URL_Results + resultsPollingURLEndPoint,
            crossDomain: true
        }).pipe(
            map(response => response.response || [])
        );

        let subscription = polling(request$, { interval: 5000, backoffStrategy: "exponential", attempts: 4 })
            .subscribe(res => {
                this.updatePollDataIntoTree(res.testResults)
                if (res.testResults !== undefined) {
                    mainstore.status = res.appStatus;
                    chartstore.AppState = res.appStatus.appState;
                    mainstore.results.testResultsList = res.testResults

                    var moiList = res.testResults;
                    var lastMoiTestList = moiList.length > 0 ? moiList[moiList.length - 1].children : "";
                    var lastTestCaseName = lastMoiTestList.length > 0 ? lastMoiTestList[lastMoiTestList.length - 1].displayString : "";
                    var totalTestCaseCount = res.summary.totalTestCaseCount;
                    var passCount = res.summary.passCount
                    var failCount = res.summary.failCount
                    var incompleteCount = res.summary.incompleteCount
                    var warningCount = res.summary.otherCount
                    var repeatCount = res.summary.repeatLoop
                    var exPortNumber = res.summary.exPortNumber

                    var tempExecutedTestCount = passCount + failCount + warningCount
                    var perct = Math.round(((tempExecutedTestCount) / totalTestCaseCount) * 100);

                    if (tempExecutedTestCount !== this.executedTestCaseCount) {//If any test case finished execution 
                        chartstore.channelList = [];//Clear channel list 
                        this.executedTestCaseCount = tempExecutedTestCount;
                    }

                    if (mainstore.status.appState === Constants.BUSY) {
                        this.HaveTestsBeenExecuted = true;
                        mainstore.testExecutionProgressPercentage = perct > 0 ? perct : 1;
                    }
                    else {
                        if (this.HaveTestsBeenExecuted) {
                            this.testCompletionToast = new toastNotification(mainstore.renderGlassPaneWhileGetcaps === true ? "Get Capability fields are updated !" : "Test execution completed !", Constants.TOAST_INFO, 10000)
                            this.testCompletionToast.show();
                            mainstore.showMarkerByDefault = true;
                            mainstore.enableOrDisableAllPopups = false;
                            chartstore.showVerticalBar = !chartstore.showVerticalBar

                            if (resultsPollingURLEndPoint === "GetTestResults")
                                mainstore.showReRunTestCase = true
                            else
                                mainstore.showReRunTestCase = false;
                        }
                        mainstore.testExecutionProgressPercentage = null;
                        chartstore.channelList = [];//Clear channel list 
                        this.HaveTestsBeenExecuted = false;
                        mainstore.handleAutoClosePopup = false
                    }

                    if (mainstore.status.appState === Constants.READY || mainstore.status.appState === Constants.ERROR) {
                        mainstore.panelResultPolling = false;
                        mainstore.chartPollEnabled = false;
                        mainstore.configControllerCaptureInProgress = false;
                        this.loadSelectedTestCaseInfo(lastTestCaseName)
                        if (this.connectionErrorToast) {
                            this.connectionErrorToast.hide()
                            this.connectionErrorToast = null;
                        }
                    }

                    this.setState({
                        totalTestCase: totalTestCaseCount,
                        pass: passCount,
                        fail: failCount,
                        incomplete: incompleteCount,
                        warning: warningCount,
                        repeatCount: repeatCount,
                        exPortNumber: exPortNumber,
                    })
                }
            }, error => {
                console.log("----ajax polling error-----", error);
            });

        this.pollingObj = subscription;
        return subscription;
    }

    stopPolling() {
        basemodal.getResultsFolderList();
        basemodal.getResultsFolderName();
        basemodal.getCurrentReportFileName();
        if (this.pollingObj) {
            this.pollingObj.unsubscribe()
        }
        this.state.treeViewCollpaseCheckValue = true;
    }


    populateTreeViewNodes(testResults, parentIndex = -1) {
        parentIndex = parentIndex + 1;
        let treeviewData = []
        if (testResults === null)
            return treeviewData
        if (testResults === undefined)
            return treeviewData
        var i;
        for (i = 0; i < testResults.length; i++) {
            let testCase = testResults[i]
            // mainstore.TestResultTreeviewId = testCase.displayString;
            if (testCase.displayString !== "") {
                treeviewData.push(
                    {
                        value: testCase.id != null ? testCase.id : testCase.displayString, //TODO Find a better id parameter for test steps
                        label: testCase.displayString,
                        children: this.populateTreeViewNodes(testCase.children, parentIndex),
                        icon: this.getTestResultIcon(testCase.result, parentIndex),
                        showCheckbox: false
                    }
                )
            }
            if (this.state.isScrollingToCurrentTestCaseEnabled === true)
                this.currentExecutingTestCase()
        }
        return treeviewData;
    }

    expandTreeViewNodes(treeviewData) {
        let treeViewNodes = []
        for (var index = 0; index < treeviewData.length; index++) {
            treeViewNodes.push(treeviewData[index].value)

            if (treeviewData[index].children !== undefined && treeviewData[index].children.length > 0) {
                for (var childIndex = 0; childIndex < treeviewData[index].children.length; childIndex++) {
                    treeViewNodes.concat(this.expandTreeViewNodes([treeviewData[index].children[childIndex]]))
                }
            }
        }
        return treeViewNodes;
    }
    // FAIL = 0,
    // INCOMPLETE = 1,
    // SKIPPED = 2,
    // WARNING = 3,
    // PASS = 4,
    // NA = 5,
    // RUNNING = 6,
    // RESERVED = 7,
    // NOT_EXECUTED = 8,
    // UNKNOWN = 9,


    currentExecutingTestCase = () => {
        if (document.getElementById("CurrentRunningTest") !== null && mainstore.currentPanelIndex === 3) {
            var scrollToElement = document.getElementById("CurrentRunningTest");
            scrollToElement.scrollIntoViewIfNeeded({ block: 'start' });
        }
    }

    scrollToCurrentRunningTestCase(event) {
        this.currentExecutingTestCase();
        this.setState({ isScrollingToCurrentTestCaseEnabled: !this.state.isScrollingToCurrentTestCaseEnabled })
        scrollToTestCaseBackground = " live-scroll-btn-color"

        if (this.state.isScrollingToCurrentTestCaseEnabled === true)
            this.scrollBackToStartingTestCase();
    }

    scrollBackToStartingTestCase(event) {
        this.setState({ isScrollingToCurrentTestCaseEnabled: !this.state.isScrollingToCurrentTestCaseEnabled })
        var stopScrollingToTestCase = document.getElementById('scroll-back-to-original-position');
        stopScrollingToTestCase.scrollTop = 0;
        scrollToTestCaseBackground = " unlive-scroll-btn-color"
    }

    getTestResultIcon(result, parentIndex) {
        switch (result) {

            case 'FAIL':
                return <p className={'result-fail rct-icon-indexValue' + parentIndex}  ></p>
            case 'INCOMPLETE':
                return <p className={'result-incomplete rct-icon-indexValue' + parentIndex} ></p>
            case 'SKIPPED':
                return <p className={'result-incomplete rct-icon-indexValue' + parentIndex} ></p>
            case 'WARNING':
                return <p className={'result-warning rct-icon-indexValue' + parentIndex} ></p>
            case 'PASS':
                return <p className={'result-pass rct-icon-indexValue' + parentIndex}  ></p>
            case 'NA':
                return <p className={'result-na rct-icon-indexValue' + parentIndex} ></p>
            case 'ABORTED':
                return <p className={'result-warning rct-icon-indexValue' + parentIndex} ></p>
            case 'RUNNING':
                return <>{mainstore.stopScrollingTestCase ? null : <div id="CurrentRunningTest"></div>}
                    <ClipLoader css={'margin-left:-25px; margin-right: -4px'} sizeUnit={"em"} size={1.3} color={'#123abc'} loading={this.state.loading} />
                    {/* {this.scrollTo()} */}
                </>
            case 'UNKNOWN':
            case 'NOT_EXECUTED':
                return <img src="images/empty-space.png" className={'rct-icon-indexValue' + parentIndex}  ></img>
            default:
                return <p />
        }
    }

    updatePollDataIntoTree(testResults) {
        let treeviewData = this.populateTreeViewNodes(testResults);
        let treeViewNodes = [];
        if (this.state.treeViewCollpaseCheckValue === true) {
            treeViewNodes = this.expandTreeViewNodes(treeviewData);
        }
        let treeViewNodesMerge = this.state.expanded.concat(treeViewNodes)
        this.setState({
            treeNodes: treeviewData,
            expanded: treeViewNodesMerge,
        })
        this.state.treeViewCollpaseCheckValue = false;
    }

    OnTreeNodeClick = (event) => {
        this.loadSelectedTestCaseInfo(event.label, event.value);
    }

    loadSelectedTestCaseInfo(label, value) {
        if (mainstore.status.appState !== Constants.BUSY) {
            var i, j;
            for (i = 0; i < mainstore.results.testResultsList.length; i++) {
                let moi = mainstore.results.testResultsList[i]
                for (j = 0; j < moi.children.length; j++) {//Two loops are used handel test case headings 
                    let testCase = moi.children[j];
                    if (testCase.displayString === label) {
                        if (testCase.captureFileName) {
                            if (mainstore.status.appState === Constants.READY) {
                                mouseBusy(true);
                            }
                            if (testCase.protocolMarker > -1) {
                                this.updateMarkerValues(testCase)
                            }
                            mainstore.isTestResultCaptureFileNameEmpty = false;
                            basemodal.putLoadWaveformFile(moi.children[j].captureFileName, this.fileLoadComplete.bind(this))
                            return;
                        }
                        else {
                            mainstore.isTestResultCaptureFileNameEmpty = true;
                            chartstore.packetTimingDetails = {}             //clearing the packet time details  
                            chartstore.ccPacket.packetDetails = []          //clearing the packet details
                            basemodal.chartModal.resetPlot();
                        }
                    }
                    else {
                        let k;
                        if (testCase.children !== null) {
                            for (k = 0; k < testCase.children.length; k++)
                                this.recursiveParseTestStep(testCase.children[k], label, value)
                        }
                    }
                }
            }
        }
    }

    recursiveParseTestStep(testStep, label, value) {
        let k = 0;
        if (testStep.displayString === label && testStep.id === value) {        //mapping the ccpackets will not work while clicking on description.for desc also wants to work means need to provide id for children from backend
            if ((testStep.signalStartMarker !== "" && testStep.signalStopMarker !== "") && (testStep.signalStartMarker !== 0 && testStep.signalStopMarker !== 0)) {
                chartstore.isPlotDataLoading = true;         // false => calc_PacketDistanceMultiplier()
                var diff = testStep.signalStopMarker - testStep.signalStartMarker;
                diff = (diff < 1 ? 1 : diff);   // if difference is less than 1 second make diff = 1;
                //chartstore.chartValues.startTimeZoom = testStep.signalStartMarker - diff;    //(testStep.signalStartMarker * 0.05);
                let newStartTimeZoom = testStep.signalStartMarker - diff;    //(testStep.signalStartMarker * 0.05);
                //chartstore.chartValues.endTimeZoom = testStep.signalStopMarker + diff;       //(testStep.signalStopMarker * 0.05);   
                let newEndTimeZoom = testStep.signalStopMarker + diff;       //(testStep.signalStopMarker * 0.05);   
                //chartstore.chartValues.startTimeZoom = testStep.signalStartMarker - (testStep.signalStartMarker * 0.05);
                //chartstore.chartValues.endTimeZoom = testStep.signalStopMarker + (testStep.signalStopMarker * 0.05);   
                this.updateMarkerValues(testStep);
                basemodal.chartModal.singlePlotDataCall(this.randomNumber++, newStartTimeZoom, newEndTimeZoom);
                resizeSplitterPaneToNormalMode()
                return;
            }
        }
        else {
            if (testStep.children !== null) {
                for (k = 0; k < testStep.children.length; k++) {
                    this.recursiveParseTestStep(testStep.children[k], label, value)
                }
            }
        }
    }

    updateMarkerValues = (testStep) => {
        mainstore.currentCClinePacketsClicked = testStep.protocolMarker;
        chartstore.markerCustomPositioningData.marker_1_PointInTime = testStep.signalStartMarker;
        chartstore.markerCustomPositioningData.marker_2_PointInTime = testStep.signalStopMarker;
    }

    fileLoadComplete() {
        basemodal.chartModal.plotReadyStatusPoll();
        // mouseBusy(false)
    }

    clearTestResults = () => {
        mainstore.results.testResultsList = [];
        basemodal.putClearTestResults();
    }

    render() {
        var passLabel = this.state.pass > 0 ? "Pass:" + this.state.pass + '/' + this.state.totalTestCase : "";
        var warningLabel = this.state.warning > 0 ? "Warning:" + this.state.warning + '/' + this.state.totalTestCase : "";
        var failLabel = this.state.fail > 0 ? "Fail:" + this.state.fail + '/' + this.state.totalTestCase : "";
        return (
            <FlexView style={{ width: '100%', height: Constants.MAX_PANEL_HEIGHT }} className="panelresults-container" key="main_key1">
                <FlexView column className="panel-setWidth">
                    <p className="panelHeading custom-setbottommargin"> Test Results
                    {mainstore.status.appState === Constants.BUSY ?
                            <div className="scroll-test-case-div">
                                <label className="scroll-current-test-checkbox-label-width">
                                    {/* {this.state.isScrollingToCurrentTestCaseEnabled ? */}
                                    <input type="checkbox" id="rcScrollToCurrentTestCheckbox" checked={this.state.isScrollingToCurrentTestCaseEnabled} className={"grl-button scroll-testcase-btn" + scrollToTestCaseBackground} onChange={(event) => this.scrollToCurrentRunningTestCase(event)} />Scroll To Current Test
                                </label>
                            </div>
                            : null
                        }
                    </p>
                    <FlexView hAlignContent='center' vAlignContent='bottom' className="setbottomspcing-execBtn">
                        {this.state.repeatCount !== "" ?
                            <FlexView className="reRun-test-result">
                                <p>Rerun : <strong> {this.state.repeatCount}</strong></p>
                            </FlexView> : null}
                        {/* <FlexView column className="testexecutionbutton-container">
                            <OverlayTrigger placement="auto" trigger="hover" delay={{ show: 0, hide: 1 }} overlay={<Tooltip> Clear Test Case Results </Tooltip>}>
                                <Button onClick={this.clearTestResults} disabled className="grl-button clear-test-results-btn">Clear Test Results</Button>
                            </OverlayTrigger>
                        </FlexView > */}
                        <FlexView className={this.state.repeatCount !== "" ? "results-test-execution-btn-div" : null}>
                            <TestExecutionButton sortMoiOrder={panelTestConfig.sortMoiOrder} />
                        </FlexView>
                    </FlexView>
                    <FlexView className="result-progress-div">
                        {mainstore.testExecutionProgressPercentage ?
                            <FlexView className="results-progress-label-div">
                                <span> Progress : <strong > {mainstore.testExecutionProgressPercentage + "%"}</strong> </span>
                            </FlexView> : null}
                        <FlexView className="results-progress-bar-div">
                            <ProgressBar>
                                <ProgressBar animated={this.HaveTestsBeenExecuted} max={this.state.totalTestCase} variant="success" now={this.state.pass} key={1} />
                                <ProgressBar animated={this.HaveTestsBeenExecuted} max={this.state.totalTestCase} variant="warning" now={this.state.warning} key={2} />
                                <ProgressBar animated={this.HaveTestsBeenExecuted} max={this.state.totalTestCase} variant="danger" now={this.state.fail} key={3} />
                            </ProgressBar>
                        </FlexView>
                    </FlexView>

                    <CountResults pass={this.state.pass} warning={this.state.warning} fail={this.state.fail} incomplete={this.state.incomplete} total={this.state.totalTestCase} repeatCount={this.state.repeatCount} exPortNumber={this.state.exPortNumber} />
                    <FlexView id='test-selection-tree' className="c2-treeview-nodes results-treeview">
                        <div onWheel={(e) => utils.listenScrollEvent(e)} className="scroll" id="scroll-back-to-original-position">
                            <CheckboxTree
                                onClick={(e) => this.OnTreeNodeClick(e)}
                                nodes={this.state.treeNodes}
                                expanded={this.state.expanded}
                                onExpand={expanded => this.setState({ expanded })}
                            // showExpandAll={true}
                            />
                        </div>
                    </FlexView>

                </FlexView>

            </FlexView>
        );
    }
}

class CountResults extends React.Component {
    render() {
        var repeatResultsAlign = " ";
        let totalCompletedestCase = this.props.pass + this.props.fail + this.props.warning + this.props.incomplete;
        return (
            <>
                <FlexView className="results-notify">
                    {mainstore.status.appState === Constants.BUSY ?
                        <div className="results-running-test">Running : <strong className="test-results-notify-count"> {totalCompletedestCase + "/" + this.props.total}</strong> tests</div>
                        : null}
                    <FlexView className="results-icon-div">
                        <OverlayTrigger placement="auto" trigger="hover" overlay={<Tooltip className="count-results-tooltip"> Number of test cases passed </Tooltip>}>
                            <div className={"results-icon-align" + repeatResultsAlign}>
                                <img className="set-results-icon-dimensions" src="../../images/pass.png" /><strong className="test-results-notify-count">  {this.props.pass}</strong>
                            </div>
                        </OverlayTrigger>

                        <OverlayTrigger placement="auto" trigger="hover" overlay={<Tooltip className="count-results-tooltip"> Number of test cases failed </Tooltip>}>
                            <div className={"results-icon-align" + repeatResultsAlign}>
                                <img className="set-results-icon-dimensions" src="../../images/fail.png" /><strong className="test-results-notify-count"> {this.props.fail}</strong>
                            </div>
                        </OverlayTrigger>

                        <OverlayTrigger placement="auto" trigger="hover" overlay={<Tooltip className="count-results-tooltip"> Number of test cases incomplete </Tooltip>}>
                            <div className={"results-icon-align" + repeatResultsAlign}>
                                <img className="set-results-icon-dimensions" src="../../images/skip_incomplete.png" /><strong className="test-results-notify-count"> {this.props.incomplete}</strong>
                            </div>
                        </OverlayTrigger>

                        <OverlayTrigger placement="auto" trigger="hover" overlay={<Tooltip className="count-results-tooltip"> Number of warning test cases</Tooltip>}>
                            <div className={"results-icon-align" + repeatResultsAlign}>
                                <img className="set-results-icon-dimensions" src="../../images/warning.png" /><strong className="test-results-notify-count"> {this.props.warning}</strong>
                            </div>
                        </OverlayTrigger>
                    </FlexView>
                </FlexView>
                <hr className="horizontal-sepaerator" />
                {
                    mainstore.isFivePortStartedExecution ?
                        <div className="active-five-port">
                            {<strong>Active Five Port : {this.props.exPortNumber}</strong>}
                            <hr className="horizontal-sepaerator" />
                        </div> : null
                }
            </>
        )
    }
}



export default PanelResults;