import React from 'react';
import { ChartModal } from '../../modals/ChartModal';
import FlexView from 'react-flexview/lib';
import { Line } from 'react-chartjs-2';
import * as zoom from 'chartjs-plugin-zoom';
import { observer } from 'mobx-react';
import { observe } from 'mobx';
import { basemodal, mainstore } from '../../ViewModel/BaseModal';
import { chartstore, chartAjaxModal } from '../../modals/ChartStoreModal';
import * as Constants from '../../Constants';
import 'react-table/react-table.css'
import { CcPacket } from './CcPacket';
import '../../css/chart.css';
import { customNavbarOnSpitterMoves } from '../../utils/index';

var chartModal = null;
var drawWidth = 0;
const VERTICAL = 'vertical';
var previousChanelLen = 0;
export class Chart extends React.Component {
    constructor(props) {
        super(props);
        chartModal = chartAjaxModal.chartModal = basemodal.chartModal = new ChartModal(window.innerWidth - 200, chartAjaxModal);
        drawWidth = chartModal.currentDrawableAreaWidth + 'px';
        this.chartRef = React.createRef();
        this.CcPacket = React.createRef();
        this.state = {
            currentSelectedRow: null,
            packetBackgroundColor: null,
            isChartRedrawRequired: false,
        };

        var me = this;
        chartModal.onChangeListener(function (random) {
            me.setState({
                currentEndTime: random
            });
        });

        // when chart enable/disable selected redraw all charts to adjust height.
        const disposer = observe(chartstore, "allSelectedChanelNumbers", (change) => {
            me.setState({ isChartRedrawRequired: true });
            const disposer2 = chartstore.allSelectedChanelNumbers.map((ele, i) => {
                observe(ele, "isChecked", (change) => {
                    me.setState({ isChartRedrawRequired: true });
                });
            });
        });
    }

