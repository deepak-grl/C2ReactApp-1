import * as Constants from '../Constants';
import { basemodal, mainstore } from './BaseModal';
import { chartstore } from './ChartStoreModal';
import { observe } from 'mobx';
import { mouseBusy, setPlotCursor, getVerticalMarkerTime, timeFormatter, scrollToPacket, setPlotButtonCursor_Wait, verticalZoomArea_CustomDiv } from '../utils';

const axios = require('axios');
const PLOT_POLLING_DELAY = 500;
const BACKEND_PATH = Constants.URL_base + 'Plot/';
var NUMBER_OF_LABELS = 10;
var chartAjaxModal = null;

export class ChartModal {
    constructor(chartWidth, chartAjaxModalObj) {
        chartAjaxModal = chartAjaxModalObj;
        this.resetPlot()
        this.onChangeFunctionRef = null;
        this.plotTimer = null;
        this.readStatusPoll = null;
        this.setChartWidth(chartWidth);
        this.radomNum = 0;
        this.ajaxCallInProgress = false;
        this.channelListCallInProgress = false;
        this.defaultMergeIndex = [[0], [1], [2], [3], [4], [5], [6], [7], [8], [9]];
        this.mergeIndex = this.defaultMergeIndex;
        this.mergedIndexArr = [[0, 3], [1, 4], [2, 5], [6, 7], [8], [9, 12], [10, 13], [11, 14], [15]];
        this.verticalZoom_MinMaxValArray = [];
        this.pannedPercentage = 0;
        this.isMaskActive = false;
        this.requestMessageDefault = mainstore.requestMessage;
        this.markerOneTime = 0;
        this.markerTwoTime = 0;
    }
    setMarkerTime(markerNum, newTimeVal) {
        console.log('markerNum, newTimeVal: ', markerNum, newTimeVal);
        if (newTimeVal >= 0) {
            if (Constants.MARKER_ONE === markerNum) {
                chartstore.markerCustomPositioningData.marker_1_PointInTime = newTimeVal;
            } else if (Constants.MARKER_TWO === markerNum) {
                chartstore.markerCustomPositioningData.marker_2_PointInTime = newTimeVal;
            }
        }
    }
    requestChartRerender() {
        chartstore.isChart_rerender = chartstore.isChart_rerender + 1;
    }
    resetPlot() {
        this.allChannels = [];
        this.cClinePacketsArray = [];
        this.packetDistanceMultiplier = 1;
        this.currentTool = Constants.MODE_CURSORE;
    }

    enableZoomInMode() {
        this.currentTool = Constants.MODE_ZOOM_IN;
    }
    enableZoomOutMode() {
        this.currentTool = Constants.MODE_ZOOM_OUT;
    }
    isPanMode() {
        return (this.currentTool === Constants.MODE_PAN);
    }
    enablePanMode() {
        this.currentTool = Constants.MODE_PAN;
    }

    paningRight() {
        let multiplier = ((chartstore.chartValues.endTimeZoom - chartstore.chartValues.startTimeZoom) * 10) / 100;
        let tempEndZoomTime = chartstore.chartValues.endTimeZoom + multiplier;
        let startTime;
        let endTime;
        if (tempEndZoomTime >= chartstore.absoluteStopTime) {
            if (chartstore.absoluteStopTime.toFixed(2) !== chartstore.signalFileStopTime.toFixed(2) && tempEndZoomTime <= chartstore.signalFileStopTime) {
                startTime = chartstore.chartValues.startTimeZoom + multiplier;
                endTime = chartstore.chartValues.endTimeZoom + multiplier;
                this.singlePlotDataCall(this.radomNum++, startTime, endTime);
            } else {
                let diffMultiplier = chartstore.absoluteStopTime - chartstore.chartValues.endTimeZoom;
                chartstore.chartValues.startTimeZoom = chartstore.chartValues.startTimeZoom + diffMultiplier;
                chartstore.chartValues.endTimeZoom = chartstore.chartValues.endTimeZoom + diffMultiplier;
            }
        } else if (tempEndZoomTime < chartstore.signalFileStopTime) {
            chartstore.chartValues.startTimeZoom = chartstore.chartValues.startTimeZoom + multiplier;
            chartstore.chartValues.endTimeZoom = chartstore.chartValues.endTimeZoom + multiplier;
        }
        chartstore.ccPacket.scrollToCCPacket = 0;
        scrollToPacket(0);
        this.requestChartRerender();
    }
    paningLeft() {
        let multiplier = ((chartstore.chartValues.endTimeZoom - chartstore.chartValues.startTimeZoom) * 10) / 100;
        let tempStartZoomTime = chartstore.chartValues.startTimeZoom - multiplier;
        let startTime;
        let endTime;
        if (tempStartZoomTime <= chartstore.absoluteStartTime) {
            if (chartstore.absoluteStartTime.toFixed(2) !== chartstore.signalFileStartTime.toFixed(2) && tempStartZoomTime >= chartstore.signalFileStartTime) {
                startTime = chartstore.chartValues.startTimeZoom - multiplier;
                endTime = chartstore.chartValues.endTimeZoom - multiplier;
                this.singlePlotDataCall(this.radomNum++, startTime, endTime);
            } else {
                let diffMultiplier = chartstore.chartValues.startTimeZoom - chartstore.absoluteStartTime;
                chartstore.chartValues.startTimeZoom = chartstore.chartValues.startTimeZoom - diffMultiplier;
                chartstore.chartValues.endTimeZoom = chartstore.chartValues.endTimeZoom - diffMultiplier;
            }
        } else if (tempStartZoomTime > chartstore.signalFileStartTime) {
            chartstore.chartValues.startTimeZoom = chartstore.chartValues.startTimeZoom - multiplier;
            chartstore.chartValues.endTimeZoom = chartstore.chartValues.endTimeZoom - multiplier;
        }
        chartstore.ccPacket.scrollToCCPacket = 0;
        scrollToPacket(0);
        this.requestChartRerender();
    }

