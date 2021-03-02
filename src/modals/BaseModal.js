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
import { chartstore } from './ChartStoreModal';

//TODO @Thiru @Ajith @Sandeh @Gautham When making changes to base model please synchronize among the team
export const mainstore = observable({
  status: {
    appState: Constants.READY,
    connectionState: Constants.DISCONNECTED,
  },
  apiMode: {
    appState: Constants.READY,
    connectionState: " ",
    isAppModeAPI: false,
  },
  chartPollEnabled: false, //TODO Move all polling objects into a new object called polling and place all these individual polling flags into it also rename to "startPlotPolling"
  currentPanelIndex: 0,
  //showVerticalBar: false,
  //isPlotDataLoading: false,
  //vBar_zIndex_markerNum: Constants.MARKER_ONE,
  panelResultPolling: false,
  popUpPolling: true,//TODO Deprecate this as popup manager should always be polling
  //isChart_rerender: 1,
  chartDrawableAreaWidth: 1000,
  displayResultsManager: false,
  LoadVifFileName: 'Load XML VIF File',//TODO Thiru move this into mainstore.productCapabilityProps and deprecate this instance
  TestResultTreeviewId: '',//TODO Thiru depricate this
  chartReRender: 1,
  currentpacketIndex: -1,
  currentCClinePacketsClicked: -1,
  isPollingChecked: false,//TODO Move all polling objects into a new object called polling and place all these individual polling flags into it also rename to "startCClinePolling"
  dutPortIndex_C2PortA: 0,//TODO @Thiru Why are you using this ?
  numberofPorts: true, //TODO Thiru numberofPorts should be int why is it boolean rename or change type
  portLabelArrayEntries: [],
  IPAddressHistory: [],//TODO @vikram rename to "iPAddressList" and move into mainstore.connectionInfo
  // stopScrollingTetCase: false,//TODO @Ajith deprecate this
  reportdownloadPercent: 0,//TODO @vikram deprecate
  vifFileLoaded: "",//TODO Thiru move this into mainstore.productCapabilityProps and deprecate this instance
  editVifValuesNotification: null,
  isGetCapsEnabled: false,
  isGetDeviceCapsInProgress: false,
  renderGlassPaneWhileGetcaps: false,
  previousCableType: Constants.CABLE_DATA_TYPES[0],
  devicePdPortTypeValue: null,
  filePdPortTypeValue: null,
  captiveCableVal: 0,
  getCableNameForTooltip: [],
  loadedVifVendorName: '',
  isVifXmlLoaded: false,
  productCapsProjectName: 'NewProject',
  getCapsPortNumber: 1,
  isVifFieldChange: false,
  copyLoadedXmlVif: [],
  selectedEload: '',
  isTesterStatusNotConnected: false,
  mfi_Eloads: [],
  connectionStatusLoader: false,
  eLoadResponseData: '',
  isEloadAdressLoaded: false,
  isSetAppModeToggled: false,
  fivePortTestingFlag: false,
  showConfigPopup: false,
  showIrDropCalibrationPopUp: false,
  show5PortTestingPopUp: false,
  portTestingReRender: 0,
  enableGlassPaneIfOptionsPanelSelected: false,
  isFivePortStartedExecution: false,
  showMarkerByDefault: false,
  markerTimeDiffernce: 0,
  enableMergeByDefault: true,
  renderDefaultMerge: true,
  imgWidth: 760,
  isTestResultInOfflineMode: false,
  alignTestResultsClearPopUp: false,
  isTestResultCaptureFileNameEmpty: false,
  copyVifInfo: {},
  isVifLoadedFromProductCaps: true,
  disableFivePortExecutionBtn: false,
  cableSelectionFromDropDownInInformational: false,
  loadSelectedCableFromBackend: false,
  complianceCableType: Constants.CABLE_DATA_TYPES[0],
  renderFivePort: 0,
  enableOrDisableAllPopups: false,
  copyisAllPopupDisabled: false,
  copyDebugModeEnabled: false,
  isCalibratedButtonClicked: false,
  logMessages: [],
  isMfiEloadConnected: false,
  handleAutoClosePopup: false,
  showReRunTestCase: false,
  irDropCalibrationStatus: "",
  fivePortSelectedPortStatus: "",
  allSelectedBtns: [],
  reportFolderName: " ",
  configControlSaveLocation: " ",
  qcLegacyTestCase: [],
  configControllerCaptureInProgress: false,
  skipMissingVIFFieldToast: null,
  isChartPollingForApiModeStarted: false,
  selectedTestCaseCount: [],

  alert: {//TODO @Thiru please deprecate this and use the new Toast to all the places used instead of the browser alert
    alertMessage: "",
    alertCategory: "",
  },//TODO END

  vifEditorDataUpdated: 1,
  vifEditorEditable: true,
  vifEditableOnlyInInformationalMode: false,
  currentPortIndex: 1,
  saveVifFile: 'Load XML File',//TODO Thiru move this into mainstore.productCapabilityProps and deprecate this instance
  vifEditorDataModalForUI: {//! @Thiru ?? Why is there a method call here 
    //dataChanged: true,
    get generateUIData() {
      //generate table data(which is used by visual table builder) based on the vifEditorDataModal.
      return {};
    }
  },
  connectionInfo: {
    connectionType: 'Ethernet',
    testerStatus: 'Disconnected',
    firmwareVersion: 'N/A',
    serialNumber: 'N/A',
    testerIpAddress: '192.168.255.1',
    portInfo: 'N/A',
    licenseInfo: [],
    defaultIpConfig: true,//TODO @vikram Deprecate this
    calibration_St_Date: 'N/A',
    calibration_Sp_Date: 'N/A',
    boardCalibration: "N/A",
  },
  moiSelections: {
  },

  selectedMoiTestCase: [],

  fivePortConfiguration: [{}, {}, {}, {}, {}],

  currentPortStatus: {
    currentSelectedPortNumber: "",
    comPortValue: "",
  },

  testConfigurationFivePort: {},

  fivePortPortName: {
    portName: {},
  },
  testConfiguration:
  {
    selectedCertifiedFilter: Constants.CERTIFICATION_FILTER[0],
    selectedTestList: [],
    testList: [],

    pd3Configuration: {
      vconnVoltage_PD3: "",
      isFrSwapIncluded: false,
    },

    pd2Configuration: {
      noiseType: "",
      vconnVoltage_CE: '',
    },
    tbtConfiguration: {
      portType: '',
      poweredType: '',
      deviceType: '',
      tbT_Version: '',
      stressTiming: '',
      isPortACapMisMatchSet: false,
      isPortAGiveBackSet: false,
      isPortBCapMisMatchSet: false,
      isPortBGiveBackSet: false,
    },

    qc3Configuration: {
      dutType: '',
      connectorType: '',
      connectorTypeCable: '',
      irDrop: '',
      ratedCurrent5V: '',
      ratedCurrent9V: '',
      ratedCurrent12V: '',
      ratedCurrent20V: '',
      dutRatedPower: '',
      ports: '',
      pdSupported: '',
      qcDUTtype: '',
      inputSupplyVoltage: '',
      isUUTSupports20V: false,
    },

    sptConfiguration: {
      portType: ''
    },

    qc4Configuration: {
      dutType: '',
      roomTemperature: ''
    },

    functionalConfiguration: {
      typeCCanActAsHostValue: 0,
      typeCCanActAsDeviceValue: 0,
      isHSValidationEnabled: false,
      isValidationAutomated: false,
      isBatteryConnectedToTheDut: false,
      isFrSwapBoardConnected: false,
      serverURL: '',
      typeCPortOnHub: 0,
      numberofType_C_Ports: "",
      numberofMicroBPorts: '',
      isConnectedHub: false,
    },

    dpAltModeConfiguration: {
      dpAltModeDeviceCaps: "",
      dpAltModeDeviceType: "",
      dpAltModeSinkType: "",
    },

    deterministicConfig: {
      vconnVoltage: ""
    },

    pdMergedConfig: {
      cableEnd: "",
      noiseType: '',
    },

    cbChargerConfiguration: {
      is_FRSwapConnected: false,
      is_FLIRConnected: false,
    },
    mfiChargerConfiguration: {
      selectedEloadChannel: Constants.ELOAD_CHANNEL[0],
      isCaptiveLightningPlugChecked: false,
    },
    bc_1_2TestConfiguration: {
      secondary_detection: '',
      bC_1_2_MaxCurrent: ''
    }
  },
  controllerCapability:
  {
    port1: {
      uutDeviceTypePort: "Select Controller Mode",  //changes
      cableTypePort: 'Select Cable Type',
      portType: 'Select Port',
      pdType: ' Select PD Spec Rev',
      sopType: "Select SOP",
      messageType: 'Select Message Type',
      podType: 'Select Index Value',
      supplyType: 'Select Supply',
      appMode: Constants.APP_MODE[0],
      cableEmulation: Constants.CABLE_EMULATION[0],
    },

    port2: {
      uutDeviceTypePort: "Select Controller Mode1",
      cableTypePort: 'Select Cable Type1',
      portType: 'Select Port',
      pdType: 'Select PD Spec',
      sopType: "Select SOP",
      messageType: 'Select Message Type',
      podType: 'Select Index Value',
      supplyType: 'Select Supply',
      cableEmulation: Constants.CABLE_EMULATION[0],
      appMode: Constants.APP_MODE[0],
    }
  },

  configControlChannels: {
    isCheckedVbus: true,
    isCheckedCc1: false,
    isCheckedCc2: false,
  },

  reportUserInputs: {
    testRunInfo: [],
    savePath: '',
    manufacturer: '',
    modelNumber: '',
    serialNumber: '',
    testLab: '',
    testEngineer: '',
    remarks: '',
    reportFolderPath: '',
  },
  reportPathStatus: {
    status: true,
    desc: "",
  },
  reportInputs: {//TODO Ajith this can be deprecated right 
    testRunInfo: [],
    // testReportFileName: 'GRL_REPORT.html',
    // testReportData: 'GRL_REPORT.zip',
    // showFileModal: false,
    // showReportDataModal: false,
  },//TODO END

  results: {
    testResultsList: []
  },

  saveTraceFileModal: false,
  saveWaveFormFileName: 'GRL_Signal_File.grltrace',

  /************* Chart Component related Variables. **************/
  //status.appState 
  //currentPanelIndex: 0,
  //ccPacket.scrollToCCPacket
  /*channelList: [],
  signalFileStopTime: 0,
  signalFileStartTime: 0,
  signalFileReadStatus: 'BUSY',
  absoluteStopTime: 0,
  absoluteStartTime: 0,
  isPlotDataLoading: false,
  showVerticalBar: false,
  isChart_rerender: 1,
  vBar_zIndex_markerNum: Constants.MARKER_ONE,
  chartValues: {
    startTimeZoom: '',
    endTimeZoom: ''
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
  },        */

  /*************** END **************/

  WaveformFile: {
    FilePath: ""
  },
  popUpInputs: {
    userTextBoxInput: '',
    responseButton: '',
    shouldTextBoxBeAdded: false,
    isValid: true,
    popID: 0,
    displayPopUp: false, //Deprecate this .. same as isValid
    title: '',
    message: '',
    button: '',
    image: '',
    icon: '',
    isFrontEndPopUp: false,
    callBackMethod: null,
    comboBoxEntries: [],
    defaultResponseButton: '',
    showTimer: false,
    showTimerForModal: 15,
    spinnerID: 0,
    spinnerDesc: '',
    mandatePopUp: false,
  },
  popupTimer: {
    restoreDefaultTimerValue: 120,
    interval: {},
  },
  commonMoiSetting: {
    defaultTimerForPopup: '',
    isDisableAllPopupChecked: false,
    reRunCondition: [],
    enableDebugMode: false,
  },
  currentReportFileName: "",
  testExecutionProgressPercentage: null,
  // ccPacket: {
  //   packetDetails: [],
  //   scrollToCCPacket: 0
  // },
  ConfigControllerModes: {
    data: ['UFP', 'DFP', 'DRP']
  },
  ConfigControllerCableTypes: {
    data: ['GRL-Spl-cable', 'Test']
  },
  ConfigControllerPortTypes: {
    types: ['portA', 'portB']
  },
  ConfigControllerPDSpecRevisionTypes: {
    PDSpecsTypes: ['Rev2', 'Rev3']
  },
  configMessage: {
    JSONObject: []
  },//TODO END

  productCapabilityProps: {
    vifFileName: Constants.VIF_LOAD_BTN_DEFAULT,
    executionMode: Constants.INFORMATIONAL_MODE,
    rerenderRandomNum: 0,
    ports: {
      "PortA": new ProductCapabilityProps(Constants.PORTA),
      "PortB": new ProductCapabilityProps(Constants.PORTB)
    }
  },
  softwareVersion: "",
  testExecutionRepeat: 0,

  configControl: {
    c2Config: {
      portType: 0,
      controllerMode: 0,
      cableType: 0,
      pdSpecType: 0,
      appMode: 0,
      cableEmulation: 0,
      rpLevel: 0,
      fixtureSelection: 0,
    },
    sendMessage: {
      sopType: 0,
      messageType: 0,
      svid: 'FF01',
    }
  },
  irDropCalibration: {
    saveLocation: 0,
    cableType: 0,
    cableName: "",
    captureLocation: ""

  },

  irDropTableValues: {},

  requestMessage: {
    SupplyIndex: 0,
    PDOIndex: 0,
    GiveBackFlag: false,
    CapabilityMismatch: false,
    USBCommunicationsCableMismatch: false,
    USBSuspend: false,
    UnchunckedExtendMessageSupport: false,
    OperatingCurrent: 1,
    MaximumCurrent: 1,
    MinimumCurrent: 1,
    OperatingPower: 1,
    MaximumPower: 1,
    MinimumPower: 1,
    PpsOperatingCurrent: 1,
    OutputVolatge: 1,
  },
});