    initializeChartDataSetObject(data, chartColor, labelName) {
        return {
            label: labelName,
            fill: false,
            lineTension: 0,
            lineThickness: 0.01,
            radius: 3,
            borderWidth: 1,
            backgroundColor: "red",
            borderColor: chartColor,
            borderCapStyle: "round",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: "red",
            pointBackgroundColor: "red",
            pointBorderWidth: 0.05,
            pointHoverRadius: 0.05,
            pointHoverBackgroundColor: "red",
            pointHoverBorderColor: "red",
            pointHoverBorderWidth: 0.05,
            pointRadius: 0,
            pointHitRadius: 0.05,
            showPoint: false,
            data: data
        };
    }
    getmaskDatasets(index, newMaxVal, labelEmptyArrLen, plotLineDataset, chanel_number) {
        if (chartModal.isMaskActive === false || chartstore.AppState === Constants.BUSY || chanel_number !== 3 || !chartstore.maskUpper_LowerPoints.upperMask_points || chartAjaxModal.chartModal.mergeIndex === chartAjaxModal.chartModal.mergedIndexArr || chartstore.maskUpper_LowerPoints.lowerMask_points.length === 0) {
            return plotLineDataset;
        }

        if (chanel_number === 3) {
            var bottomMaskArr = chartstore.maskUpper_LowerPoints.lowerMask_points;       //[{ x: 0, y: 0 }, { x: 12.5, y: 0 }, { x: 25, y: 2 }, { x: 30, y: 0.2 }, { x: 50, y: 0.4 }, { x: 55, y: 2 }, { x: 80, y: 0.4 }, { x: 92, y: 0.1 }, { x: 110, y: 1.5 }];
            var topMaskArr = chartstore.maskUpper_LowerPoints.upperMask_points;      //[{"x":"3.35","y":"4.75000000"},{"x":"9.31919568","y":"5.25000000"},{"x":"9.31919568","y":"5.25000000"},{"x":"9.86919568","y":"4.75000000"},{"x":"16.09891198","y":"5.25000000"}];        //[{ x: 0, y: 0.5 }, { x: 12.5, y: 0.5 }, { x: 25, y: 2.9 }, { x: 30, y: 0.7 }, { x: 50, y: 1.0 }, { x: 55, y: 2.9 }, { x: 80, y: 0.8 }, { x: 92, y: 0.5 }, { x: 110, y: 3 }];
            if (topMaskArr[0] && topMaskArr[0].x !== 0) {
                bottomMaskArr.unshift({ x: 0, y: -1 }, { x: bottomMaskArr[0].x, y: 0 });   // x value 0 must required.
                //bottomMaskArr.unshift({ x: bottomMaskArr[1].x, y: 0 });   // x value 0 must required.
                topMaskArr.unshift({ x: 0, y: topMaskArr[0].y }, { x: topMaskArr[0].x, y: topMaskArr[0].y });
                //topMaskArr.unshift({ x: topMaskArr[1].x, y: topMaskArr[1].y });   // added bcz both top and bottom array should have equal length. (we are adding this => { x: 0, y: -1 } (extra))
                bottomMaskArr.push({ x: chartstore.chartValues.endTimeZoom, y: bottomMaskArr[bottomMaskArr.length - 1].y });   // x value "lastpoint" must required.
                topMaskArr.push({ x: chartstore.chartValues.endTimeZoom, y: topMaskArr[topMaskArr.length - 1].y });
            }
            var newBottomArr = this.getConvertedArray_TimeToIndex_MaskPoints(bottomMaskArr, labelEmptyArrLen);
            var newTopArr = this.getConvertedArray_TimeToIndex_MaskPoints(topMaskArr, labelEmptyArrLen);
            var plotLineDataset_copy = Object.assign({}, plotLineDataset);
            // new array to show line red if it crosses mask.
            var plotDataset_with_crossedLine = this.splitlineWhenCrossesMask(newTopArr, newBottomArr, plotLineDataset_copy);

            //Get new max value for uppermask upper straigth line.
            var maskMaxValue = Math.max.apply(Math, newTopArr.map(function (ele) { return ele.y; }));
            if (maskMaxValue < newMaxVal) {
                maskMaxValue = newMaxVal;
            }
            //console.log(maskMaxValue, '=>', JSON.stringify(newTopArr), '::', newMaxVal)
            //console.log("maskUpper_LowerPoints", '=>', JSON.stringify(chartstore.maskUpper_LowerPoints.lowerMask_points), ':upperMask_points:', JSON.stringify(chartstore.maskUpper_LowerPoints.upperMask_points));

            //        console.log('XXXXXXX', JSON.stringify(plotLineDataset.data), '::', JSON.stringify(plotDataset_with_crossedLine[0].data), ':::', JSON.stringify(plotDataset_with_crossedLine[1].data))

            /*for (var i = 0; i < plotLineDataset_copy.data.length; i++) {
                console.log(i, '=>', plotLineDataset_copy.data[i], ':', plotDataset_with_crossedLine[0].data[i], ':', plotDataset_with_crossedLine[1].data[i])
            }*/

            return [
                plotDataset_with_crossedLine[1],
                plotDataset_with_crossedLine[0],
                {
                    label: "mask-down-dataset-" + index,
                    backgroundColor: "rgba(255,255,255, 0.25)",
                    borderColor: "rgba(255,255,255, 0.25)",
                    borderWidth: 1,
                    lineTension: 0,
                    data: newBottomArr,
                },
                {
                    label: "mask-top-dataset-" + index,
                    backgroundColor: "black",
                    borderColor: "rgba(252,255,255,0.25)",
                    borderWidth: 1,
                    lineTension: 0,
                    data: newTopArr,
                },
                {
                    label: "mask-fixedtop-dataset-" + index,
                    backgroundColor: "rgba(255,255,255,0.25)",
                    borderColor: "rgba(255,255,255,0.25)",
                    borderWidth: 1,
                    data: [{ x: 0, y: maskMaxValue + 0.15 }, { x: labelEmptyArrLen, y: maskMaxValue + 0.15 }]
                    //data: [{ x: 0, y: newMaxVal }, { x: labelEmptyArrLen, y: newMaxVal }]
                }
            ]
        }
    }