    handleVerticleBar() {
        chartstore.showVerticalBar = !chartstore.showVerticalBar;
        this.currentTool = Constants.MODE_CURSORE;
    }

    plotReadyStatusPoll() {
        chartstore.isPlotDataLoading = true;
        mouseBusy(true);
        var me = this;
        if (me.readStatusPoll != null)
            clearInterval(this.readStatusPoll)

        me.readStatusPoll = setInterval(function () {
            chartAjaxModal.getSignalFileReadStatus();
            if (chartstore.signalFileReadStatus === Constants.READY || chartstore.signalFileReadStatus === Constants.ERROR) {
                clearInterval(me.readStatusPoll)
                chartAjaxModal.getChannelList()
                chartAjaxModal.getSignalFileStartTime();
                chartAjaxModal.getSignalFileStopTime(me.loadPlotData.bind(me));
            }
        }, 2000)
    }

    loadPlotData = () => {
        this.addChannels(chartstore.channelList.sort());
        chartstore.chartValues.startTimeZoom = chartstore.signalFileStartTime;  // 0;
        chartstore.chartValues.endTimeZoom = chartstore.signalFileStopTime;
        this.singlePlotDataCall(this.rand++);
        this.requestChartRerender();
        chartstore.isPlotDataLoading = false;
        mouseBusy(false);
    }