class BaseModal {
  constructor() {
    this.vifDataModal = new VIFDataModal();
    this.rulesEngine = new RulesEngine();
    this.vifComboBoxRules = new VIFComboBoxRules();
    this.metaData = new MetaData(metadatajson);
    this.usbIf = new UsbIf(usbIfjson);
    this.chartModal = null;
  }

  syncMoiConfigurations() {
    this.putMoiPd3Components();
    this.putDpAltComponents();
    this.putMoiQc3Components();
    this.putMoiQc4Components();
    this.putMoiSptComponents();
    this.putMoiTbtComponents();
    this.putDeterministicComponents();
    this.putPdMergedComponents();
    this.putMoiFunctionalComponents();
    this.putMoiPd2Components();
    this.putCbComponents();
    this.putPortConfig();
    this.putBC_1_2Configuration();
    this.putMfiChargerTestConfiguration();
  }

  syncDataToServer() {

    this.syncMoiConfigurations();
    //postReportInputs must be the last call of this method
    //Call back used only in this to make sure the test results list gets set after all the properties have been sent to the backend
    this.postReportInputs(this.postSelectedTestList.bind(this));
  }

  syncDataFromServer() {
    mouseBusy(true)
    this.getSoftwareVersion()
    this.getAppMode()
    this.loadConnectionSetupPanelValues()
    this.getIPAddressHistory();
    this.getAppState(this.syncAjaxCalls.bind(this));
    this.getCertificationFilter();
    this.getIRDropCalibration();
    this.getReportInputs();
    this.getProjectFolderName();
    // this.getIRDropCalibrationTableValues();
    //TODO Instead of waiting fixed time interval check on all above ajax calls and set to false
    // setTimeout(() => {
    //   mouseBusy(false)
    // }, 8000);
    setTimeout(() => {
      mainstore.connectionStatusLoader = true
    }, 2000);
  }