    splitlineWhenCrossesMask(newTopArr_param, newBottomArr_param, plotLineDataset) {
        var newBottomArr = Object.assign({}, newBottomArr_param);
        var newTopArr = Object.assign({}, newTopArr_param);
        var plotLineDataArr = plotLineDataset.data;
        var newPlotlineDataset = [];
        var newLineCrossed = [];
        var n = 0;
        var previousLineState = "NOTCROSSED";           //if point is between mask and ouside mask push crossedLinePoint to both array (newPlotlineDataset, newLineCrossed)
        for (var i = 0; i < plotLineDataArr.length; i++) {

            var multiplier_top = (newTopArr[n + 1].y - newTopArr[n].y) / (newTopArr[n + 1].x - newTopArr[n].x);
            var multiplier_bottom = (newBottomArr[n + 1].y - newBottomArr[n].y) / (newBottomArr[n + 1].x - newBottomArr[n].x);

            //console.log("multiplier_bottom", i, multiplier_bottom, newBottomArr[n + 1].y - newBottomArr[n].y, newBottomArr[n + 1].x - newBottomArr[n].x);
            //console.log("multiplier_top", i, multiplier_top, newTopArr[n + 1].y - newTopArr[n].y, newTopArr[n + 1].x - newTopArr[n].x);

            if (!isFinite(multiplier_bottom) || isNaN(multiplier_bottom)) {
                multiplier_bottom = 0;
            }
            if (!isFinite(multiplier_top) || isNaN(multiplier_top)) {
                multiplier_top = 0;
            }

            var yVal_for_index_point_top = (parseFloat(i - newTopArr[n].x) * multiplier_top) + parseFloat(newTopArr[n].y);
            var yVal_for_index_point_bottom = (parseFloat(i - newBottomArr[n].x) * multiplier_bottom) + parseFloat(newBottomArr[n].y);

            var tempLineState = previousLineState;

            if (plotLineDataArr[i] < yVal_for_index_point_top && plotLineDataArr[i] > yVal_for_index_point_bottom) {
                newPlotlineDataset.push(plotLineDataArr[i]);
                newLineCrossed.push(null);
                previousLineState = "NOTCROSSED";
            } else if (plotLineDataArr[i] > yVal_for_index_point_top || plotLineDataArr[i] < yVal_for_index_point_bottom) {
                newPlotlineDataset.push(null);
                newLineCrossed.push(plotLineDataArr[i]);
                previousLineState = "CROSSED";
            }

            //console.log('previousLineState: ', i, previousLineState, yVal_for_index_point_bottom, plotLineDataArr[i], yVal_for_index_point_top, '::', yVal_for_index_point_top, plotLineDataArr[i], yVal_for_index_point_bottom)

            if (plotLineDataArr[i + 1] !== undefined && tempLineState !== previousLineState) {  // && newBottomArr[n].x !== newBottomArr[n + 1].x) {              // undefined is IMP (if point is zero it will be false).
                var newCreatedPoint = null;                                                                                         // if next point is present
                if ((yVal_for_index_point_top < plotLineDataArr[i - 1] && yVal_for_index_point_top > plotLineDataArr[i]) || (yVal_for_index_point_top > plotLineDataArr[i - 1] && yVal_for_index_point_top < plotLineDataArr[i])) {                   //if upper mask is between two points  
                    newCreatedPoint = yVal_for_index_point_top;
                } else if ((yVal_for_index_point_bottom < plotLineDataArr[i - 1] && yVal_for_index_point_bottom > plotLineDataArr[i]) || (yVal_for_index_point_bottom > plotLineDataArr[i - 1] && yVal_for_index_point_bottom < plotLineDataArr[i])) {       //if lower mask is between two points 
                    newCreatedPoint = yVal_for_index_point_bottom;
                }
                newPlotlineDataset[i] = newCreatedPoint;
                newLineCrossed[i] = newCreatedPoint;
            }

            // if Straight vertical line (|) arrives (eg: ({x:500, y:5},{x:500, y:10})) i need to neglect bcz in above if condition [i] and [i+1] will be same.
            if (newTopArr[n].x === newTopArr[n + 1].x && newTopArr[n].y !== newTopArr[n + 1].y) {
                newPlotlineDataset[i] = plotLineDataArr[i];
                newLineCrossed[i] = null;
            }
            // if(newBottomArr[n].x === newBottomArr[n+1].x && newBottomArr[n].y !== newBottomArr[n+1].y){
            //     newPlotlineDataset[i] = plotLineDataArr[i];
            //     newLineCrossed[i] = null;
            // }

            if (newTopArr[n + 1].x <= i) {
                if (newTopArr[n + 2]) {
                    n = n + 1;
                }
            }
        }
        // create new chart object for normal and empty line.
        plotLineDataset.data = newPlotlineDataset;
        var crossedLine = Object.assign({}, plotLineDataset);;
        crossedLine.data = newLineCrossed;
        crossedLine.borderColor = "red";
        crossedLine.label = "chart-crossed-line";
        return ([
            plotLineDataset,
            crossedLine
        ])
    }