    calculateLableText(markerPoint, allChanelsArray, markerNum) {
        let ct = this.calculateTime(markerPoint);
        let stopTime = ct[0];
        let markerPercent = ct[1];
        let stopTimeText = timeFormatter(stopTime);
        if (markerNum == Constants.MARKER_ONE) {
            this.markerOneTime = stopTime;
        } else {
            this.markerTwoTime = stopTime;
        }
        var timeDiff = "\u0394T : " + Math.abs(((this.markerTwoTime - this.markerOneTime) * 1000)).toFixed(1) + 'ms';
        var text = "Time : " + stopTimeText + " / " + timeDiff + "\n";

        // sort based on voltage current group
        var sortedArrVC = Constants.SORTED_VOLTAGE_CURRENT_GROUP;
        this.allChannels.sort(function (a, b) {
            return sortedArrVC.indexOf(a.channelNumber) - sortedArrVC.indexOf(b.channelNumber);
        });

        var me = this;
        var previousChanelNum = -1;
        this.allChannels.map(function (channel) {
            if ((allChanelsArray.indexOf(channel.channelNumber)) !== -1) {
                var plotdata = channel.getPlotValues();
                var pointerDataindex = me.getPointerDataIndex(markerPercent, plotdata.series[1].length);   // Math.floor((markerPercent * plotdata.series[1].length) / 100);
                var chanelVal = plotdata.series[1][pointerDataindex];
                chanelVal = (isNaN(chanelVal) ? chanelVal : chanelVal.toFixed(3));
                chanelVal = (chanelVal === undefined ? ' ----- ' : chanelVal);          //while loading huge data value is displaying udefined.

                //let mergedIndexArr = [[0, 3], [1, 4], [2, 5], [6, 7], [8], [9, 12], [10, 13], [11, 14], [15]];
                let mergedIndexArr = [[3, 0, 12, 9], [4, 1, 13, 10], [5, 2, 14, 11], [6], [8], [7], [15]]; //combing the voltage and current channels   
                let voltageChanels = [0, 9, 1, 10, 2, 11, 8, 15];               //to add V || A symbol at end of values
                let voltageAndCurrentSeparator = [0, 1, 2, 9, 10, 11]    //@ Separator btwn voltage and current
                let portBSeperator = [12, 13, 14]                           //port A and B separator
                let labelColonSeperator = [3, 5, 4, 6, 7, 8]               //colon symbol after label separator

                if (previousChanelNum === -1) {
                    previousChanelNum = channel.channelNumber;
                }

                var temp;
                var checkArrayCombinationValues;

                checkArrayCombinationValues = mergedIndexArr.filter((ele) => {
                    return ele.includes(channel.channelNumber);     // && ele.includes(previousChanelNum)
                });

                var newline = false;
                if (checkArrayCombinationValues[0].includes(previousChanelNum)) {
                    newline = false;
                } else {
                    newline = true;
                }

                previousChanelNum = channel.channelNumber;
                text = text + '' + (newline == true ? '\n' : '') + (portBSeperator.includes(channel.channelNumber) ? ' / ' : '') + (voltageAndCurrentSeparator.includes(channel.channelNumber) ? ' @ ' : '') + Constants.GRAPH_MARKER_LABEL[channel.channelNumber] + (labelColonSeperator.includes(channel.channelNumber) ? ' : ' : '') + chanelVal + (voltageChanels.includes(channel.channelNumber) ? 'A' : 'V')   // + (newline == true ? '\n' : '')
            }
        });
        return text;
    }
    calculateTime(markerPoint) {
        var graphWidth = this.getDrawableAreaWidth();
        if (graphWidth > 0) {
            var newMarkerVal = markerPoint - Constants.GRAPH_YAXIS_WIDTH - Constants.GAP_BW_SPLITTER_CANVAS - 40;     //-canvas_OffsetLeft
            var markerPercent = newMarkerVal / graphWidth * 100;
            var stopTime = getVerticalMarkerTime(chartstore.chartValues.startTimeZoom, chartstore.chartValues.endTimeZoom, chartstore.absoluteStartTime, chartstore.absoluteStopTime, markerPercent);
            return [stopTime, markerPercent];
        } else {
            return [0, 0];
        }
    }

    convertTimeToPixel(time) {
        var graphWidth = this.getDrawableAreaWidth();
        var timeDiff = chartstore.chartValues.endTimeZoom - chartstore.chartValues.startTimeZoom;
        var markerValInPixel = ((time - chartstore.chartValues.startTimeZoom) / timeDiff) * graphWidth + Constants.CUSTOM_YAXIS_LABEL_WIDTH;
        return markerValInPixel;
    }

    getPointerDataIndex(markerPercentVal, totalPlotLength) {
        let multiplier = totalPlotLength / ((chartstore.absoluteStopTime) - (chartstore.absoluteStartTime));
        var xaxisStartIndex = Math.round(multiplier * ((chartstore.chartValues.startTimeZoom) - (chartstore.absoluteStartTime)));
        var xaxisEndIndex = Math.round(multiplier * ((chartstore.chartValues.endTimeZoom) - (chartstore.absoluteStartTime)));
        var zoomedPlotLength = xaxisEndIndex - xaxisStartIndex;
        var res = Math.floor((markerPercentVal * zoomedPlotLength) / 100) + xaxisStartIndex;
        return res;
    }

    setChartWidth(chartWidth) {
        this.currentDrawableAreaWidth = chartWidth;
    }
    removeChannels() {
        this.allChannels = [];
    }
    addChannels(numChannels) {
        var me = this;
        me.allChannels = []
        numChannels.forEach(function (channelNum) {
            me.allChannels.push(new Channel(channelNum, me));
        });
    }

    stopTimer() {
        if (this.plotTimer) {
            clearInterval(this.plotTimer);
            this.plotTimer = null;
        }
    }

    startTimer() {
        var me = this;
        var random = 1;

        this.stopTimer();// stop the previous one if it is already started
        this.plotTimer = setInterval(function () {
            me.singlePlotDataCall(random);
            random = random + 1;
        }, PLOT_POLLING_DELAY);
    }