  syncAjaxCalls() {
    //TOODO get all panels data and store value in main store
    if (mainstore.status.appState === Constants.BUSY) {
      mainstore.chartPollEnabled = true;
      mainstore.currentPanelIndex = 3;
    }
    mainstore.panelResultPolling = true;//Get test results to display 
    this.getQcLegacyTestList();
    this.getPortConfig(this.getTestList.bind(this))
    this.getMoiPd3Components();
    this.getMoiDeterministicComponents();
    this.getMoiPdMergedComponents();
    this.getMoiDpAltComponents();
    this.getMoiQc4Components();
    this.getMoiQc3Components();
    this.getMoiSptComponents();
    this.getMoiTbtComponents();
    this.getMoiFunctionalComponents();
    this.getMoiPd2Components();
    this.getCBComponents();
    this.getResultsFolderList();
    this.getResultsFolderName();
    this.getBC_1_2Configuration();
    this.getMfiChargerConfiguration();
    this.getCommonTestConfiguration();

    this.getC2Configuration();
    this.getConfigSendMessage();
  }

  syncConnectionSetup(ipaddress, callback) {
    var me = this
    ajax.callGET(Constants.URL_ConnectionSetup + ipaddress, {}, function (response) {
      mainstore.connectionInfo = response.data;
      me.getConnectionInfo();
      if (callback)
        callback();
    }, function (error) {
      console.log("Error", error);
    });
  }

  getConnectionInfo() {
    var me = this;
    me.getIPAddressHistory()
    me.getTestList()
    me.getCableName()
    mainstore.connectionStatusLoader = false
    mainstore.irDropCalibrationStatus = ""
    if (mainstore.connectionInfo.testerStatus === "Connected") {
      mainstore.isTesterStatusNotConnected = false
      me.getIrDropCalibrationStatus();
      me.getIRDropCalibrationTableValues()    //Getting the ir drop table values only if tester is connected, We want to call this on both connect btn click and reload application time
      me.latestFirmwareVersion();

    }
    else {
      mainstore.isTesterStatusNotConnected = true
      mainstore.irDropTableValues = {}        //we're clearing the Ir Drop table Values When tester is not connected.So here emptying the object
    }
    mouseBusy(false)
  }

  loadConnectionSetupPanelValues(callback) {
    var me = this;
    ajax.callGET(Constants.URL_ConnectionSetup, {}, function (response) {
      mainstore.connectionInfo = response.data;//Only restore IP address and not connetion status
      //me.syncConnectionSetup(response.data.testerIpAddress)
      me.getConnectionInfo();
      if (callback)
        callback();
    }, function (error) {
      console.log("Error", error);
    });
  }

  setIPAddress(ipaddress, callback) {
    this.syncConnectionSetup(ipaddress, callback)
  }
  getIPAddressHistory(callback) {
    ajax.callGET(Constants.URL_ConnectionSetup + "GetIPAddressHistory", {}, function (response) {
      mainstore.IPAddressHistory = response.data;
      //Set the current active ip address
      if (mainstore.connectionInfo.testerStatus === "Connected") {
        mainstore.IPAddressHistory.forEach(element => {
          if (element.ipAddress === mainstore.connectionInfo.testerIpAddress) {
            element.isActive = true
          }
        });
      }
      if (callback)
        callback();
    }, function (error) {
      console.log("Error", error);
    });
  }
  discoverIPAddress(callback) {
    ajax.callGET(Constants.URL_ConnectionSetup + "DiscoverIPAddress", {}, function (response) {
      mainstore.IPAddressHistory = response.data;
      if (callback)
        callback();
    }, function (error) {
      console.log("Error", error);
    });
  }

  //General App Start

  getAppState(callBack) {
    ajax.callGET(Constants.URL_App + "GetAppState", {}, function (response) {
      mainstore.status = response.data;

      if (callBack)
        callBack();
    }, function (error) {
      console.log("Error", error);
    });
  }

  getServerState(callBack) {
    ajax.callGET(Constants.URL_App + "GetServerState", {}, function (response) {
      mainstore.alert = response.data;
      if (callBack)
        callBack();
    }, function (error) {
      console.log("Error", error);
    });
  }

  getAppMode(callBack) {
    ajax.callGET(Constants.URL_App + "GetAppMode", {}, function (response) {
      mainstore.apiMode.isAppModeAPI = response.data;
      if (callBack)
        callBack();
    }, function (error) {
      console.log("Error", error);
    })
  }

  forceStopCurrentExecution(callBack) {
    ajax.callGET(Constants.URL_ConnectionSetup + "ForceStopCurrentExecution", {}, function (response) {
      mainstore.isSetAppModeToggled = false;
      if (callBack)
        callBack();
    }, function (error) {
      console.log("Error", error);
    });
  }

  putAppMode() {
    ajax.callPUT(Constants.URL_App + "PutAppMode/" + mainstore.apiMode.isAppModeAPI, {}, function (response) {
    }, function (error) {
      console.log("Error", error);
    })
  }