    getConvertedArray_TimeToIndex_MaskPoints(maskArray, labelEmptyArrLen) {
        var multiplier = labelEmptyArrLen / (chartstore.absoluteStopTime - chartstore.absoluteStartTime);
        var convertedArray = [];
        var before_XYvalZoomStart = 0;
        var after_XYvalZoomStart = 0;
        var before_XYvalZoomEnd = 0;
        var after_XYvalZoomEnd = 0;
        //convertedArray.push({ x: 0, y: maskArray[0].y });       // x value 0 must required.
        for (var i = 0; i < maskArray.length; i++) {
            var xval = maskArray[i].x;
            var new_xVal = Math.round((xval - chartstore.absoluteStartTime) * multiplier);
            if (new_xVal >= 0 && new_xVal <= labelEmptyArrLen) {
                convertedArray.push({ x: new_xVal, y: maskArray[i].y });
            }
        }

        //add new (x,y) valuse to array when its zoomed(if there is no point)
        for (var i = 0; i < maskArray.length; i++) {
            if (chartstore.absoluteStartTime > maskArray[i].x) {
                before_XYvalZoomStart = maskArray[i];
                after_XYvalZoomStart = maskArray[i + 1];
            }
            if (chartstore.absoluteStopTime < maskArray[i].x && before_XYvalZoomEnd === 0) {
                after_XYvalZoomEnd = maskArray[i];
                before_XYvalZoomEnd = maskArray[i - 1];
            }
        }
        if (!after_XYvalZoomStart) {
            return null;
        }
        // find new (x,y) start point (and also push that)
        var diff_start = (after_XYvalZoomStart.x - before_XYvalZoomStart.x);
        var yValdiff_satrt = ((chartstore.absoluteStartTime - before_XYvalZoomStart.x) / diff_start) * (after_XYvalZoomStart.y - before_XYvalZoomStart.y);
        var finalyVal_start = yValdiff_satrt + before_XYvalZoomStart.y;
        var new_xVal_start = Math.round((chartstore.absoluteStartTime - chartstore.absoluteStartTime) * multiplier);          // value is ZERO.
        convertedArray.unshift({ x: new_xVal_start, y: finalyVal_start });
        // find new (x,y) end point (and also push that)
        var diff_end = (after_XYvalZoomEnd.x - before_XYvalZoomEnd.x);
        var yValdiff_end = ((chartstore.absoluteStopTime - after_XYvalZoomEnd.x) / diff_end) * (after_XYvalZoomEnd.y - before_XYvalZoomEnd.y);
        var finalyVal_end = yValdiff_end + after_XYvalZoomEnd.y;
        var new_xVal_end = Math.round((chartstore.absoluteStopTime - chartstore.absoluteStartTime) * multiplier);
        convertedArray.push({ x: new_xVal_end, y: finalyVal_end });

        //sort array in descending order
        convertedArray.sort(function (a, b) {
            return a.x - b.x
        });

        return convertedArray;
    }

    ccPacketAnnotationFromCCpacketComp = () => {
        return this.CcPacket.current.setPacketAnnotation();
    }

    getXAxisLabels() {
        if (chartModal.allChannels.length > 0 && chartModal.allChannels[0].plotData) {
            var labels = chartModal.getChannel(0).getLabels();
            var items = labels.map(function (item, index) {
                return <div key={"xlabel-" + index}> {item} </div>;

            });
            var annotation = this.ccPacketAnnotationFromCCpacketComp();
            return <>
                {/* {this.ccPacketAnnotationFromCCpacketComp} */}
                {annotation}
                <FlexView className="xAxisLabels" >
                    {items}
                </FlexView>
                <div className="xAxis-timeLabels">Time (Sec)
            <img src="./images/arrow_right.png" className="arrow-righticon" /></div></>;
        }
    }