    updateChannelList = () => {
        this.channelListCallInProgress = false;
        this.allChannels = []
        this.addChannels(chartstore.channelList.sort());
    }

    singlePlotDataCall(random, newStartTimeZoom, newEndTimeZoom) {
        //chartstore.isPlotDataLoading = true;
        var me = this;
        if (mainstore.status.appState !== Constants.BUSY) {
            this.stopTimer();
            setPlotButtonCursor_Wait(true);
            setPlotCursor(4);
        }
        //me.cClinePacketsArray = [];
        if (chartstore.channelList.length === 0 && this.channelListCallInProgress === false) {
            if (chartstore.channelList.length) {
                this.channelListCallInProgress = true;
            }
            setTimeout(() => {
                chartAjaxModal.getChannelList(this.updateChannelList.bind(this));
            }, 3000);
        }
        me.ajaxCallForAllSignals(me.calc_PacketDistanceMultiplier.bind(me), newStartTimeZoom, newEndTimeZoom)
        // me.allChannels.forEach(function (channel) {
        //     channel.ajaxCallForSignalPlot(me.calc_PacketDistanceMultiplier.bind(me), newStartTimeZoom, newEndTimeZoom);       //passing callbackFn to set packetDistanceMultiplier.
        // });
        me.ajaxCallForCCData();
        if (me.onChangeFunctionRef) {
            me.onChangeFunctionRef(random);
        }
    }

    plotPath(start, end) {
        var path = BACKEND_PATH + 'GetAllChannelData'
            + '?startTime=' + start
            + '&stopTime=' + end
            + '&numberOfSamples=' + 2000;
        return path;
    }

    ajaxCallForAllSignals(callback, newStartTimeZoom = chartstore.chartValues.startTimeZoom, newEndTimeZoom = chartstore.chartValues.endTimeZoom) {
        if (this.ajaxCallInProgress)
            return;
        this.ajaxCallInProgress = true;

        var firstGet = null;
        if (mainstore.status.appState === Constants.BUSY) {
            firstGet = this.plotPath(0, 0);
        }
        else {
            //firstGet = this.plotPath(chartstore.chartValues.startTimeZoom, chartstore.chartValues.endTimeZoom);
            firstGet = this.plotPath(newStartTimeZoom, newEndTimeZoom);
        }
        var me = this;

        fetch(firstGet)
            .then(res => {
                return res.json();
            })
            .then((response) => {

                chartAjaxModal.setChartStartEnd(newStartTimeZoom, newEndTimeZoom);

                me.ajaxCallInProgress = false;
                if (response) {
                    // me.plotData = response.data;               

                    var absoluteStartTime, absoluteStopTime;
                    me.allChannels.forEach(function (channel) {
                        if (response[channel.channelNumber].absoluteEndTime) {
                            channel.plotData = response[channel.channelNumber]
                            if (channel.plotData) {
                                absoluteStartTime = channel.plotData.absoluteStartTime * 10E-9;
                                absoluteStopTime = channel.plotData.absoluteEndTime * 10E-9;
                            }
                            else
                                return;
                        }
                        else
                            return;

                    });
                    if (response[me.allChannels[0].channelNumber].displayDataChunk.length === 0 && chartstore.AppState == Constants.READY) {
                        var toast = new toastNotification("Zoom limit reached or No signal data received to plot", Constants.TOAST_ERROR, 5000)
                        toast.show()
                    }
                    if (absoluteStartTime && absoluteStopTime) {
                        chartstore.absoluteStartTime = absoluteStartTime;
                        chartstore.absoluteStopTime = absoluteStopTime;
                    }
                    callback();
                    this.requestChartRerender();
                    if (mainstore.status.appState === Constants.READY) {
                        setPlotCursor(this.currentTool);
                    }


                }
                setPlotButtonCursor_Wait(false);
            }).catch(error => {
                console.log("Ajax call-1 Error-" + firstGet + error);
                me.ajaxCallInProgress = false;
                setPlotButtonCursor_Wait(false);
            });

    }