  putProjectFolderName() {
    ajax.callPUT(Constants.URL_App + "PutProjectFolderName/" + mainstore.productCapsProjectName, {}, function (response) {
    }, function (error) {
      console.log("Error", error);
    })
  }

  getProjectFolderName() {
    ajax.callPUT(Constants.URL_App + "GetProjectFolderName", {}, function (response) {
      mainstore.productCapsProjectName = response.data
    }, function (error) {
      console.log("Error", error);
    })
  }

  //General App Ends

  // TestConfig Panel Start
  // resetTestResults() {
  //   ajax.callPUT(Constants.URL_TestConfiguration + "PutResetTestResults/", {}, function (response) {
  //   }, function (error) {
  //     console.log("Error", error);
  //   });
  // }

  putCertificationFilter(certFilter, callBack) {
    ajax.callPUT(Constants.URL_TestConfiguration + "PutCertificationFilter/" + certFilter, {}, function (response) {
      if (callBack)
        callBack()
    }, function (error) {
      console.log("Error", error);
    });
  }

  putVIFData(portnumber, VifInfo, callback) {
    ajax.callPUT(Constants.URL_ProductCapability + "PutVIFData/" + portnumber, VifInfo, function (response) {
      if (callback)
        callback()
    }, function (error) {
      console.log("Error", error);
    });
  }

  getCertificationFilter() {
    ajax.callGET(Constants.URL_TestConfiguration + "GetCertificationFilter", {}, function (response) {
      mainstore.testConfiguration.selectedCertifiedFilter = response.data
    }, function (error) {
      console.log("Error", error);
    });
  }
  getTestList() {
    ajax.callGET(Constants.URL_TestConfiguration + "GetTestCaseList", {}, function (response) {
      mainstore.testConfiguration.testList = response.data
      mainstore.selectedMoiTestCase = [];
      mainstore.selectedTestCaseCount = []
      mainstore.testConfiguration.selectedTestList = []
    }, function (error) {
      console.log("Error", error);
    });
  }

  getQcLegacyTestList() {
    ajax.callGET(Constants.URL_TestConfiguration + "GetQcLegacyTestCaseList", {}, function (response) {
      mainstore.qcLegacyTestCase = response.data
    }, function (error) {
      console.log("Error", error);
    });
  }

  getCableName() {
    ajax.callGET(Constants.URL_TestConfiguration + "GetCableName", {}, function (response) {
      mainstore.getCableNameForTooltip = response.data
    }, function (error) {
      console.log("Error", error);
    });
  }
  getCapabilities(portnumber, callback) {
    ajax.callGET(Constants.URL_ProductCapability + "GetCapability/" + portnumber, {}, function (response) {
      if (callback) {
        setTimeout(() => {
          callback(response.data);
        }, 2000);
      }
    }, function (error) {
      console.log("Error", error);
    });
  }
  getStopTestExecution(callback) {
    ajax.callGET(Constants.URL_TestConfiguration + "StopTestExecution", {}, function (response) {
      if (callback)
        callback()
    }, function (error) {
      console.log("Error", error);
    });
  }

  postSelectedTestList() {
    ajax.callPOST(Constants.URL_TestConfiguration + "PostTestListToExecute/" + mainstore.testExecutionRepeat, mainstore.testConfiguration.selectedTestList, function (response) {
      mainstore.panelResultPolling = true;      //Start polling      
      mainstore.chartPollEnabled = true;
    }, function (error) {
      console.log("Error", error);
    });
  }

  putCommonTestConfiguration() {
    ajax.callPUT(Constants.URL_TestConfiguration + "PutCommonTestConfiguration", mainstore.commonMoiSetting, {}, function (response) {
    }, function (error) {
      console.log("Error", error);
    });
  }

  //MOI Components Get calls
  getMoiPd3Components() {
    ajax.callGET(Constants.URL_TestConfiguration + "GetPD3Configuration", {}, function (response) {
      mainstore.testConfiguration.pd3Configuration = response.data;
    }, function (error) {
      console.log("Error", error);
    });
  }

  getMoiDeterministicComponents() {
    ajax.callGET(Constants.URL_TestConfiguration + "GetDeterministicConfiguration", {}, function (response) {
      mainstore.testConfiguration.deterministicConfig = response.data;
    }, function (error) {
      console.log("Error", error);
    });
  }

  getMoiPdMergedComponents() {
    ajax.callGET(Constants.URL_TestConfiguration + "GetPdMergedConfiguration", {}, function (response) {
      mainstore.testConfiguration.pdMergedConfig = response.data;
    }, function (error) {
      console.log("Error", error);
    });
  }

  getMoiDpAltComponents() {
    ajax.callGET(Constants.URL_TestConfiguration + "GetDpAltConfiguration", {}, function (response) {
      mainstore.testConfiguration.dpAltModeConfiguration = response.data;
    }, function (error) {
      console.log("Error", error);
    });
  }

  getMoiQc4Components() {
    ajax.callGET(Constants.URL_TestConfiguration + "GetQC4Configuration", {}, function (response) {
      mainstore.testConfiguration.qc4Configuration = response.data;
    }, function (error) {
      console.log("Error", error);
    });
  }

  getMoiQc3Components() {
    ajax.callGET(Constants.URL_TestConfiguration + "GetQC3Configuration", {}, function (response) {
      mainstore.testConfiguration.qc3Configuration = response.data;
    }, function (error) {
      console.log("Error", error)
    });
  }

  getMoiSptComponents() {
    ajax.callGET(Constants.URL_TestConfiguration + "GetSPTConfiguration", {}, function (response) {
      mainstore.testConfiguration.sptConfiguration = response.data;
    }, function (error) {
      console.log("Error", error)
    });
  }

  getMoiTbtComponents() {
    ajax.callGET(Constants.URL_TestConfiguration + "GetTBTConfiguration", {}, function (response) {
      mainstore.testConfiguration.tbtConfiguration = response.data;
    }, function (error) {
      console.log("Error", error)
    });
  }

  getMoiFunctionalComponents() {
    ajax.callGET(Constants.URL_TestConfiguration + "GetFunctionalConfiguration", {}, function (response) {
      mainstore.testConfiguration.functionalConfiguration = response.data;
    }, function (error) {
      console.log("Error", error)
    });
  }

  getMoiPd2Components() {
    ajax.callGET(Constants.URL_TestConfiguration + "GetPD2Configuration", {}, function (response) {
      mainstore.testConfiguration.pd2Configuration = response.data;
    }, function (error) {
      console.log("Error", error)
    });
  }

  getCBComponents() {
    ajax.callGET(Constants.URL_TestConfiguration + "GetCBConfiguration", {}, function (response) {
      mainstore.testConfiguration.cbChargerConfiguration = response.data;
    }, function (error) {
      console.log("Error", error)
    });
  }

  getMfiChargerConfiguration() {
    ajax.callGET(Constants.URL_TestConfiguration + "GetMfiChargerConfiguration", {}, function (response) {
      mainstore.testConfiguration.mfiChargerConfiguration = response.data;
    }, function (error) {
      console.log("Error", error)
    });
  }