    allChartComps() {
        var me = this;

        var isPloatDataEmpty = chartModal.allChannels.length;
        var plotLength = 2000;//Set plot length to displayDataChunk size if its larger than 2000 samples
        if (isPloatDataEmpty > 0 && chartModal.allChannels[0].plotData)
            if (chartModal.allChannels[0].plotData.displayDataChunk.length > 2000)
                plotLength = chartModal.allChannels[0].plotData.displayDataChunk.length;

        var labelEmptyArr = Array.from({ length: plotLength }, (ele, index) => index);

        var plotdata;
        var hideZoomRect;
        var options = null;
        var optionArray = [];
        var mergeIndexArray = [];
        var chanelNum_Index = [];
        //mergeIndexArray[0] = [];
        //mergeIndexArray[1] = [];
        if (chartModal.allChannels !== null && chartstore.LoadWaveformFile_Response === Constants.RESPONSE_VALID) {

            var sortedArrVC = Constants.SORTED_VOLTAGE_CURRENT_GROUP;
            // var sortedAllChanel_VoltageCurrent = chartModal.allChannels;
            // sortedAllChanel_VoltageCurrent.sort(function(a, b) {
            //     return sortedArrVC.indexOf(a.channelNumber) - sortedArrVC.indexOf(b.channelNumber);
            // });
            // chartModal.allChannels = sortedAllChanel_VoltageCurrent;  

            var allCharts = chartModal.allChannels.map(function (channel, index) {
                plotdata = channel.getPlotValues();
                hideZoomRect = chartModal.isPanMode();
                if (index !== chartModal.allChannels.length - 1)
                    options = channel.getOptions(drawWidth, false, chartModal, index, hideZoomRect);
                else
                    options = channel.getOptions(drawWidth, true, chartModal, index, hideZoomRect);

                //Create new MultiDimentionaArray contains SImilar data to merge. (It may contain some empty values). 
                for (var i = 0; i < chartModal.mergeIndex.length; i++) {
                    mergeIndexArray[i] = (mergeIndexArray[i] === undefined ? [] : mergeIndexArray[i]);   //Assign empty array to push data.
                    optionArray[i] = (optionArray[i] === undefined ? [] : optionArray[i]);
                    for (var j = 0; j < chartModal.mergeIndex[i].length; j++) {
                        if (chartModal.mergeIndex[i][j] === channel.channelNumber) {
                            mergeIndexArray[i].push(plotdata.series[1]);
                            optionArray[i].push(options);
                        }
                    }
                }
            });
            // Remove empty array inside array.
            mergeIndexArray = mergeIndexArray.filter((e, index) => {
                if (e.length > 0) {
                    chanelNum_Index.push(index);
                }
                return e.length
            });

            optionArray = optionArray.filter(e => e.length);

            // Sort plot based on Voltage Current group.
            var tempMergeIndexArr = [];
            var tempoptionArray = [];
            var tempchanelNum_Index = [];
            for (var i = 0; i < sortedArrVC.length; i++) {
                var chanel_ind = chanelNum_Index.indexOf(sortedArrVC[i]);
                if (chanel_ind !== -1) {
                    tempMergeIndexArr.push(mergeIndexArray[chanel_ind]);
                    tempoptionArray.push(optionArray[chanel_ind]);
                    tempchanelNum_Index.push(chanelNum_Index[chanel_ind]);
                }
            }
            mergeIndexArray = tempMergeIndexArr;
            optionArray = tempoptionArray;
            chanelNum_Index = tempchanelNum_Index;

            //When other test case started having more or less number of chanels then it will return true. (used to redraw chart only once)
            var isChanelLenthChanged = (previousChanelLen === chanelNum_Index.length ? false : true);
            previousChanelLen = chanelNum_Index.length;

            //  optionArray = optionArray.filter(e => e.length);
            var allMergedCharts = mergeIndexArray.map(function (ele, index) {
                var sdsArray = [];
                var x = index;

                //disable chart if it's unchecked using checkbox.
                var showChart = true;
                chartstore.allSelectedChanelNumbers.forEach(function (ele, i) {
                    if (ele.chanelNum === chartModal.mergeIndex[chanelNum_Index[x]] && ele.isChecked === false) {
                        showChart = false;
                        isChanelLenthChanged = true;            // we need to redraw when chanel gets removed.
                    }
                });
                if (showChart === false)
                    return null;

                let mergedArray = mergeIndexArray[0][0];
                if (mergedArray) {

                    function updateStepSize() {
                        // Update stepSize value for new min and max value.
                        var newMaxVal = optionArray[index][0].scales.yAxes[0].ticks.max;
                        var newMinVal = optionArray[index][0].scales.yAxes[0].ticks.min;             // if min value is -1 incorrect divsion will happen from chartjs
                        var stepSize;
                        if (newMinVal >= 0) {
                            stepSize = (newMaxVal - newMinVal) / 4;
                        } else {
                            stepSize = (newMaxVal - 0) / 3;
                        }

                        optionArray[index][0].scales.yAxes[0].ticks.stepSize = stepSize;
                        //console.log('updateStepSize', newMaxVal, newMinVal, stepSize)
                    }

                    //Update max and min for merged array of "option".      // This will work Only if we merge Two charts.
                    if (optionArray[index][1] !== undefined) {
                        var tickVal0 = optionArray[index][0].scales.yAxes[0].ticks;
                        var tickVal1 = optionArray[index][1].scales.yAxes[0].ticks;
                        if (tickVal0.max < tickVal1.max) {
                            optionArray[index][0].high = optionArray[index][1].high;
                            optionArray[index][0].scales.yAxes[0].ticks.max = optionArray[index][1].scales.yAxes[0].ticks.max;
                        }

                        if (tickVal0.min > tickVal1.min) {
                            optionArray[index][0].low = optionArray[index][1].low;
                            optionArray[index][0].scales.yAxes[0].ticks.min = optionArray[index][1].scales.yAxes[0].ticks.min;
                        }
                        // Update stepSize value for new min and max value.
                        updateStepSize();
                    }
                    optionArray[index][0].chartNumber = index;       //Setting chart number (starts with ZERO). console => chart from => zoomOrPan(x1, y1, x2, y2, chart)

                    for (var y = 0; y < mergeIndexArray[x].length; y++) {
                        var labelName = 'label X' + x + 'Y' + y;
                        var chartLineColor = optionArray[x][y].scales.yAxes[0].scaleLabel.fontColor;
                        var newMaxVal = optionArray[index][0].high;
                        //var chanel_number = chartModal.mergeIndex[x][y];
                        var sds = me.initializeChartDataSetObject(mergeIndexArray[x][y], chartLineColor, labelName);
                        //console.log('sds', JSON.stringify(sds.data))
                        if (chartModal.isMaskActive === true) {
                            var maskDataset = me.getmaskDatasets(x + y, newMaxVal, labelEmptyArr.length, sds, chanelNum_Index[x]);
                            sdsArray = sdsArray.concat(maskDataset);
                            //if Mask is active and current chart having mask then update max value(high).
                            if (chanelNum_Index[x] === 3 && maskDataset[4] && optionArray[index][0].high < maskDataset[4].data[0].y) {
                                //console.log('=>', maskDataset[4].data[0].y)
                                optionArray[index][0].high = maskDataset[4].data[0].y;
                                optionArray[index][0].scales.yAxes[0].ticks.max = maskDataset[4].data[0].y;
                                // Update stepSize value for new min and max value.
                                updateStepSize();
                            }

                        } else {
                            sdsArray.push(sds);
                        }
                    }

                    //Update yAxis min and max if verticalZoom_MinMaxValArray[] is not empty.
                    if (chartModal.verticalZoom_MinMaxValArray) {
                        for (var i = 0; i < chartModal.verticalZoom_MinMaxValArray.length; i++) {
                            if (chartModal.verticalZoom_MinMaxValArray[i].chartNumber === index) {
                                //optionArray[index][0].high = chartModal.verticalZoom_MinMaxValArray[i].yaxisMax;
                                //optionArray[index][0].low = chartModal.verticalZoom_MinMaxValArray[i].yaxisMin;
                                optionArray[index][0].scales.yAxes[0].ticks.max = chartModal.verticalZoom_MinMaxValArray[i].yaxisMax;
                                optionArray[index][0].scales.yAxes[0].ticks.min = chartModal.verticalZoom_MinMaxValArray[i].yaxisMin;
                                updateStepSize();
                            }
                        }
                    }

                    var labelItems = optionArray[index].map((ele, ind) => {
                        return <p className="yaxis_custom_label" key={index + ele.scales.yAxes[0].scaleLabel.labelString} style={{ color: ele.scales.yAxes[0].scaleLabel.fontColor }}>{ele.scales.yAxes[0].scaleLabel.labelString}</p>
                    });


                    let currentChannel = chartModal.allChannels[index];
                    let pdata = (canvas) => {
                        const ctx = canvas.getContext("2d")
                        canvas.addEventListener('mouseup', currentChannel.mouseUpHandlerPan);
                        return {
                            labels: labelEmptyArr,
                            datasets: sdsArray
                        };
                    };

                    var chartStyle = (chartModal.isPanMode()) ? 'ct-octave chart-style pan-cursor' : 'ct-octave chart-style';
                    var isRedraw = (isChanelLenthChanged || me.state.isChartRedrawRequired) ? true : false;

                    return (
                        <div key={"channel-div-" + index} className="channel-container">
                            <div style={{ width: Constants.CUSTOM_YAXIS_LABEL_WIDTH + 'px', color: 'white', position: 'relative', float: 'left', height: '100%' }}>
                                <div className="set-channel-custom-position">
                                    {labelItems}
                                </div>
                            </div>
                            <div id="chart-parent-div" style={{ width: 'calc(100% - ' + Constants.CUSTOM_YAXIS_LABEL_WIDTH + 'px)', height: '100%', float: 'left' }}>
                                <Line key={"channel-" + currentChannel.channelNumber}
                                    ref={(reference) => currentChannel.setChartInstance(reference)}
                                    data={pdata}
                                    options={optionArray[index][0]}
                                    hideZoomRect={hideZoomRect}
                                    className={chartStyle} style={{ color: 'green' }} width={800} redraw={isRedraw} />     {/* sometimes half chart is displaying. (based on previous canvas height) */}
                            </div>
                        </div>
                    );
                }
            });
            me.state.isChartRedrawRequired = false;             // for this render is not required.
            if (mainstore.enableMergeByDefault && mainstore.renderDefaultMerge) {
                basemodal.chartModal.mergeIndex = JSON.parse(JSON.stringify(basemodal.chartModal.mergedIndexArr));
            }
            return allMergedCharts;
        } else {
            return null;
        }
    }