    ajaxCallForCCData() {
        if (this.cclineAjaxCallInProgress)
            return;
        this.cclineAjaxCallInProgress = true;
        // var len = (this.cClinePacketsArray) ? this.cClinePacketsArray.length : 0;
        var ccPath = BACKEND_PATH + 'GetCCLinePackets?stopTime=' + 0 + '&lastPacketIndex=' + 0;
        var me = this;
        //axios.get(ccPath)
        fetch(ccPath)
            .then(res => {
                return res.json();
            })
            .then((response) => {
                me.setCCPacketData(response);       //( me.cClinePacketsArray.concat(response.data) );
                this.cclineAjaxCallInProgress = false;
            }).catch(error => {
                console.log("Ajax CC call-1 Error-" + ccPath + error);
                this.cclineAjaxCallInProgress = false;
            });
    }

    getChannel(index) {
        return this.allChannels[index];
    }

    onChangeListener(funcRef) {
        this.onChangeFunctionRef = funcRef;
    }

    getLabels() {
        return this.allChannels[0].getLabels();
    }

    getTestChannel() {
        if (this.allChannels.length > 0)
            return this.allChannels[0];
        return null;
    }

    setCCPacketData(_ccLinePackets) {
        var arrlen = _ccLinePackets.length;
        // if (arrlen > 0) {                                     //                  IMP : when we ran multiple testcase Results will have older testcase ccPacket data.

        this.calc_PacketDistanceMultiplier();
        var i;
        for (i = 0; i < arrlen; i++) {
            _ccLinePackets[i].id = 'ccLinePacketID_' + i;
            _ccLinePackets[i].xaxisLocation = this.packetDistanceMultiplier * _ccLinePackets[i].startTime;
        }
        if (mainstore.status.appState === Constants.BUSY) {
            mainstore.currentpacketIndex = arrlen
        }
        this.cClinePacketsArray = _ccLinePackets;
        //console.log('RESPONSE :::', this.cClinePacketsArray)
        this.requestChartRerender();  //CCpacket to Rerender
        //}
    }

    calc_PacketDistanceMultiplier() {
        var channel = this.getTestChannel();
        if (channel && channel.plotData) {            //channel.plotData !== null
            var startTime = (channel.plotData.startDataLongTime * 10e-9);   //(channel.plotData.absoluteStartTime * 10e-9);
            var endTime = (channel.plotData.endDataLongTime * 10e-9);     //(channel.plotData.absoluteEndTime * 10e-9);
            if (mainstore.status.appState === Constants.BUSY) {

                startTime = (channel.plotData.absoluteStartTime * 10e-9);
                endTime = (channel.plotData.absoluteEndTime * 10e-9);
            }

            let diff = endTime - startTime;
            if (diff > 0) {
                this.packetDistanceMultiplier = this.currentDrawableAreaWidth / (diff);
                chartstore.isPlotDataLoading = false;
                //this.requestChartRerender();
            }
        }
    }

    getCCPacketData() {
        return this.cClinePacketsArray;
    }

    updateYaxisNewMinMaxValue(chart) {
        var oldMaxval = chart.options.scales.yAxes[0].ticks.max;
        var oldMinVal = chart.options.scales.yAxes[0].ticks.min;
        var chartNumber = chart.options.chartNumber;

        var newYaxisMax = oldMaxval;
        var newYaxisMin = oldMinVal;

        if (this.verticalZoom_MinMaxValArray) {
            var filteredArray = this.verticalZoom_MinMaxValArray.filter(function (ele) {
                return ele.chartNumber !== chartNumber;
            });
            this.verticalZoom_MinMaxValArray = filteredArray;
        }
        // if(oldMinVal < chart.options.low){
        //     newYaxisMin = chart.options.low;
        //     newYaxisMax = chart.options.high;
        // }
        this.verticalZoom_MinMaxValArray.push({ 'chartNumber': chartNumber, 'yaxisMin': newYaxisMin, 'yaxisMax': newYaxisMax, 'high': chart.options.high, 'low': chart.options.low });
    }