  getEloadsOnScan() {
    ajax.callGET(Constants.URL_TestConfiguration + "GetEloadsOnScan", {}, function (response) {
      mainstore.mfi_Eloads = response.data;
    }, function (error) {
      console.log("Error", error)
    });
  }

  getEloadConnected() {
    ajax.callGET(Constants.URL_TestConfiguration + "GetEloadConnected", {}, function (response) {
      mainstore.isMfiEloadConnected = response.data;
    }, function (error) {
      console.log("Error", error)
    });
  }

  getBC_1_2Configuration() {
    ajax.callGET(Constants.URL_TestConfiguration + "GetBC_1_2Configuration", {}, function (response) {
      mainstore.testConfiguration.bc_1_2TestConfiguration = response.data;
    }, function (error) {
      console.log("Error", error);
    });
  }

  getCommonTestConfiguration() {
    ajax.callGET(Constants.URL_TestConfiguration + "GetCommonTestConfiguration", {}, function (response) {
      mainstore.commonMoiSetting = response.data;
      mainstore.popupTimer.restoreDefaultTimerValue = mainstore.commonMoiSetting.defaultTimerForPopup
      mainstore.copyisAllPopupDisabled = mainstore.commonMoiSetting.isDisableAllPopupChecked
      if (mainstore.status.appState !== Constants.BUSY) {
        mainstore.commonMoiSetting.enableDebugMode = false;   //this should be always false initially , but we're getting from porperty bag based on previous values from Backend , so here forcefully making to false
      }
    }, function (error) {
      console.log("Error", error);
    });
  }

  //MOI Components Get calls End

  //MOI Components Put calls

  putSelectedEload(callback) {
    ajax.callPUT(Constants.URL_TestConfiguration + "PutSelectedEload/" + mainstore.selectedEload, function (response) {
      if (callback)
        callback()
    }, function (error) {
      console.log("Error", error);
    });
  }
  putMoiPd3Components() {
    ajax.callAndWaitPUT(Constants.URL_TestConfiguration + "PutPD3Configuration", mainstore.testConfiguration.pd3Configuration, function () {
    }, function (error) {
      console.log("Error", error);
    });
  }

  putMfiChargerTestConfiguration() {
    ajax.callAndWaitPUT(Constants.URL_TestConfiguration + "PutMfiChargerTestConfiguration", mainstore.testConfiguration.mfiChargerConfiguration, function () {
    }, function (error) {
      console.log("Error", error);
    });
  }

  putBC_1_2Configuration() {
    ajax.callAndWaitPUT(Constants.URL_TestConfiguration + "PutBC_1_2Configuration", mainstore.testConfiguration.bc_1_2TestConfiguration, function () {
    }, function (error) {
      console.log("Error", error);
    });
  }

  putDeterministicComponents() {
    ajax.callAndWaitPUT(Constants.URL_TestConfiguration + "PutDeterministicConfiguration", mainstore.testConfiguration.deterministicConfig, function () {
    }, function (error) {
      console.log("Error", error);
    });
  }

  putPdMergedComponents() {
    ajax.callAndWaitPUT(Constants.URL_TestConfiguration + "PutPdMergedConfiguration", mainstore.testConfiguration.pdMergedConfig, function () {
    }, function (error) {
      console.log("Error", error);
    });
  }

  putDpAltComponents() {
    ajax.callAndWaitPUT(Constants.URL_TestConfiguration + "PutDpAltConfiguration", mainstore.testConfiguration.dpAltModeConfiguration, function () {
    }, function (error) {
      console.log("Error", error);
    });
  }

  putMoiQc4Components() {
    ajax.callAndWaitPUT(Constants.URL_TestConfiguration + "PutQC4Configuration", mainstore.testConfiguration.qc4Configuration, function () {
    }, function (error) {
      console.log("Error", error);
    });
  }

  putMoiQc3Components() {
    ajax.callAndWaitPUT(Constants.URL_TestConfiguration + "PutQC3Configuration", mainstore.testConfiguration.qc3Configuration, function () {
    }, function (error) {
      console.log("Error", error);
    });
  }

  putMoiSptComponents() {
    ajax.callAndWaitPUT(Constants.URL_TestConfiguration + "PutSPTConfiguration", mainstore.testConfiguration.sptConfiguration, function () {
    }, function (error) {
      console.log("Error", error)
    });
  }

  putMoiTbtComponents() {
    ajax.callAndWaitPUT(Constants.URL_TestConfiguration + "PutTBTConfiguration", mainstore.testConfiguration.tbtConfiguration, function () {
    }, function (error) {
      console.log("Error", error)
    });
  }

  putMoiFunctionalComponents() {
    ajax.callAndWaitPUT(Constants.URL_TestConfiguration + "PutFunctionalConfiguration", mainstore.testConfiguration.functionalConfiguration, function () {
    }, function (error) {
      console.log("Error", error)
    });
  }

  putMoiPd2Components() {
    ajax.callAndWaitPUT(Constants.URL_TestConfiguration + "PutPd2Configuration", mainstore.testConfiguration.pd2Configuration, function () {
    }, function (error) {
      console.log("Error", error)
    });
  }

  putCbComponents() {
    ajax.callAndWaitPUT(Constants.URL_TestConfiguration + "PutCBConfiguration", mainstore.testConfiguration.cbChargerConfiguration, function () {
    }, function (error) {
      console.log("Error", error)
    });
  }
  //MOI Components Put calls End

  //Product Capability Start 
  putPortConfig(callback) {
    ajax.callPUT(Constants.URL_ProductCapability + "PutPortConfigurations/", mainstore.productCapabilityProps, function (response) {
      if (callback)
        callback()
    }, function (error) {
      console.log("Error", error);
    });
  }

  putClearGetCapsData() {
    ajax.callPUT(Constants.URL_ProductCapability + "PutClearGetCapsData", {}, function (response) {

    }, function (error) {
      console.log("Error", error);
    });
  }

  putClearTestResults() {
    ajax.callPUT(Constants.URL_Results + "PutClearTestResults", {}, function (response) {

    }, function (error) {
      console.log("Error", error);
    })
  }

  getPortConfig(callback) {
    ajax.callGET(Constants.URL_ProductCapability + "GetPortConfigurations", {}, function (response) {
      if (response.data) {
        mainstore.loadSelectedCableFromBackend = true;
        var portA = response.data.ports[Constants.PORTA]
        var portB = response.data.ports[Constants.PORTB]
        mainstore.productCapabilityProps.vifFileName = Constants.VIF_LOAD_BTN_DEFAULT//TODO Load file instead of clearing to default
        // mainstore.productCapabilityProps.executionMode = response.data.executionMode
        mainstore.productCapabilityProps.rerenderRandomNum = response.data.rerenderRandomNum
        mainstore.productCapabilityProps.ports[Constants.PORTA] = new ProductCapabilityProps(Constants.PORTA, portA.dutType, portA.cableType, portA.stateMachineType)
        mainstore.productCapabilityProps.ports[Constants.PORTB] = new ProductCapabilityProps(Constants.PORTB, portB.dutType, portB.cableType, portB.stateMachineType)
        if (callback)
          callback()
      }

    }, function (error) {
    });

  }
  //Product Capability End

