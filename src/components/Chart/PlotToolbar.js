import React from 'react'
import FlexView from 'react-flexview/lib';
import * as Constants from '../../Constants';
import ajax from '../../modals/AjaxUtils';
import { observe } from 'mobx';
import { basemodal, mainstore } from '../../modals/BaseModal';
import { chartstore } from '../../modals/ChartStoreModal';
import { Button, Navbar, Nav } from 'react-bootstrap';
import { setPlotCursor, scrollToPacket, hideAndShowByClassName, customNavbarOnSpitterMoves } from '../../utils';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { PLT_SAVE, PLT_LOAD, PLT_MOUSE_PAN, PLT_CURSOR, PLT_ZOOM_IN, PLT_ZOOM_OUT, PLT_PAN_LEFT, PLT_PAN_RIGHT, PLT_HMARKER, PLT_VERTICAL_ZOOM, PLT_VERTICAL_ZOOMOUT, PLT_RESET, PLT_MERGE, PLT_UNMERGE, PLT_PAN_TOP, PLT_PAN_BOTTOM, PLT_LIVE_UPDATES, PLT_UNLIVE_UPDATES, PLT_MASK, PLT_SCREENSHOT } from '../../Constants/tooltip';
import PlotToolBarButtons from './PlotToolBarButtons';

class PlotToolbar extends React.Component {
    constructor(props) {
        super(props);
        this.readStatusPoll = null;
        this.rand = 1;
        this.playButton = 1;
        this.syncButton = 2;
        this.waveFormButton = 4;
        this.cursorButton = 5;
        this.folderButton = 6;
        this.zoominButton = 7;
        this.zoomoutButton = 8;
        this.panButton = 9;
        this.panRight = 10;
        this.panLeft = 11;
        this.resetButton = 12;
        this.mergeButton = 13;
        this.unMergeButton = 14;
        this.verticalZoomButton = 15;
        this.verticalZoomOutButton = 16;
        this.panTop = 17;
        this.panBottom = 18;
        this.markerButton = 19;
        this.chartMask = 20;
        this.state = {
            buttonsBackground: null,
            // isPollingChecked: false,
            zoomSeperatorButtonsBackground: null,
            markerBackgroundColor: null,
            markersactive: false,
            allSelectedChanelNumbers: [],
        }

        var me = this;
        const disposer = observe(chartstore, "channelList", (change) => {
            var allChanelsArray = [];
            for (var i = 0; i < chartstore.channelList.length; i++) {
                allChanelsArray.push({ chanelNum: chartstore.channelList[i], isChecked: true })
            }
            // sort based on voltage current group
            var sortedArrVC = Constants.SORTED_VOLTAGE_CURRENT_GROUP;
            allChanelsArray.sort(function (a, b) {
                return sortedArrVC.indexOf(a.chanelNum) - sortedArrVC.indexOf(b.chanelNum);
            });

            chartstore.allSelectedChanelNumbers = allChanelsArray;
        });
        const disposer2 = observe(chartstore, "allSelectedChanelNumbers", (change) => {
            me.setState({ allSelectedChanelNumbers: change.newValue });
        });

        const disposer3 = observe(mainstore, "isTestResultCaptureFileNameEmpty", (change) => {
            this.handleClickReset()
        });
    }

    componentDidMount() {
        hideAndShowByClassName();
        setTimeout(function () { customNavbarOnSpitterMoves(Constants.PLOTTOOLBAR_ICON_TOTAL_WIDTH); }, 200);
    }

    componentDidUpdate() {
        if (mainstore.showMarkerByDefault === true) {
            document.getElementsByClassName('plot-toolbar-img plot-toolbar-img2')[0].classList.add('grey')
            setTimeout(function () { customNavbarOnSpitterMoves(Constants.PLOTTOOLBAR_ICON_TOTAL_WIDTH); }, 10);    //handle marker's height by defualt showing when splitter size is less
        }
    }