    zoomOrPan(x1, y1, x2, y2, chart) {
        var plotStartTime = chartstore.chartValues.startTimeZoom;
        var plotStopTime = chartstore.chartValues.endTimeZoom;
        var timePrePixel = (plotStopTime - plotStartTime) / this.getDrawableAreaWidth();

        var sx1 = x1;
        var sx2 = x2;
        var startZoomIn, endZoomIn;

        if (this.currentTool === Constants.MODE_ZOOM_IN) {
            startZoomIn = plotStartTime + (sx1 * timePrePixel)
            endZoomIn = plotStartTime + (sx2 * timePrePixel)
        }
        //CODE FOR VERTICAL ZOOM
        else if (this.currentTool === Constants.MODE_VERTICAL_ZOOM) {
            this.updateYaxisNewMinMaxValue(chart);              // update Yaxis min and max value (got from chartInstance)
            this.requestChartRerender();        //No ajax call to rerender.
        }
        else {

            if (plotStartTime === 0 && plotStopTime === chartstore.signalFileStopTime) {
                return;//If full signal is visible don't pan
            }

            var isRightPan = false;
            var delta = Math.abs(x2 - x1);
            if (x1 > x2)
                isRightPan = true;
            if (isRightPan === true) {
                startZoomIn = plotStartTime + (delta * timePrePixel)
                endZoomIn = plotStopTime + (delta * timePrePixel)
            }
            else {
                startZoomIn = plotStartTime - (delta * timePrePixel)
                endZoomIn = plotStopTime - (delta * timePrePixel)
            }

            if (startZoomIn < 0)
                startZoomIn = chartstore.absoluteStartTime;  // 0;
            if (endZoomIn > chartstore.signalFileStopTime)
                endZoomIn = chartstore.signalFileStopTime
        }

        if (startZoomIn < endZoomIn) {
            //chartAjaxModal.setChartStartEnd(startZoomIn, endZoomIn);
            this.singlePlotDataCall(this.radomNum++, startZoomIn, endZoomIn);
        }
        //this.requestChartRerender();
        scrollToPacket(chartstore.ccPacket.scrollToCCPacket);
    }
    panning(startX, mouseOut = false, chart) {
        let plotStartTime = chartstore.chartValues.startTimeZoom;
        let plotEndTime = chartstore.chartValues.endTimeZoom;
        let absoluteStartTime = chartstore.absoluteStartTime;
        let absoluteEndTime = chartstore.absoluteStopTime;
        let plotGraphWidth = this.getDrawableAreaWidth();
        let diff = (startX / plotGraphWidth) * (plotEndTime - plotStartTime);
        var newZoomStartTime = plotStartTime - diff;
        var newZoomEndTime = plotEndTime - diff;
        var callAjaxFn = true;

        if (chart) {
            this.updateYaxisNewMinMaxValue(chart);              // update Yaxis min and max value (got from chartInstance)
        }

        //Call AJax only when user pan more than 30%.
        var panPercentage = (diff / (plotEndTime - plotStartTime)) * 100;
        if (mouseOut === true) {
            this.pannedPercentage = this.pannedPercentage + panPercentage;
        }
        if (Math.abs(this.pannedPercentage) < 30) {
            callAjaxFn = false;
            setPlotCursor(this.currentTool);
        }

        if (newZoomStartTime < absoluteStartTime || newZoomEndTime > absoluteEndTime || mouseOut === true) {
            if (newZoomStartTime < chartstore.signalFileStartTime) {           // if new Start val is lesser than min value.
                newZoomStartTime = chartstore.signalFileStartTime;
                newZoomEndTime = plotEndTime - (plotStartTime - chartstore.signalFileStartTime);
            }
            if (newZoomEndTime > chartstore.signalFileStopTime) {              // if new End val is grater than max value.
                newZoomEndTime = chartstore.signalFileStopTime;
                newZoomStartTime = plotStartTime + (chartstore.signalFileStopTime - plotEndTime);
            }
            chartAjaxModal.setChartStartEnd(newZoomStartTime, newZoomEndTime);

            if (callAjaxFn) {
                this.pannedPercentage = 0;
                this.singlePlotDataCall(this.radomNum++);
            } else {
                this.requestChartRerender();
            }
        }
    }
    getDrawableAreaWidth() {
        var Canvas = document.getElementsByTagName('canvas');
        if (Canvas.length > 0) {
            var drawableWidth = Canvas[0].offsetWidth - Constants.GRAPH_YAXIS_WIDTH;
            return drawableWidth;
        } else {
            return document.getElementsByClassName('css-y1c0xs')[0].offsetWidth - Constants.GRAPH_YAXIS_WIDTH - Constants.CUSTOM_YAXIS_LABEL_WIDTH - Constants.MARGIN_BORDER_PADDING_AND_SCROLLBAR_CCPACKET;
            // minus (-16) because it includes scrollbar width and (-10) paddings. => -26
        }
    }
    getDrawableAreaHeight() {
        var Canvas = document.getElementsByTagName('canvas');
        if (Canvas.length > 0) {
            var drawableHeight = Canvas[0].offsetHeight - 12;   // padding top and bottom is 12.
            return drawableHeight;
        }
    }
}
// -------------------------------------------------------  CHANNEL CLASS ------------------------------
const MAX_BUFFER_SIZE = 2000;
var isPanModeActive = false;
var startX_val = null;
class Channel {
    constructor(number, chartModal) {
        this.channelNumber = number;
        this.dummyPlotData = Array(MAX_BUFFER_SIZE).fill(0);
        this.labelsArray = Array(MAX_BUFFER_SIZE).fill('a');
        this.plotData = null;
        this.cclineAjaxCallInProgress = false;
        this.ajaxCallInProgress = false;
        //this.mergeIndex = [[0], [1], [2], [3], [4], [5], [6], [7], [8], [9]];           //[[0, 4, 3, 8], [1, 2, 6], [5, 7]];
        //this.mergedIndexArr =  [[0, 3], [1, 4], [2, 5], [6, 7], [8], [9, 12], [10, 13], [11, 14], [15]];
        this._chartInstance = null;
        this._chartModal = chartModal;
    }
    setChartInstance(chartInstance) {
        this._chartInstance = chartInstance;
    }

