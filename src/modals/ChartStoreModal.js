import { observable } from "mobx";
import * as Constants from '../Constants';
import ajax from './AjaxUtils';
import { VIFDataModal, MetaData, UsbIf } from './VIFDataModal';
import fileDownloader from 'js-file-download';
import * as  metadatajson from './metadata.json';
import * as usbIfjson from './usbif.json';
import { RulesEngine } from './RulesEngine';
import { VIFComboBoxRules } from './ComboBoxRules';
import toastNotification from '../utils/toastNotification'
import ProductCapabilityProps from "../components/PanelProductCapability/ProductCapabilityProps"
import { mouseBusy } from '../utils';


export const chartstore = observable({
  isPlotResultActive: false,       //currentPanelIndex: 0,
  AppState: Constants.READY,      //status.appState 
  channelList: [],
  signalFileStopTime: 0,
  signalFileStartTime: 0,
  signalFileReadStatus: 'BUSY',
  absoluteStopTime: 0,
  absoluteStartTime: 0,
  isPlotDataLoading: false,
  showVerticalBar: false,
  isChart_rerender: 1,
  vBar_zIndex_markerNum: Constants.MARKER_ONE,
  allSelectedChanelNumbers: [],
  LoadWaveformFile_Response: Constants.RESPONSE_VALID,
  packetTimingDetails: {},
  chartValues: {
    startTimeZoom: 0,
    endTimeZoom: 0
  },
  zoomDragReactagle: {
    start: 0,
    width: 0,
    offsetWidth: 0,
  },
  maskUpper_LowerPoints: {
    upperMask_points: null,
    lowerMask_points: null,
  },
  markerCustomPositioningData: {
    marker_1_PointInTime: -1,
    marker_2_PointInTime: -1
  },
  ccPacket: {
    packetDetails: [],
    scrollToCCPacket: 0
  },
});



class ChartAjaxModal {
  constructor() {
    this.chartModal = null;
  }

  setChartStartEnd(start, end) {
    chartstore.chartValues = {
      startTimeZoom: start,
      endTimeZoom: end
    };
  }

  getSignalFileReadStatus() {
    ajax.callGET(Constants.URL_Plot + "GetFileReadStatus/", {}, function (response) {
      if (response.data)
        chartstore.signalFileReadStatus = response.data;
    }, function (error) {
      console.log("Error", error)
    });
  }


  getChannelList(callback) {
    ajax.callGET(Constants.URL_Plot + "GetChannelList", {}, function (response) {
      chartstore.channelList = response.data;
      if (callback)
        callback()
    }, function (error) {
      console.log("Error", error)
    });
  }

  getSignalFileStartTime(callback) {
    var response = ajax.callAndWaitGET(Constants.URL_Plot + "GetWaveformStartTime/", {})
    response.then(function (value) {
      chartstore.signalFileStartTime = value.data;  // * 10e-9;
      if (callback)
        callback()
    });
  }

  //PLOT AJAX Calls
  getSignalFileStopTime(callback) {
    var response = ajax.callAndWaitGET(Constants.URL_Plot + "GetWaveformStopTime/", {})
    response.then(function (value) {
      chartstore.signalFileStopTime = value.data * 10e-9;
      chartstore.chartValues.endTimeZoom = chartstore.signalFileStopTime;//The initial zoom stop time will be the signal end time
      if (callback)
        callback()
    });
  }

}

export const chartAjaxModal = new ChartAjaxModal();