  //Report Generation Start
  getReportPathStatus() {
    ajax.callGET(Constants.URL_ReportConfiguration + "GetReportPathStatus", {}, function (response) {
      mainstore.reportPathStatus = response.data
    }, function (error) {
      console.log("Error", error)
    });
  }

  getCurrentReportFileName() {
    ajax.callGET(Constants.URL_ReportConfiguration + "GetReportFileName", {}, function (response) {
      mainstore.currentReportFileName = ""
      mainstore.currentReportFileName = response.data
    }, function (error) {
      console.log("Error", error)
    });
  }

  getCurrentReportFile(callback) {
    ajax.callGET(Constants.URL_ReportConfiguration + "GetReportFile", {}, function (blob) {
      fileDownloader(blob.data, mainstore.popUpInputs.userTextBoxInput)
      if (callback)
        callback();
    }, function (error) {
      var toast = new toastNotification("Please run test cases before downloading report", Constants.TOAST_ERROR)
      toast.show()
      console.log("Error", error)
    });
  }

  generateReport(callback) {
    var toast = new toastNotification("Fetching report files from server", Constants.TOAST_INFO)
    toast.show()
    ajax.fileDownload(Constants.URL_ReportConfiguration + "PostCurrentTestReport", {}, function (blob) {
      fileDownloader(blob, mainstore.popUpInputs.userTextBoxInput)
      if (callback)
        callback();
      toast.hide()
    }, function (progress) {
      if (progress === -1)
        toast.update("Error while downloading report, Please try again!", Constants.TOAST_ERROR)
      else
        toast.update("Report download progress :" + progress + "%", Constants.TOAST_SUCCESS)
      return progress;
    }, function (error) {
      toast.update("Please run test cases before downloading report", Constants.TOAST_ERROR)
      console.log("Error", error);
    });
  }

  getResultsFolderList(callback) {
    ajax.callGET(Constants.URL_ReportConfiguration + "GetTestRunInfo", {}, function (response) {
      mainstore.reportInputs.testRunInfo = response.data;
      if (callback)
        callback();
    }, function (error) {
      console.log("Error", error)
    });
  }

  getResultsFolderName(callback) {
    ajax.callGET(Constants.URL_ReportConfiguration + "GetResultsFolderName", {}, function (response) {
      if (response.data !== "")
        mainstore.reportFolderName = response.data;
      else
        mainstore.reportFolderName = "GRL_REPORT"
      if (callback)
        callback();
    }, function (error) {
      console.log("Error", error)
    });
  }

  deleteTestResult(indexToDelete, callback) {
    ajax.callGET(Constants.URL_ReportConfiguration + "GetDeleteTestResult/" + indexToDelete, {}, function (response) {
      mainstore.reportInputs.testRunInfo = response.data;
      callback();
    }, function (error) {
      console.log("Error", error)
    });
  }

  deleteAllTestResult(callback) {
    ajax.callGET(Constants.URL_ReportConfiguration + "GetDeleteAllTestData", {}, function (response) {
      mainstore.reportInputs.testRunInfo = [];//Clear test info 
      callback();
    }, function (error) {
      console.log("Error", error)
    });
  }

  downloadResults(indexToDownload) {
    ajax.fileDownload(Constants.URL_ReportConfiguration + "PostTestReportForIndex/" + indexToDownload, {}, function (blob) {
      fileDownloader(blob, "GRL_Report.zip")
    }, function (error) {
      console.log("Error", error);
    });
  }

  postReportInputs(callback) {
    var promise = ajax.callAndWaitPOST(Constants.URL_ReportConfiguration + "PostUpdateReportInputs", mainstore.reportUserInputs)
    promise.then(function (value) {
      if (callback)
        callback()//Call back used only in this to make sure the test results list gets set after all the properties have been sent to the backend
    });
  }

  getReportInputs() {
    ajax.callGET(Constants.URL_ReportConfiguration + "GetReportInputs", {}, function (response) {
      mainstore.reportUserInputs = response.data
    }, function (error) {
      console.log("Error", error)
    });
  }
  sendPopUpDetails() {
    clearInterval(mainstore.popupTimer.setIntervalTime)
    ajax.callPUT(Constants.URL_App + "PutMessageBoxResponse", mainstore.popUpInputs, function (error) {
    }, function (error) {
      console.log("Error", error)
    });
  }

  showPopUp(message, icon, title, inputFieldPlaceHolder, shouldTextBoxBeAdded, buttonTypes, image, callback, comboBoxValues) {
    mainstore.popUpInputs.message = message;
    mainstore.popUpInputs.icon = icon;
    mainstore.popUpInputs.title = title;
    mainstore.popUpInputs.displayPopUp = true;
    mainstore.popUpInputs.isFrontEndPopUp = true;
    mainstore.popUpInputs.userTextBoxInput = inputFieldPlaceHolder;
    mainstore.popUpInputs.shouldTextBoxBeAdded = shouldTextBoxBeAdded;
    mainstore.popUpInputs.button = buttonTypes;
    mainstore.popUpInputs.image = image;
    mainstore.popUpInputs.popID = mainstore.popUpInputs.popID++;
    mainstore.popUpInputs.callBackMethod = callback;
    mainstore.popUpInputs.comboBoxEntries = comboBoxValues;
    mainstore.popUpInputs.showTimer = false;
    mouseBusy(false)//Allow user to click when pop up shows up    
  }

  closePopUpAfterTimeOut() {
    mainstore.popupTimer.setIntervalTime = setInterval(() => {
      if (mainstore.handleAutoClosePopup) {
        if (mainstore.popUpInputs.showTimer || mainstore.commonMoiSetting.isDisableAllPopupChecked && mainstore.popUpInputs.mandatePopUp === false) {
          if (mainstore.popUpInputs.showTimer && mainstore.commonMoiSetting.isDisableAllPopupChecked === false) {
            mainstore.popUpInputs.showTimerForModal = mainstore.popUpInputs.showTimerForModal - 1;
          }
          else {
            mainstore.commonMoiSetting.defaultTimerForPopup = mainstore.commonMoiSetting.defaultTimerForPopup - 1;
            mainstore.popUpInputs.showTimerForModal = mainstore.commonMoiSetting.defaultTimerForPopup
          }
          if (mainstore.popUpInputs.showTimerForModal < 0) {
            mainstore.popUpInputs.displayPopUp = false;
            mainstore.popUpInputs.responseButton = mainstore.popUpInputs.defaultResponseButton;
            this.sendPopUpDetails()
            mainstore.commonMoiSetting.defaultTimerForPopup = mainstore.popupTimer.restoreDefaultTimerValue;
            clearInterval(mainstore.popupTimer.setIntervalTime)
          }
        }
        else {
          clearInterval(mainstore.popupTimer.setIntervalTime)
        }
      }
    }, 1000);
  }