    mouseUpHandlerPan(event) {
        if (isPanModeActive === true && startX_val !== null) {
            setPlotCursor(4);
            chartAjaxModal.chartModal.panning(startX_val, true);
            startX_val = null;
            //setPlotCursor(3);           // When drag outside the canvas and mouseOut this will not trigger.
        }
    }
    isDummy() {
        return (this.channelNumber < 0) ? true : false;
    }


    getLabels() {
        var labels = [];
        var startTime;
        var endTime;
        if (this.plotData) {
            if (mainstore.status.appState === Constants.READY) {  //offline mode (dont roundoff time scale)
                startTime = chartstore.chartValues.startTimeZoom;
                endTime = chartstore.chartValues.endTimeZoom;
            } else {          //Online mode (round down (floor) time scale)
                startTime = Math.floor(this.plotData.absoluteStartTime * 10e-9);
                endTime = Math.floor(this.plotData.absoluteEndTime * 10e-9);
            }

            var diff = endTime - startTime;

            var sliceVal = 0;
            if (diff < 0.10) {
                NUMBER_OF_LABELS = 5;
                sliceVal = -4;
            } else {
                NUMBER_OF_LABELS = 10;
                sliceVal = -9;
            }

            var lineDiff = (diff / NUMBER_OF_LABELS);       //.toFixed(toFixedVal)
            for (var v = 0; v <= NUMBER_OF_LABELS; v++) {
                if (endTime !== 0) {                // sometimes endTime startTime value will be zero.
                    var val = parseFloat(startTime) + parseFloat(lineDiff * v);
                    val = timeFormatter(val).slice(0, sliceVal);
                    labels.push(val);
                }
            }
        }
        return labels;
    }

    getPlotValues() {
        var plotVals = [];
        if (this.plotData) {
            plotVals = this.plotData.displayDataChunk;
        }
        return {
            series: [this.dummyPlotData, plotVals]
        };
    }

    getXaxisMinVal(plotData) {
        if (plotData) {
            var multiplier = plotData.displayDataChunk.length / ((plotData.absoluteEndTime * 10e-9) - (plotData.absoluteStartTime * 10e-9));
            var xaxisMin = multiplier * ((chartstore.chartValues.startTimeZoom) - (plotData.absoluteStartTime * 10e-9));
            if (chartstore.chartValues.endTimeZoom === 0 || xaxisMin < 0) {
                xaxisMin = 0;
            }
            return Math.round(xaxisMin);
        }
        else return 0;
    }

    getXaxisMaxVal(plotData) {
        if (plotData) {
            var multiplier = plotData.displayDataChunk.length / ((plotData.absoluteEndTime * 10e-9) - (plotData.absoluteStartTime * 10e-9));
            var xaxisMax = multiplier * ((chartstore.chartValues.endTimeZoom) - (plotData.absoluteStartTime * 10e-9));
            if (chartstore.chartValues.endTimeZoom === 0) {
                xaxisMax = plotData.displayDataChunk.length - 1;
            }
            return Math.round(xaxisMax);
        }
        else return 0;
    }