    showHideChanel = (e, chanelNum, isChecked) => {
        var countEnabled = 0;           // if only one is selected we cant unselect that. (it will display empty space)
        mainstore.renderDefaultMerge = false;
        chartstore.allSelectedChanelNumbers.forEach(ele => (ele.isChecked ? countEnabled++ : 0));

        if (countEnabled > 1 || isChecked === false) {           // isChecked variable will have older value (before check)
            chartstore.allSelectedChanelNumbers.forEach(function (ele, index) {
                if (ele.chanelNum === chanelNum) {
                    chartstore.allSelectedChanelNumbers[index].isChecked = !chartstore.allSelectedChanelNumbers[index].isChecked;

                    var mergeIndexArray = basemodal.chartModal.mergeIndex;
                    if (mainstore.enableMergeByDefault) {                                 //this is for merged charts to remove the selected channels
                        if (isChecked === true) {
                            for (var i = 0; i < basemodal.chartModal.mergedIndexArr.length; i++) {
                                var removeSelectedchannel = mergeIndexArray[i].indexOf(chanelNum)
                                if (removeSelectedchannel !== -1)
                                    mergeIndexArray[i].splice(removeSelectedchannel, 1)
                            }
                        }
                        else {
                            for (var j = 0; j < basemodal.chartModal.mergedIndexArr.length; j++) {
                                if ((basemodal.chartModal.mergedIndexArr[j].includes(chanelNum)) && !(mergeIndexArray[j].includes(chanelNum)))
                                    mergeIndexArray[j].splice(j, 0, chanelNum)
                            }
                        }
                    }
                    else {                                                              //this is for unmerged charts to remove selected channels
                        if (isChecked === true)
                            mergeIndexArray[chanelNum] = [];
                        else
                            mergeIndexArray[chanelNum] = [chanelNum];
                    }

                }
            });
            this.setState({ allSelectedChanelNumbers: chartstore.allSelectedChanelNumbers });
            setTimeout(() => { basemodal.chartModal.requestChartRerender() }, 200);
        }
    }

    enableAllChannelsWhileSwitchingMergeToUnmerge = () => {
        chartstore.allSelectedChanelNumbers.forEach(function (ele, index) {
            chartstore.allSelectedChanelNumbers[index].isChecked = true;
        })
    }

    displayFileDialog = (event) => {
        mainstore.alignTestResultsClearPopUp = true
        if (mainstore.results.testResultsList.length > 0)
            basemodal.showPopUp("Existing test results will be cleared from application if a new capture file is loaded.\nClick OK to load the capture file.\nClick Cancel to keep the existing test results", null, 'Warning', null, false, 'OKCancel', null, this.clearingTestReuslt.bind(this, event))
        else
            this.clearingTestReuslt(event)
    }

    clearingTestReuslt = (event) => {
        if (mainstore.popUpInputs.responseButton === "Cancel") {
            mainstore.isTestResultInOfflineMode = false
        }
        else {
            this.setBackgroundColor(this.folderButton)
            event.preventDefault();
            this.refUploadInput.click();
        }
        mainstore.alignTestResultsClearPopUp = false
    }

    onFileSelect = (event) => {
        var file = event.target.files[0];
        var path = Constants.URL_Plot + "PutWaveformFile";
        if (this.readStatusPoll != null)
            clearInterval(this.readStatusPoll)
        chartstore.isPlotDataLoading = true;
        chartstore.isPlotResultActive = true;
        chartstore.packetTimingDetails = {}             //clearing the packet time details  
        chartstore.ccPacket.packetDetails = []          //clearing the packet details
        ajax.fileUpload(path, file, "WaveformFile", function (response) {
            basemodal.chartModal.plotReadyStatusPoll();
            mainstore.isTestResultInOfflineMode = true;
            mainstore.panelResultPolling = true;            //want to call the "GetTestResultOffline" api only once , so here making the paneresluting to true
            setTimeout(() => {
                mainstore.panelResultPolling = false;       //no need poll the  "GetTestResultOffline" api continuosly, so here making the paneresulting to false
            }, 2000);
        });
    }
    handleClickPan = () => {
        this.setBackgroundColorForZooms(this.panButton)
        setPlotCursor(Constants.MODE_PAN);
        basemodal.chartModal.pannedPercentage = 0;
        basemodal.chartModal.enablePanMode();           // Same code => basemodal.chartModal.currentTool = Constants.MODE_PAN;
        basemodal.chartModal.requestChartRerender();
    }

    setBackgroundColor = (position) => {
        this.setState({ buttonsBackground: position })
    }
    getButtonBackground = (position) => {
        if (this.state.buttonsBackground === position) {
            if (this.props.offlineMode === true) {
                return "";
            }
            return "grey";
        }
    }