  //Report Generation End

  //Test Results Start  

  //Test Results End

  //PLOT AJAX Calls

  putLoadWaveformFile(WaveformFile, callback) {
    mainstore.WaveformFile.FilePath = WaveformFile
    ajax.callPUT(Constants.URL_Plot + "PutLoadWaveformFile", mainstore.WaveformFile, function (response) {
      chartstore.LoadWaveformFile_Response = Constants.RESPONSE_VALID;    //response.status;
      //console.log('PutLoadWaveformFile', response);
      if (callback !== null)
        callback()
    }, function (error) {
      chartstore.LoadWaveformFile_Response = Constants.RESPONSE_INVALID;
      mouseBusy(false);           // make mousebusy false if status is not 200.
      console.log("Error", error)
    });
  }

  saveWaveFormFile(callback) {
    ajax.callGET(Constants.URL_Plot + "GetSaveTraceFile", {}, function (blob) {
      fileDownloader(blob.data, mainstore.popUpInputs.userTextBoxInput)
      if (callback)
        callback();
    }, function (error) {
      console.log("Error", error)
    });
  }

  //Config Controller(New Panel) Ajax calls
  sendConfigControllerUpdates() {
    ajax.callPOST(Constants.URL_Config_C2 + "SendConfigControlParameters/Mode", mainstore.ConfigControllerModes, function (response) {
    }, function (error) {
      console.log("Error", error);
    });
  }
  sendConfigControllerCableDetails() {
    ajax.callPOST(Constants.URL_Config_C2 + "TestCable", mainstore.ConfigControllerCableTypes, function (response) {
    }, function (error) {
      console.log("Error", error);
    });
  }
  sendConfigControllerPortType() {
    ajax.callPOST(Constants.URL_Config_C2 + "TestPort", mainstore.ConfigControllerPortTypes, function (response) {
    }, function (error) {
      console.log("Error", error);
    });
  }
  sendConfigControllerPDSpecRevisionDetails() {
    ajax.callPOST(Constants.URL_Config_C2 + "PDSpecRevisionTypes", mainstore.ConfigControllerPDSpecRevisionTypes, function (response) {
    }, function (error) {
      console.log("Error", error);
    });
  }
  sendConfigControllerJSONObj() {
    ajax.callPOST(Constants.URL_Config_C2 + "configMessage", mainstore.configMessage, function (response) {
    }, function (error) {
      console.log("Error", error);
    });
  }

  //END

  //Start App Controller
  getFirmwareUpdate(callback) {
    ajax.callGET(Constants.URL_App + "GetUpdateFirmware", {}, function (response) {
      if (callback)
        callback();
    }, function (error) {
      console.log("Error", error)
    });
  }

  latestFirmwareVersion() {
    ajax.callGET(Constants.URL_ConnectionSetup + "LatestFirmwareVersion", {}, function (response) {
      mainstore.latestFirmwareVersion = response.data;
    }, function (error) {
      console.log("Error", error)
    });
  }
  updateEloadFirmware(callback) {
    ajax.callGET(Constants.URL_App + "GetUpdateEloadFirmware", {}, function (response) {
      if (callback)
        callback();
    }, function (error) {
      console.log("Error", error)
    });
  }
  getSoftwareVersion() {
    ajax.callGET(Constants.URL_App + "GetSoftwareVersion", {}, function (response) {
      mainstore.softwareVersion = response.data;
    }, function (error) {
      console.log("Error", error)
    });
  }

  getDebugLogs(callback) {
    ajax.callGET(Constants.URL_App + "GetDebugLogs", {}, function (blob) {
      fileDownloader(blob.data, 'Debug_Log.txt')
      if (callback)
        callback();
    }, function (error) {
      console.log("Error", error)
    });
  }

  //End App Controller

  //Plot Mask
  getPlotMaskPoints() {
    ajax.callGET(Constants.URL_Plot + "GetSignalMaskData", {}, function (response) {
      var upperMask = [];
      var lowerMask = [];
      for (var i = 0; i < response.data.length; i++) {
        if (response.data[i]) {
          var xVal_upper = (response.data[i].upperCoordinate[0].time).toFixed(8);
          var yVal_upper = (response.data[i].upperCoordinate[0].voltage).toFixed(8);
          upperMask.push({ x: xVal_upper, y: yVal_upper });
          var xVal_lower = (response.data[i].lowerCoordinate[0].time).toFixed(8);
          var yVal_lower = (response.data[i].lowerCoordinate[0].voltage).toFixed(8);
          lowerMask.push({ x: xVal_lower, y: yVal_lower });
        }
      }

      chartstore.maskUpper_LowerPoints = {
        upperMask_points: upperMask,
        lowerMask_points: lowerMask
      };

    }, function (error) {
      console.log("Error", error)
    });
  }

  //Config Control Start
  getC2Configuration() {
    ajax.callGET(Constants.URL_ConfigControl + "GetC2Configuration", {}, function (response) {
      mainstore.configControl.c2Config = response.data
    }, function (error) {
      console.log("Error", error)
    });
  }

  putC2Configuration(callBack) {
    ajax.callPUT(Constants.URL_ConfigControl + "PutC2Configuration", mainstore.configControl.c2Config, function (response) {
      if (callBack)
        callBack()
    }, function (error) {
      console.log("Error", error);
    });
  }

  configControllerStopCapture(callBack) {
    ajax.callGET(Constants.URL_ConfigControl + "GetConfigControllerStopCapture", {}, function (response) {
      mainstore.configControlSaveLocation = response.data
      if (callBack)
        callBack()
    }, function (error) {

      console.log("Error", error)
    });
  }

  configControllerStartCapture(callback) {
    ajax.callPUT(Constants.URL_ConfigControl + "PutConfigControllerStartCapture", mainstore.configControlChannels, function (response) {
      if (callback)
        callback()
    }, function (error) {
      console.log("Error", error)
    });
  }

  putSimulateAttachDetach(selectedType) {
    ajax.callPUT(Constants.URL_ConfigControl + "PutSimulateAttachDetach/" + selectedType, {}, function (response) {

    }, function (error) {
      console.log("Error", error);
    });
  }
  //Config Control End

  // Config controller Send Message
  getConfigSendMessage() {
    ajax.callGET(Constants.URL_ConfigControl + "GetConfigSendMessage", {}, function (response) {
      mainstore.configControl.sendMessage = response.data;
    }, function (error) {
      console.log("Error", error)
    });
  }

  putConfigSendMessage() {
    ajax.callPUT(Constants.URL_ConfigControl + "PutConfigSendMessage", mainstore.configControl.sendMessage, function (response) {

    }, function (error) {
      console.log("Error", error);
    });
  }