    getOptions(drawWidth, display, chartModal, index, hideZoomRect) {
        var minVal = (this.plotData) ? this.plotData.yaxisMin : 0;
        var maxVal = (this.plotData) ? this.plotData.yaxisMax : 0;
        var xasisMinVal = (this.plotData !== null && mainstore.status.appState === Constants.READY) ? this.getXaxisMinVal(this.plotData) : null;
        var xaxisMaxVal = (this.plotData !== null && mainstore.status.appState === Constants.READY) ? this.getXaxisMaxVal(this.plotData) : null;

        var stepSize;
        if (minVal >= 0) {
            stepSize = (maxVal - minVal) / 4;
        } else {
            stepSize = (maxVal - 0) / 3;
        }
        var chartMode = 'xy';
        if (chartModal.currentTool === Constants.MODE_VERTICAL_ZOOM) {
            var chartMode = 'y';
            verticalZoomArea_CustomDiv(Constants.GRAPH_YAXIS_WIDTH, chartModal.currentTool === Constants.MODE_VERTICAL_ZOOM);       //if this => (chartModal.currentTool === Constants.MODE_VERTICAL_ZOOM) => returns true or false.
        } else {
            verticalZoomArea_CustomDiv(Constants.GRAPH_YAXIS_WIDTH, chartModal.currentTool === Constants.MODE_VERTICAL_ZOOM);
        }

        var options = {
            width: drawWidth,
            height: '230px',
            high: (this.plotData) ? this.plotData.yaxisMax : 0,                 //constants after vertical zoom.
            low: (this.plotData) ? this.plotData.yaxisMin : 0,
            showPoint: false,
            lineSmooth: false,
            animation: false,
            legend: {
                display: false,
            },
            tooltips: {
                enabled: false
            },
            elements: {
                point: {
                    radius: 0
                },
            },
            maintainAspectRatio: false,             // added to control chart height.
            hideZoomRectangle: hideZoomRect,
            scales: {
                xAxes: [{
                    type: "time",
                    time: {
                        /*unit: 'millisecond',*/
                        displayFormats: {
                            millisecond: 'SSS'
                        },
                        min: xasisMinVal,
                        max: xaxisMaxVal,
                    },
                    display: false,
                    scaleLabel: {
                        display: display,
                    },
                    ticks: {
                        min: xasisMinVal,
                        max: xaxisMaxVal,
                        autoSkip: true,
                        maxTicksLimit: 10,
                        maxRotation: 360,
                        minRotation: 360

                    },
                    gridLines: {
                        color: '#292626'
                    }

                }
                ],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: false,
                        labelString: Constants.GRAPH_YAXIS_LABEL[this.channelNumber],       //IMP accessing this from chart/index.js 
                        fontColor: Constants.GRAPH_COLOR[this.channelNumber],
                        //fontSize: 15,
                        //fontStyle: "bold",
                        //padding: 20
                    },
                    ticks: {
                        min: minVal,
                        max: maxVal,
                        fontColor: '#e6e1e1',
                        stepSize: stepSize,
                        userCallback: function (label, index, labels) {
                            return label.toFixed(1);
                        }
                    },
                    gridLines: {
                        color: '#292626',
                        borderDash: [8, 4],
                    },
                    afterFit: function (scaleInstance) {
                        scaleInstance.width = Constants.GRAPH_YAXIS_WIDTH; // sets the width to 70px
                    }

                }]
            },
        };

        options.plugins = {
            zoom: {
                zoom: {
                    enabled: true,
                    drag: true,
                    mode: chartMode,
                    drag: {
                        backgroundColor: 'transparent',
                    },
                    onZoom: function ({ chart: chart }, actualStartPoint, actualEndPoint, margins) {
                        chartModal.zoomOrPan(actualStartPoint.x, actualStartPoint.y, actualEndPoint.x, actualEndPoint.y, chart);
                    },
                }
            }
        };

        if (chartModal.currentTool === Constants.MODE_PAN) {
            isPanModeActive = true;

            options.plugins.zoom.pan = {
                enabled: true,
                mode: "xy",          // "x"
                speed: 10,
                threshold: 10,
                step: 2, panAdjuster: 3,
                onPan: function ({ chart: chartInstance }, deltaX, deltaY, startX, startY, endX, endY) {
                    chartModal.panning(startX, false, chartInstance);
                    //setPlotCursor(4);
                    startX_val = startX;
                }
            };

            if (options.plugins.zoom && options.plugins.zoom.zoom) {
                options.plugins.zoom.zoom.drag = false;
            }
        } else { //if(chartModal.currentTool === Constants.MODE_VERTICAL_ZOOM){
            isPanModeActive = false;
            options.plugins.zoom.pan = {
                enabled: false,
            }
            /*if (options.plugins.zoom && options.plugins.zoom.zoom) {
                options.plugins.zoom.zoom.drag = true;
            }*/
            //delete options['pan'];
        }
        return options;
    }
}