    setBackgroundColorForZooms = (position) => {
        this.setState({ zoomSeperatorButtonsBackground: position })
    }
    getButtonBackgroundForZooms = (position) => {
        if (this.state.zoomSeperatorButtonsBackground === position) {
            if (this.props.offlineMode === true) {
                return "";
            }
            return "grey";
        }
    }

    setBackgroundForMarker = (position) => {
        this.setState({ markerBackgroundColor: position })
    }

    getButtonBackgroundForMarker = (position) => {
        if (this.state.markerBackgroundColor === position) {
            if (this.props.offlineMode === true) {
                return "";
            }
            return "grey";
        }
    }

    handleClickZoomIn = () => {
        this.setBackgroundColorForZooms(this.zoominButton);
        setPlotCursor(Constants.MODE_ZOOM_IN);
        // chartstore.showVerticalBar = false;      // hide vertical marker while Zooming.
        this.zoomInOnButtonClick(basemodal.chartModal.currentTool)
        basemodal.chartModal.enableZoomInMode();
        basemodal.chartModal.requestChartRerender();        //chartstore.isChart_rerender = chartstore.isChart_rerender + 1;
    }
    handleClickVerticalZoom = () => {
        this.setBackgroundColorForZooms(this.verticalZoomButton);
        basemodal.chartModal.currentTool = Constants.MODE_VERTICAL_ZOOM;
        setPlotCursor(Constants.MODE_ZOOM_IN);
        basemodal.chartModal.requestChartRerender();
    }
    handleClickVerticalZoomOut = () => {
        this.setBackgroundColorForZooms(this.verticalZoomOutButton);
        basemodal.chartModal.currentTool = Constants.MODE_CURSORE;
        setPlotCursor(Constants.MODE_CURSORE);
        var VZoomMinMaxArr = basemodal.chartModal.verticalZoom_MinMaxValArray;
        for (let i = 0; i < VZoomMinMaxArr.length; i++) {
            var diff = VZoomMinMaxArr[i].yaxisMax - VZoomMinMaxArr[i].yaxisMin;
            var newMin = VZoomMinMaxArr[i].yaxisMin - (0.5 * diff);
            var newMax = VZoomMinMaxArr[i].yaxisMax + (0.5 * diff);

            if (newMax > basemodal.chartModal.verticalZoom_MinMaxValArray[i].high) {
                newMax = basemodal.chartModal.verticalZoom_MinMaxValArray[i].high;
            }
            if (newMin < basemodal.chartModal.verticalZoom_MinMaxValArray[i].low) {
                newMin = basemodal.chartModal.verticalZoom_MinMaxValArray[i].low;
            }
            basemodal.chartModal.verticalZoom_MinMaxValArray[i].yaxisMax = newMax;
            basemodal.chartModal.verticalZoom_MinMaxValArray[i].yaxisMin = newMin;
        }
        basemodal.chartModal.requestChartRerender();
    }
    zoomInOnButtonClick = (currentTool) => {
        var me = this;
        var startTime;
        var endTime;
        var diff = chartstore.chartValues.endTimeZoom - chartstore.chartValues.startTimeZoom;
        if (diff > 0 && currentTool === Constants.MODE_ZOOM_IN) {
            var startIn = chartstore.chartValues.startTimeZoom + (0.25 * diff);
            var endIn = chartstore.chartValues.endTimeZoom - (0.25 * diff);
            if (startIn < 0)
                startTime = chartstore.absoluteStartTime;
            else {
                startTime = startIn;
            }
            if (endIn > chartstore.signalFileStopTime)
                endTime = chartstore.signalFileStopTime;
            else {
                endTime = endIn;
            }
            basemodal.chartModal.singlePlotDataCall(me.rand++, startTime, endTime);
        }
    }
    handleClickCursor = () => {
        this.setBackgroundColor(this.cursorButton);
        basemodal.chartModal.currentTool = Constants.MODE_CURSORE;
        setPlotCursor(Constants.MODE_CURSORE);
        basemodal.chartModal.requestChartRerender();
    }

