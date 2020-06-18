import React from 'react';
import 'react-virtualized/styles.css';
import { List } from 'react-virtualized';
import ScrollToBottom from 'react-scroll-to-bottom';
import { OverlayTrigger, Tooltip, Table } from 'react-bootstrap';
import FlexView from 'react-flexview/lib';
import { FadeLoader } from 'react-spinners';
import PlotToolbar from './PlotToolbar';
import { observer } from 'mobx-react';
import { observe } from 'mobx';
import { basemodal, mainstore } from '../../modals/BaseModal';
import { chartstore } from '../../modals/ChartStoreModal';
import * as Constants from '../../Constants';
import { timeFormatter, scrollToPacket, customNavbarOnSpitterMoves } from '../../utils';
import ReactTable from 'react-table';
import SplitPane from 'react-split-pane';
import 'react-table/react-table.css'
import utils from '../../utils';
import '../../css/chart.css'
import DefaultProps from 'react-table/lib/defaultProps';
import { PlotGlassPanel } from './index';
var chartModal = null;
var packetsLength = 0;  //drawWidth = 0,
const rowHeight = 25;
const width = 955;

export const CcPacket = observer(class CcPacket extends React.Component {
    constructor(props) {
        super(props);
        chartModal = basemodal.chartModal;  // =(window.innerWidth - 200);
        //drawWidth = chartModal.currentDrawableAreaWidth + 'px';
        this.chartRef = React.createRef();
        this.packetRefs = [];
        this.state = {
            chartUpdate: 1,
            currentEndTime: 0,
            currentSelectedRow: null,
            // chartReRender: 1,
            packetBackgroundColor: null,
            ccPacket_Height: 0,
            plotChart_Height: 0,
        };

        var me = this;
        chartModal.onChangeListener(function (random) {
            me.setState({
                chartUpdate: me.state.chartUpdate + 1,
                currentEndTime: random
            });
        });
        const disposer = observe(mainstore, "chartPollEnabled", (change) => {
            this.enabledDisablePolling(change.newValue);
        });
        const disposer3 = observe(chartstore, "isChart_rerender", (change) => {
            mainstore.chartReRender = mainstore.chartReRender + 1;
            // me.forceUpdate();
        });
        this.enabledDisablePolling(false);// defaulted to offline
    }

    componentDidMount() {
        chartModal.currentDrawableAreaWidth = chartModal.getDrawableAreaWidth();;
        // document.getElementById('test').addEventListener('scroll',() => this.isScrollEventDetected(mainstore.currentCClinePacketsClicked-1), false);
    }

    componentDidUpdate() {
        chartModal.currentDrawableAreaWidth = chartModal.getDrawableAreaWidth();;
    }

    enabledDisablePolling(enable) {
        if (enable)
            chartModal.startTimer();
        else
            chartModal.stopTimer();
    }


    CreatePacketTable() {

        var chartTableComp_height = (window.innerHeight * 0.4) - (Constants.TOP_NAVBAR_HEIGHT / 2) + 8; // ploat page : converting height to 40%  (minus Topnav height (90/2) minus 8 (xAxisLabels())). 
        if (this.state.ccPacket_Height !== 0) {
            chartTableComp_height = this.state.ccPacket_Height;
        }

        var formatExtraData = mainstore.chartReRender;
        var tableData = chartModal.getCCPacketData();
        var packetsCount_beforeStart = 0;
        var isScollTriggered = false;

        //loop through tableData to find index to scroll on zoom. (below rowRerender loop is React Vertual loop its is limited it will loop ony 8-10 times)
        /*    for(var i=0; i< tableData.length; i++){
                if(chartstore.chartValues.startTimeZoom < tableData[i].startTime && isScollTriggered === false){
                    console.log('Packet Index ====>', i);
                    //mainstore.currentpacketIndex = i;
                    isScollTriggered = true;
                }
            }       */

        //let className = 'blurBackground';
        this.rowRenderer = ({ index, isScrolling, key, style }) => {
            // var CcLinePacketRowId = index + 1;
            var row = tableData[index];
            //console.log('ROW', index, '=', row.startTime, ':', chartModal.packetDistanceMultiplier, '::', row.distance)
            var packetDistanceMultiplier = chartModal.packetDistanceMultiplier + formatExtraData - formatExtraData;                 // Must use to work Packet Rerender. (formatExtraData - formatExtraData) (otherwise drag zoom packet position will not set)
            var iconWidth = Constants.PACKET_ICON_WIDTH;
            var iconHeight = Constants.PACKET_ICON_HEIGHT;
            var str = '#' + index + "  " + row.sopType + (row.powerRole ? "/" + row.powerRole : "") + (row.dataRole ? "/ " + row.dataRole : "") + ":" + row.pktType + ":" + row.description;
            var iconClassName = (row.isTesterPkt === null ? "icon-packet" : (row.isTesterPkt) ? "icon-tester" : "icon-device")
            var startTimeOffset = packetDistanceMultiplier * chartstore.chartValues.startTimeZoom;       // * chartstore.absoluteStartTime;    //When zoom make Timestamp outside the Zoomed-time, fix packets start and END(MAX value). 
            var rowStartTime = row.startTime;
            var changeTextColor = '';
            if (row.channel === 2) {
                changeTextColor = " ccpacket-font-color";
            }
            else {
                changeTextColor = ' ccpacket-font-style'
            }
            let packetsCount_Old = packetsCount_beforeStart;
            if (chartstore.AppState === Constants.READY) {
                if (row.startTime < chartstore.chartValues.startTimeZoom) {
                    rowStartTime = chartstore.chartValues.startTimeZoom;
                    packetsCount_beforeStart = packetsCount_beforeStart + 1;
                } else if (row.startTime > chartstore.chartValues.endTimeZoom) {
                    rowStartTime = chartstore.chartValues.endTimeZoom;
                }
                if (packetsCount_Old === packetsCount_beforeStart && isScollTriggered === false) {
                    chartstore.ccPacket.scrollToCCPacket = packetsCount_beforeStart * 25;
                    scrollToPacket(chartstore.ccPacket.scrollToCCPacket);
                    isScollTriggered = true;
                }
            }
            var distance = (packetDistanceMultiplier * rowStartTime) - startTimeOffset;
            if (distance > chartModal.currentDrawableAreaWidth) {
                distance = chartModal.currentDrawableAreaWidth;        // when second text case started initially it will display old ccPacket with incorrect width (packets will move left side) (issue: AA-I2633)
            }
            var maxLeftsideTextDistance = Math.round(chartModal.currentDrawableAreaWidth / 1.7);//TODO How did we derive 1.7 ?
            //console.log('RESSS : '+index, distance, chartModal.currentDrawableAreaWidth, packetDistanceMultiplier, index)
            var textLeft = "";
            var textRight = "";
            let selectedPacketClass = "";
            // if (this.state.packetBackgroundColor === index) {
            if (mainstore.currentCClinePacketsClicked === index) {
                selectedPacketClass = "packetsBackground ";
            }
            const ASSUMED_EACH_CHAR_LENGTH = 10;
            var packetStringWidth = (str.length + 1) * ASSUMED_EACH_CHAR_LENGTH;

            // packets left align 
            if (distance > maxLeftsideTextDistance) {
                let stringDisplayAreaWidth = distance - Constants.PACKET_ICON_WIDTH;
                let maxPossibleCharsinDistanceInPixels = stringDisplayAreaWidth / ASSUMED_EACH_CHAR_LENGTH;
                distance = distance - Constants.PACKET_ICON_WIDTH;
                // if string width is greather than distance, truncate to distance
                if (packetStringWidth > distance) {
                    //str = str.substring(0, maxPossibleCharsinDistanceInPixels) + "...";
                }
                textLeft = <div className={selectedPacketClass + "packetString truncate_text" + changeTextColor}>{str}</div>;
            }
            // packets right align 
            else {
                let stringDisplayAreaWidth = chartModal.currentDrawableAreaWidth + distance + Constants.PACKET_ICON_WIDTH;
                let maxPossibleCharsinDistanceInPixels = stringDisplayAreaWidth / ASSUMED_EACH_CHAR_LENGTH;
                let remainingRightSideDistance = chartModal.currentDrawableAreaWidth - (distance + Constants.PACKET_ICON_WIDTH);
                if (packetStringWidth > remainingRightSideDistance) {
                    //str = str.substring(0, maxPossibleCharsinDistanceInPixels) + "...";
                }
                textRight = <div className={selectedPacketClass + "packetString truncate_text textLeft" + changeTextColor} align="right" style={{ whiteSpace: 'nowrap' }} >{str}</div>
            }
            var timestamp_column_width = Constants.GRAPH_YAXIS_WIDTH;
            row.distance = timestamp_column_width + distance;
            //console.log('row.distance :', row.distance)
            var timestamp = timeFormatter(row.startTime);
            return (
                <FlexView className="set-packetRowHeight ccpacket-details ccpacket-font-style" key={key} style={style} onClick={(e) => this.cclinePacketRowClickEvent(row, index, tableData)}>
                    <div className={"timestamp-row" + changeTextColor} ref={(node) => { if (node) { node.style.setProperty("width", Constants.CC_PACKET_TIMESTAMP_WIDTH + "px", "important"); } }}  >{timestamp}</div>
                    <FlexView className="packet-dimensions " id={'packetRef' + index} >
                        <FlexView basis={distance} hAlignContent='right' className="packetsAlign"  >
                            {/* <div className="packets-leftalign">{textLeft}</div> */}
                            {textLeft}
                        </FlexView>
                        <div className={iconClassName} style={{ width: iconWidth + 'px', height: iconHeight + 'px' }}></div>
                        {textRight}
                    </FlexView>
                </FlexView>);
        };

        return (<>

            <FlexView style={{ height: chartTableComp_height + 'px', width: '100%' }}>
                <ScrollToBottom className={(chartstore.isPlotDataLoading === true && chartstore.isPlotResultActive === true) ? 'chart-scrolltobottom blurBackground ccPacketScrollToBottom' : 'chart-scrolltobottom ccPacketScrollToBottom'} style={{ margin: '0,10px,0,0' }} >
                    {(chartstore.LoadWaveformFile_Response === Constants.RESPONSE_VALID ?
                        <><div className="chart-header">
                            <p className="timestamp-header">TimeStamp</p>
                            <p className="ccpacket-description-header">Description</p>
                        </div>
                            <div onWheel={(e) => utils.listenScrollEvent(e)}>
                                <List
                                    rowCount={tableData.length}
                                    width={width}
                                    height={chartTableComp_height - 25}             // table header height 25px.
                                    rowHeight={rowHeight}
                                    rowRenderer={this.rowRenderer}
                                    scrollToIndex={mainstore.isPollingChecked ? mainstore.currentCClinePacketsClicked : mainstore.currentpacketIndex}
                                    overscanRowCount={2}
                                    scrollToAlignment={'center'}
                                />
                            </div></>
                        : null)}
                </ScrollToBottom>
            </FlexView>
        </>);
    }
    // isScrollEventDetected(rowIndex) {
    //     mainstore.currentCClinePacketsClicked = -1;
    // }

    //TODO @Ajith rename to cclinePacketRowClickEvent
    cclinePacketRowClickEvent(row, rowIndex, tableData) {
        var me = this;
        me.setState({ currentSelectedRow: row });
        me.setPacketsBackground(rowIndex)
        var payload = row.header_Payload;
        chartstore.markerCustomPositioningData.marker_1_PointInTime = row.startTime
        chartstore.markerCustomPositioningData.marker_2_PointInTime = row.stopTime
        me.extractPacketDetails(payload)
        basemodal.chartModal.requestChartRerender()
        setTimeout(() => {
            mainstore.markerTimeDiffernce = mainstore.markerTimeDiffernce + 1   //to rerender the marker while clcicking on the packet
        }, 300);
        var packetDetailsWidth = document.querySelector(".plotSplitPane > .Pane1").style.width;
        if (packetDetailsWidth === "99.5%") {
            document.querySelector(".plotSplitPane > .Pane1").style.width = "75%";
            customNavbarOnSpitterMoves(Constants.PLOTTOOLBAR_ICON_TOTAL_WIDTH);
        }
        //calculating  Packet Time Details
        chartstore.rowStartTime = row.startTime;
        chartstore.rowStopTime = row.stopTime;
        chartstore.rowStartAndStopTImeDiff = ((row.stopTime - row.startTime) * 1000).toFixed(4);
        if (tableData[rowIndex - 1] !== undefined) {
            chartstore.previousPktDelay = ((row.startTime - tableData[rowIndex - 1].startTime) * 1000).toFixed(4)
        }
        else {
            chartstore.previousPktDelay = 0;
        }
        if (tableData[rowIndex + 1] !== undefined) {
            chartstore.postPktDelay = ((tableData[rowIndex + 1].startTime - row.startTime) * 1000).toFixed(4)
        }
        else {
            chartstore.postPktDelay = 0;
        }
        return <PacketDetails key={"packet-" + rowIndex} />
    }

    setPacketsBackground = (index) => {
        // this.setState({ packetBackgroundColor: index });
        mainstore.currentCClinePacketsClicked = index;
        var timeout = setTimeout(() => {
            //console.log('Time Out 100ms');
            chartModal.currentDrawableAreaWidth = chartModal.getDrawableAreaWidth();
            chartModal.calc_PacketDistanceMultiplier();
            chartModal.requestChartRerender();
        }, 100);
    }
    extractPacketDetails(payload) {
        var treeNodes = [];
        var headerCount = 0;
        for (headerCount = 0; headerCount < payload.length; headerCount++) {
            var header = payload[headerCount]
            var children = header.replace(/;/g, '-->').split('$')
            var childNodes = []
            for (var index = 1; index < children.length; index++) {
                if (children[index]) {
                    childNodes.push(
                        {
                            value: children[index],
                            label: children[index]
                        }
                    )
                }
            }
            treeNodes.push(
                {
                    value: children[0],
                    label: children[0],
                    children: childNodes
                }
            )
        }
        packetsLength = treeNodes.length
        var data = [];
        treeNodes.forEach(function (item) {
            item.children.splice(0, 1)
            item.children.forEach(function (item1) {
                data.push({ parent: item.label, label: item1.label.split("-->") })
            })
        })
        chartstore.ccPacket.packetDetails = data;
    }

    setPacketAnnotation() {
        var currentSelectedRow = this.state.currentSelectedRow;
        let maxLeftsideTextDistance = Math.round(chartModal.currentDrawableAreaWidth / 1.7);
        if (currentSelectedRow) {
            var strAnnotation = currentSelectedRow.pktType;
            var TimeStamp = timeFormatter(currentSelectedRow.startTime);
            var packetWidth = 4;
            var isLeftAligned_addPacketWidth = 0;

            if ((currentSelectedRow.distance - Constants.GRAPH_YAXIS_WIDTH + Constants.PACKET_ICON_WIDTH) > maxLeftsideTextDistance) {
                isLeftAligned_addPacketWidth = Constants.PACKET_ICON_WIDTH;     //20px
            }

            var distance = isLeftAligned_addPacketWidth + currentSelectedRow.distance + Constants.CUSTOM_YAXIS_LABEL_WIDTH + Constants.MARGIN_BORDER_PADDING_BW_SPLITTERANDLABEL;        // GRAPH_YAXIS_WIDTH(120) + 8 
            if (currentSelectedRow.startTime > chartstore.chartValues.endTimeZoom || (currentSelectedRow.distance - Constants.GRAPH_YAXIS_WIDTH) > maxLeftsideTextDistance) {         //diff 80
                distance = distance + Constants.PACKET_ICON_WIDTH + packetWidth;             // when packet fixed to End.                                                    
            }
            return <FlexView className="packet-Annotation">
                <FlexView basis={distance}></FlexView>
                <OverlayTrigger placement="auto" overlay={<Tooltip> {TimeStamp + ' : ' + strAnnotation} </Tooltip>}>
                    <FlexView basis={packetWidth} className="annotation_pointer">
                        {/*strAnnotation*/}
                    </FlexView>
                </OverlayTrigger>
            </FlexView>;
        }
        return null;
    }

    restrictChartScroll(e) {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    }

    //TODO Deprecate
    handleReset(charts) {
    }
    handleVerticleBar() {
        chartModal.handleVerticleBar();
    }
    onSplitterDragEnd = () => {
        this.onSplitterDragging();
        chartModal.requestChartRerender();
    }
    onSplitterDragging = () => {
        if (document.getElementsByClassName('ReactVirtualized__Grid ')[0]) {
            var pane1_height = document.getElementsByClassName('ccline_Chart_spliter')[0].childNodes[0].offsetHeight;
            var pane2_height = document.getElementsByClassName('ccline_Chart_spliter')[0].offsetHeight - pane1_height - 8;
            this.setState({ ccPacket_Height: pane1_height, plotChart_Height: pane2_height });
            var scrollDiv = document.getElementsByClassName('ReactVirtualized__Grid ')[0];
            scrollDiv.scrollTop = scrollDiv.scrollHeight;
        }                      //Scroll to bottom;
    }

    render() {
        var chartContainer = null;
        if (this.state.chartUpdate) {
            var loaderDiv = <>{(chartstore.isPlotDataLoading === true && chartstore.isPlotResultActive === true) ?
                <div className="bar-Loader">
                    <FadeLoader sizeUnit={"px"} height={15} width={7} color={'#85d4e1'} loading={true} />
                    <p className="fade-loader-text">Loading...</p>
                </div> : null
            }</>;

            var ChartComps_height = (window.innerHeight * 0.6) - (Constants.TOP_NAVBAR_HEIGHT / 2); // ploat page : converting height to 60% (minus Topnav height (90/2) minus 8 (xAxisLabels())). 
            var allCharts = this.props.allChartComps();
            var offlineMode = (chartstore.AppState === Constants.READY) ? false : true;
            var tollbar_and_xais_height = Constants.PLOT_TOOLBAR_HEIGHT + Constants.PLOT_XAISLABEL_HEIGHT;

            chartContainer = <div style={{ height: '100%' }} className={(chartstore.isPlotDataLoading) ? "scroll-content-disabled" : ""}>
                <div>
                    <PlotToolbar offlineMode={offlineMode} handleVerticleBar={this.handleVerticleBar} reset={this.handleReset.bind(this, allCharts)} />
                </div>
                <SplitPane split="horizontal" defaultSize="40%" onDragFinished={this.onSplitterDragEnd} onChange={this.onSplitterDragging} className="ccline_Chart_spliter" style={{ height: 'calc(100% - ' + tollbar_and_xais_height + 'px )', minHeight: 'unset !important' }} >
                    <>{
                        this.CreatePacketTable()
                    }</>
                    <FlexView id='plot-container' className="plot-container " style={{ height: (this.state.plotChart_Height !== 0) ? this.state.plotChart_Height : ChartComps_height - 29 + 'px' }}>
                        <FlexView onWheel={this.restrictChartScroll.bind(this)} column className={(chartstore.isPlotDataLoading === true && chartstore.isPlotResultActive === true) ? "chart-container blurBackground" : "chart-container"} id="targetElementId">
                            {
                                allCharts
                            }
                        </FlexView>
                    </FlexView>
                </SplitPane>
                {
                    (chartstore.LoadWaveformFile_Response === Constants.RESPONSE_VALID ? this.props.xAxisLabels() : null)
                }
            </div>;
        }

        return (<FlexView column grow={1} className="setMaxHeight"> <PlotGlassPanel showVbar={this.state.showVerticalBar}>{loaderDiv}{chartContainer}</PlotGlassPanel> </FlexView>);
    }
})