  // IR Drop Calibration
  getIRDropCalibrationTableValues() {
    ajax.callGET(Constants.URL_IRDrop_Calibration + "GetIRDropCalibrationTableValues", {}, function (response) {
      mainstore.irDropTableValues = response.data;
    }, function (error) {
      console.log("Error", error)
    });
  }

  getIrDropCalibrationStatus() {
    ajax.callGET(Constants.URL_IRDrop_Calibration + "GetIrDropCalibrationStatus", {}, function (response) {
      mainstore.irDropCalibrationStatus = response.data;
    }, function (error) {
      console.log("Error", error)
    });
  }

  getIrDropLogMessage() {
    ajax.callGET(Constants.URL_IRDrop_Calibration + "GetIrDropLogMessage", {}, function (response) {
      var res = response.data.split()           //receving string from Backend, so converting string to array format , for that used split method
      mainstore.logMessages = res
    }, function (error) {
      console.log("Error", error)
    });
  }

  downloadIrDropFile(callback) {
    ajax.callGET(Constants.URL_IRDrop_Calibration + "GetDownloadIrDropFile", {}, function (blob) {
      fileDownloader(blob.data, mainstore.popUpInputs.userTextBoxInput)
      if (callback)
        callback();
    }, function (error) {
      console.log("Error", error)
    });
  }

  getIRDropCalibration() {
    ajax.callGET(Constants.URL_IRDrop_Calibration + "GetIRDropCalibration", {}, function (response) {
      mainstore.irDropCalibration = response.data;
    }, function (error) {
      console.log("Error", error)
    });
  }

  putIRDropCalibration(callBack) {
    ajax.callPUT(Constants.URL_IRDrop_Calibration + "PutIRDropCalibration", mainstore.irDropCalibration, function (response) {
      if (callBack)
        callBack()
    }, function (error) {
      console.log("Error", error);
    });
  }

  // Config controller Request Message
  putConfigRequestMessage() {
    ajax.callPUT(Constants.URL_ConfigControl + "PutConfigRequestMessage", mainstore.requestMessage, function (response) {

    }, function (error) {
      console.log("Error", error);
    });
  }

  // 5 Port Testing
  putFivePortTestingConfig() {
    ajax.callPUT(Constants.URL_FivePortConfig + "PutFivePortTestingConfig", mainstore.fivePortConfiguration, function (response) {
    }, function (error) {
      console.log("Error", error);
    });
  }

  putCurrentSelectedPort(callback) {
    ajax.callPUT(Constants.URL_FivePortConfig + "PutCurrentSelectedPort", mainstore.currentPortStatus, {}, function (response) {
      setTimeout(() => {
        if (callback)
          callback()
      }, 3000);
    }, function (error) {
      console.log("Error", error);
    });
  }

  getCurrentSelectedPortStatus(callback) {
    ajax.callGET(Constants.URL_FivePortConfig + "GetCurrentSelectedPortStatus", {}, function (response) {
      mainstore.fivePortSelectedPortStatus = response.data
      if (callback)
        callback()
    }, function (error) {
      console.log("Error", error);
    });
  }

  getCaptureFile(callback) {
    ajax.callGET(Constants.URL_ConfigControl + "GetCaptureFile", {}, function (blob) {
      fileDownloader(blob.data, mainstore.configControlSaveLocation + ".zip")
      if (callback)
        callback();
    }, function (error) {
      var toast = new toastNotification("Please run test cases before downloading capture", Constants.TOAST_ERROR)
      toast.show()
      console.log("Error", error)
    });
  }

  getTryCableFlip() {
    ajax.callGET(Constants.URL_ConfigControl + "GetTryCableFlip", {}, function (response) {
    }, function (error) {
      console.log("Error", error)
    });
  }

  tbtSelfCalibration(callback) {
    ajax.callGET(Constants.URL_ConfigControl + "SetTBTSelfCalibration", {}, function (response) {
      if (callback)
        callback();
    }, function (error) {
      console.log("Error", error)
    });
  }

  getSelectedTabMoiConfiguration(selectedTab, previousActiveTab) {
    mainstore.testConfigurationFivePort[previousActiveTab] = JSON.parse(JSON.stringify(mainstore.testConfiguration));
    if (mainstore.testConfigurationFivePort[selectedTab]) {
      mainstore.testConfiguration = JSON.parse(JSON.stringify(mainstore.testConfigurationFivePort[selectedTab]));
    }
    else {
      this.resettingMoiConfigValues();
    }
  }

  resettingMoiConfigValues() {
    mainstore.testConfiguration = {
      selectedCertifiedFilter: Constants.CERTIFICATION_FILTER[0],
      selectedTestList: [],
      testList: [],

      pd2Configuration: {
        noiseType: "",
      },
      tbtConfiguration: {
        portType: '',
        poweredType: '',
        deviceType: '',
        stressTiming: '',
        isPortACapMisMatchSet: false,
        isPortAGiveBackSet: false,
        isPortBCapMisMatchSet: false,
        isPortBGiveBackSet: false,
      },

      qc3Configuration: {
        dutType: '',
        connectorType: '',
        irDrop: '',
        ratedCurrent5V: '',
        ratedCurrent9V: '',
        ratedCurrent12V: '',
        ratedCurrent20V: '',
        dutRatedPower: '',
        ports: '',
        pdSupported: '',
        qcDUTtype: '',
        inputSupplyVoltage: '',
        isUUTSupports20V: false,
      },

      sptConfiguration: {
        portType: ''
      },

      qc4Configuration: {
        dutType: '',
        roomTemperature: ''
      },

      functionalConfiguration: {
        typeCCanActAsHostValue: "",
        typeCCanActAsDeviceValue: "",
        isHSValidationEnabled: false,
        isValidationAutomated: false,
        isBatteryConnectedToTheDut: false,
        serverURL: ''
      },

      dpAltModeConfiguration: {
        dpAltModeDeviceCaps: "",
        dpAltModeDeviceType: "",
        dpAltModeSinkType: "",
      },

      deterministicConfig: {
        vconnVoltage: ""
      },
      cbChargerConfiguration: {
        is_FRSwapConnected: false,
        is_FLIRConnected: false,
      },
      mfiChargerConfiguration: {
        isCaptiveLightningPlugChecked: false,
      },
      bc_1_2TestConfiguration: {
        secondary_detection: '',
        bC_1_2_MaxCurrent: ''
      },
      pd3Configuration: {
        isExternalBoardConnected: false,
      }
    }
  }

  //dp aux config

  putStartDpAuxSniffer() {
    ajax.callPUT(Constants.URL_DpAuxSniffer + "PutStartDpAuxSniffer", {}, function (response) {
    }, function (error) {
      console.log("Error", error);
    });
  }

  putEndDpAuxSniffer() {
    ajax.callPUT(Constants.URL_DpAuxSniffer + "PutEndDpAuxSniffer", {}, function (response) {
    }, function (error) {
      console.log("Error", error);
    });
  }
}

export const basemodal = new BaseModal();