    render() {
        return (
            <FlexView>
                <CcPacket allChartComps={this.allChartComps.bind(this)} xAxisLabels={this.getXAxisLabels.bind(this)} ref={this.CcPacket} />
            </FlexView>
        );
    }

}

const Marker = observer(class Marker extends React.Component {
    constructor(props) {
        super(props);
        chartModal = chartAjaxModal.chartModal;
        this.state = {
            positionChanged: 0,
            isMarker_mouseDown: false,
            isMarkerLabelClicked: false,
            currentMarginTop: 0,
        }
        this.MouseDountPointerClientX = 0;
        //this.isMarker_mouseDown = false;

    }
    calculatePositionFromTime() {
        if (this.props.markerPositionAsTime > -1 && this.props.markerPositionAsTime < chartstore.chartValues.endTimeZoom) {
            // calculate pixels from time.
            var leftPos = chartModal.convertTimeToPixel(this.props.markerPositionAsTime) + Constants.LEFT_NAV_WIDTH;
            return leftPos;
        }
        //return -1;
        else {
            if (this.props.markerNum === Constants.MARKER_ONE) {
                if (this.state.positionChanged === 0)
                    this.setState({ positionChanged: Constants.LEFT_NAV_WIDTH + 200 });         // Initial pacement of Marker One (200px from left)
                return Constants.LEFT_NAV_WIDTH + 200;
            } else {
                if (this.state.positionChanged === 0)
                    this.setState({ positionChanged: Constants.LEFT_NAV_WIDTH + 500 });         // Initial pacement of Marker Two (500px from left)
                return Constants.LEFT_NAV_WIDTH + 500;
            }
        }
    }
    setPositionAndText(left, text) {
        this.leftPosition = left;
        this.labelText = text;
    }

    dragEvents(me, e) {

        mainstore.markerTimeDiffernce = mainstore.markerTimeDiffernce + 1;  //to re reder the marker differnece
        if (this.state.isMarker_mouseDown === true && e.clientX !== 0 && this.state.isMarkerLabelClicked === false) {
            var canvas_OffsetLeft = document.getElementsByClassName("Resizer")[0].offsetLeft + Constants.SPLITTER_BAR_WIDTH + Constants.POSITION_STICKY_LEFTNAV_WIDTH_OFFSETLEFT;
            var markerPoint = e.clientX - canvas_OffsetLeft;    // - Constants.TEMP_OFFSET_VBAR;        //-canvas_OffsetLeft;
            chartstore.zoomDragReactagle.offsetWidth = canvas_OffsetLeft;
            chartstore.zoomDragReactagle.width = e.clientX;

            var markerNumber = this.props.markerNum;
            let left_pos = e.clientX - canvas_OffsetLeft; // - Constants.TEMP_OFFSET_VBAR,
            var positionDiff = e.clientX - this.MouseDountPointerClientX;
            //var left_pos2 = this.state.positionChanged + positionDiff;
            this.MouseDountPointerClientX = e.clientX;

            let dragTime = chartModal.calculateTime(left_pos)[0];
            chartModal.setMarkerTime(markerNumber, dragTime);
            this.setState({ positionChanged: left_pos });
        }
        // Code for draggable marker label.(Top to bottom)
        else if (this.state.isMarker_mouseDown === true && e.clientX !== 0 && this.state.isMarkerLabelClicked === true) {
            var markerNumber = this.props.markerNum;
            var newMarginTop = e.clientY - this.MouseDownPointerClientY + this.currentMarginTop;
            newMarginTop = (newMarginTop < 0 ? 0 : newMarginTop)
            document.querySelector('.' + markerNumber + ' .marker-label').style.marginTop = newMarginTop + 'px'
        }
    }

    handleVBarClick(markerNum, e) {
        this.setState({ isMarker_mouseDown: true });
        chartstore.vBar_zIndex_markerNum = markerNum;
        this.MouseDountPointerClientX = e.clientX;              // mouse down point for Vertical marker.
        chartstore.zoomDragReactagle.start = e.clientX;          // mouse down point for zoom Glasspan.
        // Code for draggable marker label.(Top to bottom)
        this.MouseDownPointerClientY = e.clientY;              // mouse down point for movable MarkerLabel.
        var markerNumber = this.props.markerNum;
        this.currentMarginTop = document.querySelector('.' + markerNumber + ' .marker-label').offsetTop;
    }

    isVertical() {
        return (this.props.mode === VERTICAL);
    }
    getEnabledChanelArray() {
        var allChanelsArray = [];
        chartstore.allSelectedChanelNumbers.forEach((ele) => {
            if (ele.isChecked)
                allChanelsArray.push(ele.chanelNum)
        });
        return allChanelsArray;
    }
    calculatePosition() {
        var enabledChanels = this.getEnabledChanelArray();
        if (this.leftPosition < Constants.LEFT_NAV_WIDTH + Constants.CUSTOM_YAXIS_LABEL_WIDTH) {
            this.setPositionAndText(Constants.LEFT_NAV_WIDTH + Constants.CUSTOM_YAXIS_LABEL_WIDTH, chartModal.calculateLableText(Constants.LEFT_NAV_WIDTH, enabledChanels, this.props.markerNum));
        }
    }
    render() {
        var markerNum = this.props.markerNum;
        let mp = this.calculatePositionFromTime();                  //markerpoint
        this.leftPosition = mp;     //( mp > -1) ? mp : Constants.LEFT_NAV_WIDTH + 200;
        var enabledChanels = this.getEnabledChanelArray();
        this.labelText = chartModal.calculateLableText(mp, enabledChanels, markerNum);     // - Constants.CUSTOM_YAXIS_LABEL_WIDTH);

        var me = this;
        //var markerNum = this.props.markerNum;
        this.calculatePosition();
        var wid = (this.isVertical()) ? 3 : '100%';
        var hei = (this.isVertical()) ? '100%' : 3;
        var zIndexVal = (chartstore.vBar_zIndex_markerNum === markerNum ? 99 : 9);
        var opacity = (chartstore.isPlotDataLoading ? 0.3 : 1);
        return (// top: this.state.top + 'px',
            <>
                {mainstore.markerTimeDiffernce > 0 ? null : null}                      {/* to re reder the marker differnece */}
                <div onMouseMove={(e) => { me.dragEvents(me, e); }} onMouseUp={(e) => { this.setState({ isMarker_mouseDown: false }); }} onMouseLeave={(e) => { this.setState({ isMarker_mouseDown: false, isMarkerLabelClicked: false }); }} className={(this.state.isMarker_mouseDown ? "chart-marker-parent" : "")}>
                    <div className={"chart-marker " + markerNum} style={{ width: 25, left: this.leftPosition + 'px', height: hei, zIndex: zIndexVal, opacity: opacity, backgroundColor: 'transparent', marginLeft: '-11px', marginTop: '62px', cursor: 'col-resize' }}
                        onMouseDown={(e) => { me.handleVBarClick(markerNum, e); }}
                    //onMouseUp={(e) => { this.setState({ isMarker_mouseDown: false }); }}
                    //draggable="true"
                    >
                        <div style={{ width: wid, height: hei }} className="marker-label-align"></div>
                        <div className="marker-label" onMouseDown={(e) => { this.setState({ isMarkerLabelClicked: true }); }}>{this.labelText}</div>
                    </div>
                </div>
            </>
        );
    }
});