    handlePanRight = () => {
        //this.setBackgroundColor(this.panRight);
        //basemodal.chartModal.currentTool = Constants.MODE_CURSORE;
        // setPlotCursor(Constants.MODE_CURSORE);
        basemodal.chartModal.paningRight();
    }
    handlePanLeft = () => {
        // this.setBackgroundColor(this.panLeft);
        // basemodal.chartModal.currentTool = Constants.MODE_CURSORE;
        // setPlotCursor(Constants.MODE_CURSORE);
        basemodal.chartModal.paningLeft();
    }
    handlePanTop = () => {
        // this.setBackgroundColor(this.panTop);
        // basemodal.chartModal.currentTool = Constants.MODE_CURSORE;
        // setPlotCursor(Constants.MODE_CURSORE);
        var VZoomMinMaxArr = basemodal.chartModal.verticalZoom_MinMaxValArray;
        for (let i = 0; i < VZoomMinMaxArr.length; i++) {
            var diff = VZoomMinMaxArr[i].yaxisMax - VZoomMinMaxArr[i].yaxisMin;
            var newMin = VZoomMinMaxArr[i].yaxisMin + (0.5 * diff);
            var newMax = VZoomMinMaxArr[i].yaxisMax + (0.5 * diff);

            if (newMax > basemodal.chartModal.verticalZoom_MinMaxValArray[i].high) {
                newMax = basemodal.chartModal.verticalZoom_MinMaxValArray[i].high;
                newMin = newMax - diff;
            }
            if (newMax !== basemodal.chartModal.verticalZoom_MinMaxValArray[i].yaxisMax) {
                basemodal.chartModal.verticalZoom_MinMaxValArray[i].yaxisMax = newMax;
                basemodal.chartModal.verticalZoom_MinMaxValArray[i].yaxisMin = newMin;
            }
        }
        basemodal.chartModal.requestChartRerender();
    }

    handlePanBottom = () => {
        // this.setBackgroundColor(this.panBottom);
        // basemodal.chartModal.currentTool = Constants.MODE_CURSORE;
        // setPlotCursor(Constants.MODE_CURSORE);
        var VZoomMinMaxArr = basemodal.chartModal.verticalZoom_MinMaxValArray;
        for (let i = 0; i < VZoomMinMaxArr.length; i++) {
            var diff = VZoomMinMaxArr[i].yaxisMax - VZoomMinMaxArr[i].yaxisMin;
            var newMin = VZoomMinMaxArr[i].yaxisMin - (0.5 * diff);
            var newMax = VZoomMinMaxArr[i].yaxisMax - (0.5 * diff);

            if (newMin < basemodal.chartModal.verticalZoom_MinMaxValArray[i].low) {
                newMin = basemodal.chartModal.verticalZoom_MinMaxValArray[i].low;
                newMax = newMin + diff;
            }
            if (newMin !== basemodal.chartModal.verticalZoom_MinMaxValArray[i].yaxisMin) {
                basemodal.chartModal.verticalZoom_MinMaxValArray[i].yaxisMax = newMax;
                basemodal.chartModal.verticalZoom_MinMaxValArray[i].yaxisMin = newMin;
            }
        }
        basemodal.chartModal.requestChartRerender();
    }
    handleMask = () => {
        basemodal.getPlotMaskPoints();
        basemodal.chartModal.isMaskActive = !basemodal.chartModal.isMaskActive;
        if (basemodal.chartModal.isMaskActive) {
            this.setBackgroundColor(this.chartMask);
            basemodal.getPlotMaskPoints();
        } else {
            this.setBackgroundColor(0);
        }
        basemodal.chartModal.currentTool = Constants.MODE_CURSORE;
        basemodal.chartModal.requestChartRerender();
    }