const TrComponent = (props) => {
    const { ri, ci, ...rest } = props;
    if (ri && ri.groupedByPivot) {
        const cell = props.children[ri.level];
        cell.props.style.flex = 'unset';
        cell.props.style.width = '100%';
        cell.props.style.maxWidth = 'unset';
        cell.props.style.paddingLeft = `${15 * ri.level}px`;
        return <div {...rest}>{cell}</div>;
    }
    return <DefaultProps.TrComponent {...rest} />;
}
const getTrProps = (state, ri, ci, instance) => {
    return { ri };
}
const getTheadThProps = () => {
    return {
        className: "packetDetails-header"
    };
}

export const PacketDetails = observer(class PacketDetails extends React.Component {
    componentDidMount() {
        document.querySelector('.ReactTable .rt-tbody').addEventListener('scroll', function () { document.querySelector('.ReactTable .rt-thead').scrollLeft = this.scrollLeft });
    }
    render() {
        const treeTableConfig =
        {
            TrComponent,
            getTrProps,
            getTheadThProps
        }
        return (
            <><p className="panelHeading" >Packet Details</p>
                <div className="packet-time-details">
                    <p>Start Time : {chartstore.rowStartTime + " S"}</p>
                    <p>End Time : {chartstore.rowStopTime + " S"}</p>
                    <p>Pkt Duration : {chartstore.rowStartAndStopTImeDiff + " ms"}</p>
                    <p>Prev Pkt Delay : {chartstore.previousPktDelay + " ms"} </p>
                    <p>Post Pkt Delay : {chartstore.postPktDelay + " ms"}</p>
                </div>
                <div style={{ height: '100%' }} onWheel={(e) => utils.listenScrollEvent(e)} className="scroll setMaxHeight">
                    <ReactTable data={chartstore.ccPacket.packetDetails} pivotBy={["parent"]}
                        columns={[
                            {
                                Header: '',
                                accessor: 'parent',
                                minWidth: 0
                            },
                            {
                                Header: 'Bits',
                                accessor: 'label[0]',
                                minWidth: 30
                            },
                            {
                                Header: 'Field Type',
                                accessor: 'label[1]',
                                minWidth: 100
                            },
                            {
                                Header: 'Raw',
                                accessor: 'label[2]',
                                minWidth: 30

                            },
                            {
                                Header: ' Decoded',
                                accessor: 'label[3]',
                                minWidth: 40
                            },
                            {
                                Header: ' Description',
                                accessor: 'label[4]',
                                minWidth: 50
                            }
                        ]}

                        pageSize={packetsLength}
                        showPaginationBottom={false}
                        className='-striped'
                        {
                        ...treeTableConfig
                        } >
                    </ReactTable>
                </div>
            </>
        )
    }
});