export const PlotGlassPanel = observer(class PlotGlassPanel extends React.Component {
    constructor(props) {
        super(props);
        this.canvas_OffsetLeft = 0;
        this.yaxisLabelWidth = Constants.LEFT_NAV_WIDTH + Constants.CUSTOM_YAXIS_LABEL_WIDTH;
        this.state = {
            mouseDownX: 0,
            rectStart: 0,
            rectWidth: 0,
        }

    }

    dragStart = (e) => {
        this.canvas_OffsetLeft = document.getElementsByClassName("Resizer")[0].offsetLeft + Constants.SPLITTER_BAR_WIDTH + this.yaxisLabelWidth + Constants.POSITION_STICKY_LEFTNAV_WIDTH_OFFSETLEFT;
        this.setState({ mouseDownX: e.clientX - this.canvas_OffsetLeft });
        e.preventDefault();
    }
    dragging = (e) => {
        if (this.state.mouseDownX !== 0 && e.clientX !== 0) {      //last drag e.clientX value will become Zero.
            let dragX = e.clientX - this.canvas_OffsetLeft;
            let isPositive = (this.state.mouseDownX < dragX) ? true : false;
            let rectangleWidth = Math.abs(dragX - this.state.mouseDownX);
            if (isPositive) {
                this.setState({
                    rectStart: this.state.mouseDownX,
                    rectWidth: rectangleWidth
                });
            } else {
                this.setState({
                    rectStart: dragX,
                    rectWidth: rectangleWidth
                });
            }
        }
    }
    onZoomDrop = (e) => {
        this.setState({ mouseDownX: 0, rectWidth: 0 });
        var x1 = this.state.rectStart;
        var x2 = this.state.rectStart + this.state.rectWidth;

        chartModal.zoomOrPan(x1, null, x2);
    }
    render() {
        const marker_1_left = chartstore.markerCustomPositioningData.marker_1_PointInTime;
        const marker_2_left = chartstore.markerCustomPositioningData.marker_2_PointInTime;
        var markers = null;
        if (chartstore.isPlotResultActive === true && chartstore.showVerticalBar === true) {
            markers = (<div style={{ marginTop: '0px' }}><Marker mode={VERTICAL} markerNum={Constants.MARKER_ONE} key={Constants.MARKER_ONE} markerPositionAsTime={marker_1_left} />
                <Marker mode={VERTICAL} markerNum={Constants.MARKER_TWO} key={Constants.MARKER_TWO} markerPositionAsTime={marker_2_left} /></div>);
        } else if (chartstore.isPlotResultActive === true && chartModal.currentTool === Constants.MODE_ZOOM_IN) {
            markers = (<div id="zoomHorizontalDragedArea" style={{ width: 'calc(100% - ' + this.yaxisLabelWidth + 'px)', marginLeft: this.yaxisLabelWidth + 'px', }}>
                <div draggable="true" onMouseDown={this.dragStart} onMouseMove={this.dragging} onMouseUp={this.onZoomDrop} style={{ width: '100%', height: '100%' }}>
                    <div style={{ width: this.state.rectWidth + 'px', marginLeft: this.state.rectStart + 'px', height: '100%', backgroundColor: '#8a8a8a', opacity: '0.6' }}></div>
                </div>
            </div>);
            setTimeout(function () { customNavbarOnSpitterMoves(Constants.PLOTTOOLBAR_ICON_TOTAL_WIDTH); }, 200);
        }
        var withMarkers = <div className="markers-height">
            {
                markers
            }
            <div className="chart-obsolute-container">
                {
                    this.props.children
                }
            </div>
        </div>;
        return (withMarkers);
    }
});