    handleClickZoomOut = () => {
        this.setBackgroundColorForZooms(this.zoomoutButton)
        this.setState({ showZoomOutBackground: !this.state.showZoomOutBackground })
        setPlotCursor(Constants.MODE_ZOOM_OUT)
        basemodal.chartModal.enableZoomOutMode();
        var startTime;
        var endTime;
        var me = this;
        var diff = chartstore.chartValues.endTimeZoom - chartstore.chartValues.startTimeZoom;
        if (diff > 0) {
            var startOut = chartstore.chartValues.startTimeZoom - (0.5 * diff);
            var endOut = chartstore.chartValues.endTimeZoom + (0.5 * diff);
            if (startOut < 0)
                startTime = chartstore.absoluteStartTime;      // 0;
            else {
                startTime = startOut;
            }
            if (endOut > chartstore.signalFileStopTime)
                endTime = chartstore.signalFileStopTime;
            else {
                endTime = endOut;
            }
            basemodal.chartModal.singlePlotDataCall(me.rand++, startTime, endTime);
        }
        chartstore.ccPacket.scrollToCCPacket = 0;
        scrollToPacket(0);              //Packet scroll to top.
        basemodal.chartModal.requestChartRerender();
    }
    handleClickReset = () => {
        let startTime;
        let endTime;
        this.setBackgroundColorForZooms(this.resetButton);
        this.setBackgroundColor(this.resetButton);
        basemodal.chartModal.currentTool = Constants.MODE_CURSORE;
        basemodal.chartModal.verticalZoom_MinMaxValArray = [];  //Empty vertical zoom values.
        setPlotCursor(Constants.MODE_CURSORE);
        startTime = chartstore.signalFileStartTime;
        endTime = chartstore.signalFileStopTime;
        if (!mainstore.isTestResultCaptureFileNameEmpty)
            basemodal.chartModal.singlePlotDataCall(this.rand++, startTime, endTime);
        // chartstore.showVerticalBar = false;
        // mainstore.showMarkerByDefault = false;
        basemodal.chartModal.requestChartRerender();        //imp if Mask enable then vZoom then reset it will take y-axis max value from graph not from mask maxVal (+ 0.15)
    }
    handleClickMerge = () => {
        this.setBackgroundColor(this.mergeButton);
        // basemodal.chartModal.currentTool = Constants.MODE_CURSORE;
        basemodal.chartModal.verticalZoom_MinMaxValArray = [];  //Empty vertical zoom values.
        // setPlotCursor(Constants.MODE_CURSORE);
        basemodal.chartModal.mergeIndex = JSON.parse(JSON.stringify(basemodal.chartModal.mergedIndexArr));
        basemodal.chartModal.requestChartRerender();
        mainstore.enableMergeByDefault = true
        this.enableAllChannelsWhileSwitchingMergeToUnmerge()
    }

    handleClickUnMerge = () => {
        this.setBackgroundColor(this.unMergeButton);
        // basemodal.chartModal.currentTool = Constants.MODE_CURSORE;
        // setPlotCursor(Constants.MODE_CURSORE);
        basemodal.chartModal.mergeIndex = JSON.parse(JSON.stringify(basemodal.chartModal.defaultMergeIndex));
        basemodal.chartModal.requestChartRerender();
        mainstore.enableMergeByDefault = false
        this.enableAllChannelsWhileSwitchingMergeToUnmerge()
    }
    waveFormFile() {
        this.setBackgroundColor(this.waveFormButton)
        if (mainstore.popUpInputs.responseButton === "Ok")
            basemodal.saveWaveFormFile();
    }
    // playPlot = () => {//TODO @Ajith deprecate this 
    //     this.setBackgroundColor(this.playButton)
    // }

    togglePolling = (e) => {
        mainstore.isPollingChecked = !mainstore.isPollingChecked;
        if (mainstore.isPollingChecked == true) {
            basemodal.chartModal.stopTimer();
        }
        else {
            mainstore.currentpacketIndex = 0;
            basemodal.chartModal.startTimer();
        }
    }
    showTraceFileModal() {//TODO @Ajith is it possible to get the file name from user using a popup
        /*  this.setBackgroundColor(this.waveFormButton) */
        basemodal.showPopUp('FileName', null, 'Save File', "GRL_Signal_File.grltrace", true, "OKCancel", null, this.waveFormFile.bind(this))
    }

    horizontalMarker() {
        mainstore.showMarkerByDefault = false
        this.props.handleVerticleBar();
        this.setBackgroundForMarker(this.markerButton);

        // setTimeout(function () { customNavbarOnSpitterMoves(Constants.PLOTTOOLBAR_ICON_TOTAL_WIDTH); }, 10);    //handle marker's height when splitter size is less
    }

    render() {
        const listItems = this.state.allSelectedChanelNumbers.map((ele, i) =>
            <label key={'chanel_selector' + i} className="custom-dropdown-label" htmlFor={"chanelNum" + ele.chanelNum} ><input type="checkbox" name="one" value="one" id={"chanelNum" + ele.chanelNum} onChange={(e) => this.showHideChanel(e, ele.chanelNum, ele.isChecked)} checked={ele.isChecked} /> {Constants.GRAPH_YAXIS_LABEL[ele.chanelNum]} </label>
        );
        return (
            <div className='plot-toggle' style={{ backgroundColor: 'lightgrey', height: '40px' }}>
                <img src='../../images/navbar-icon.jpg' id='navbar_icon_img' className='hideImage' alt='navbar' style={{ width: '40px', cursor: 'pointer' }} />
                <div className='chart-plottoolbar' data-html2canvas-ignore='true'>
                    {/* <PlotToolBarButtons
                        tooltip={PLT_SAVE}
                        img={'../../images/chartIcons/PNG/save.png'}
                        clickHandler={this.showTraceFileModal.bind(this)}
                        alt={'save-as'}
                        buttonId={'chart_toolbar_save_button'}
                    /> */}
                    <PlotToolBarButtons
                        tooltip={PLT_LOAD}
                        img={'../../images/chartIcons/PNG/load.png'}
                        clickHandler={this.displayFileDialog.bind(this)}
                        alt={'folder'}
                        className={mainstore.isTestResultInOfflineMode ? 'load-trace-btn' : null}
                        separtorClassName={'toolbar-btn-separtor'}
                        buttonId={'chart_toolbar_load_button'}
                    />
                    <div style={{ display: 'none' }}>
                        <input
                            ref={(ref) => {
                                this.refUploadInput = ref;
                            }}
                            accept='.grltrace'
                            type='file'
                            style={{ display: 'none' }}
                            onClick={(e) => (e.target.value = null)}
                            onChange={this.onFileSelect}
                        />
                    </div>
                    <PlotToolBarButtons
                        tooltip={PLT_ZOOM_IN}
                        img={'../../images/chartIcons/PNG/Horizontal-zoom-in.png'}
                        clickHandler={this.handleClickZoomIn}
                        alt={'zoom-in'}
                        className={this.getButtonBackgroundForZooms(this.zoominButton)}
                        buttonId={'chart_toolbar_horizontal_zoom_in_button'}
                    />
                    <PlotToolBarButtons
                        tooltip={PLT_ZOOM_OUT}
                        img={'../../images/chartIcons/PNG/Horizontal-zoom-out.png'}
                        clickHandler={this.handleClickZoomOut}
                        alt={'zoom-out'}
                        className={this.getButtonBackgroundForZooms(this.zoomoutButton)}
                        buttonId={'chart_toolbar_horizontal_zoom_out_button'}
                    />
                    <PlotToolBarButtons
                        tooltip={PLT_VERTICAL_ZOOM}
                        img={'../../images/chartIcons/PNG/vertical-zoom-in.png'}
                        clickHandler={this.handleClickVerticalZoom}
                        alt={'vertical-zoom-in'}
                        className={this.getButtonBackgroundForZooms(this.verticalZoomButton)}
                        buttonId={'chart_toolbar_vertical_zoom_in'}
                    />
                    <PlotToolBarButtons
                        tooltip={PLT_VERTICAL_ZOOMOUT}
                        img={'../../images/chartIcons/PNG/vertical-zoom-out.png'}
                        clickHandler={this.handleClickVerticalZoomOut}
                        alt={'vertical-zoom-out'}
                        className={this.getButtonBackgroundForZooms(this.verticalZoomOutButton)}
                        buttonId={'chart_toolbar_vertical_zoom_out'}
                    />
                    <PlotToolBarButtons tooltip={PLT_RESET} img={'../../images/chartIcons/PNG/fit.png'} clickHandler={this.handleClickReset} alt={'fit'} buttonId={'chart_toolbar_fit_button'} />
                    <PlotToolBarButtons
                        tooltip={PLT_MOUSE_PAN}
                        img={'../../images/chartIcons/PNG/hand.png'}
                        clickHandler={this.handleClickPan}
                        alt={'hands'}
                        className={this.getButtonBackgroundForZooms(this.panButton)}
                        separtorClassName={'toolbar-btn-separtor'}
                        buttonId={'chart_toolbar_click_pan_button'}
                    />
                    <PlotToolBarButtons tooltip={PLT_PAN_LEFT} img={'../../images/chartIcons/PNG/move-left.png'} clickHandler={this.handlePanLeft} alt={'hands'} buttonId={'chart_toolbar_pan_left_button'} />
                    <PlotToolBarButtons
                        tooltip={PLT_PAN_RIGHT}
                        img={'../../images/chartIcons/PNG/move-right.png'}
                        clickHandler={this.handlePanRight}
                        alt={'pan-right'}
                        buttonId={'chart_toolbar_pan_right_button'}
                    />
                    <PlotToolBarButtons tooltip={PLT_PAN_TOP} img={'../../images/chartIcons/PNG/move-top.png'} clickHandler={this.handlePanTop} alt={'hands'} buttonId={'chart_toolbar_pan_top_button'} />
                    <PlotToolBarButtons
                        tooltip={PLT_PAN_BOTTOM}
                        img={'../../images/chartIcons/PNG/move-bottom.png'}
                        clickHandler={this.handlePanBottom}
                        alt={'hands'}
                        buttonId={'chart_toolbar_pan_bottom_button'}
                    />
                    <PlotToolBarButtons
                        tooltip={PLT_MERGE}
                        img={'../../images/chartIcons/PNG/merge.png'}
                        clickHandler={this.handleClickMerge}
                        alt={'merge'}
                        className={this.getButtonBackground(this.mergeButton)}
                        buttonId={'chart_toolbar_merge_button'}
                    />
                    <PlotToolBarButtons
                        tooltip={PLT_UNMERGE}
                        img={'../../images/chartIcons/PNG/unmerge.png'}
                        clickHandler={this.handleClickUnMerge}
                        alt={'unmerge'}
                        className={this.getButtonBackground(this.unMergeButton)}
                        buttonId={'chart_toolbar_unmerge_button'}
                    />
                    <PlotToolBarButtons
                        tooltip={PLT_HMARKER}
                        img={'../../images/chartIcons/PNG/enable-disable-signal-markers.png'}
                        clickHandler={this.horizontalMarker.bind(this)}
                        alt={'marker'}
                        className={chartstore.showVerticalBar ? 'plot-toolbar-img2' + ' ' + this.getButtonBackgroundForMarker(this.markerButton) : 'plot-toolbar-img2'}
                        buttonId={''}
                    />
                    <PlotToolBarButtons
                        tooltip={PLT_MASK}
                        img={'../../images/chartIcons/PNG/mask.png'}
                        clickHandler={this.handleMask}
                        alt={'mask'}
                        className={this.getButtonBackground(this.chartMask)}
                        buttonId={''}
                    />
                    <PlotToolBarButtons tooltip={PLT_SCREENSHOT} img={'../../images/chartIcons/PNG/screenshot.png'} buttonId={'btn_screenshot'} alt={'screenshot'} />
                </div>

                <div className='plotlive_btn_div' data-html2canvas-ignore='true'>
                    <div className='custom-dropdown-btn'>
                        <Button>
                            <div className='custom_dropdown_btn'>
                                {' '}
										Channels &nbsp; <img src='../../images/chartIcons/PNG/move-bottom.png' alt='dropdown' style={{ width: '15px' }} />
                            </div>
                            <div className='custom-dropdown-items-container hidden'>{listItems}</div>
                        </Button>
                    </div>
                    {mainstore.isPollingChecked ? (
                        <OverlayTrigger placement='auto' overlay={<Tooltip> {PLT_UNLIVE_UPDATES} </Tooltip>}>
                            <Button id='chart_toolbar_live_updates_button' className='plot-toolbar-btn2' onClick={this.togglePolling}>
                                <img src='../../images/chartIcons/PNG/unlive.png' alt='objects' className='plot-toolbar-live-updates-btn' />
                            </Button>
                        </OverlayTrigger>
                    ) : (
                            <OverlayTrigger placement='auto' overlay={<Tooltip> {PLT_LIVE_UPDATES} </Tooltip>}>
                                <Button id='chart_toolbar_unlive_updates_button' className='plot-toolbar-btn2' onClick={this.togglePolling}>
                                    <img src='../../images/chartIcons/PNG/Live.png' alt='objects' className='plot-toolbar-live-updates-btn' />
                                </Button>
                            </OverlayTrigger>
                        )}
                </div>
            </div>
        );
    }
}
export default PlotToolbar;