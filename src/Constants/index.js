export const PANELS = [{ title: "Connection Setup", name: "ConnectionSetup" },
{ title: "Product Capability", name: "ProductCapability" },
{ title: "Test Config", name: "TestConfiguration" },
{ title: "Results", name: "Results" },
/*{title:"Plot",name:"Plot"},*/
{ title: "Report", name: "ReportsGeneration" },
{ title: "Options", name: "Options" },
{ title: "Help", name: "Help" },
];

const URL_Server_Address = "http://" + window.location.hostname + ":5001/"
export const URL_base = URL_Server_Address + "api/";
export const URL_ConnectionSetup = URL_base + PANELS[0].name + "/";
export const URL_ProductCapability = URL_base + PANELS[1].name + "/";
export const URL_TestConfiguration = URL_base + PANELS[2].name + "/";
export const URL_Results = URL_base + PANELS[3].name + "/";
export const URL_ReportConfiguration = URL_base + PANELS[4].name + "/";
export const URL_Plot = URL_base + "Plot/";
export const FILE_UPLOAD_PATH_VIF = URL_base + "ProductCapability/PutVIFFile/";
export const URL_Current_Report = URL_Server_Address + 'Report/';
export const URL_App = URL_base + 'App/';
export const URL_Config_C2 = URL_base + "/Config_C2/"
export const URL_ConfigControl = URL_base + "ConfigControl/";
export const URL_IRDrop_Calibration = URL_base + "IRDropCalibration/";
export const URL_FivePortConfig = URL_base + PANELS[2].name + "/";
export const URL_DpAuxSniffer = URL_base + "DpAuxDecode/";

export const USBPDDeviceType = ["Consumer Only",
    "Consumer Provider",
    "Provider Consumer",
    "Provider Only",
    "Dual Role Power[DRP]",
    "Cable",
    "Type C Only",
];
export const STATE_MACHINE = ["SRC", "SNK", "DRP"]
export const PORTA = "PortA";
export const PORTB = "PortB";
export const ExPORTA = "ExPortA";
export const ExPORTB = "ExPortB";
export const ExPORTC = "ExPortC";
export const ExPORTD = "ExPortD";
export const ExPORTE = "ExPortE";
export const VIF_LOAD_BTN_DEFAULT = "Load XML VIF File";
// MOI Configuration START
export const QC4DutTypes = ['QC4', 'QC4Plus', "QC5"]
export const QC3DutTypes = ['QC2', 'QC3', 'QC3Plus', 'QC4Plus']
export const QC3Connectortype = ["TypeA_TypeC", "TypeC_TypeC"]
export const NoOfPorts = ["Single_Port", "Two_Port"]
export const PDSupport = ["Non-PD", "PD"]
export const QCDutCategory = ["Power_Adaptor", "Power_bank", "Car_Charger"]
export const PoweredType = ["Self_Powered", "Bus_Powered"]
export const TBTDutCategory = ["Host", "Device"]
export const DPDeviceType = ["DP_Source", "DP_Sink"]
export const DPDeviceCaps = ["UFP_Source", "UFP_Sink", "DFP_Source", "DFP_Sink"]
export const DPAltModeSinkType = ["TypeC_DP_Adaptor", "TypeC_Non_DP_Adaptor"]
export const CommunicationEngineVconnVoltageLevel = ["_5_75V", "_2_75V", "_4_25V", "_4_75V"]
export const DeterministicVconnVoltageLevel = ["_2_75V", "_5_75V"]
export const PD2Noise = ["Two Tone Noise", "Square Wave Noise"]
export const BCDetectionTypes = ['Implemented', 'Not_Implemented']
export const CONNECTOR_TYPE_CABLE = ['Spl_Emarker_Cable', 'Standard_Cable']

// MOI Configuration END

//MOI Selection Constants
export const Qc4Tests = "Quick Charge 4 Tests";
export const Qc3Tests = "Quick Charger 3.0 Tests";
export const SourcePowerTests = "Source Power Tests";
export const TbtTests = "Thunderbolt Power Tests";
export const FunctionalTests = "USB-C Functional Tests";
export const DpAltModeTests = "DisplayPort Alternate Mode Tests";
export const Pd2DeterministicTests = "PD2 Deterministic Tests";
export const Pd2CommunicatonEngineTests = "PD2 Communication Engine Tests";
export const Pd3Tests = "Power Delivery 3.0 Tests";
export const MfgWwcTests = "MFG and WWC Tests";
export const CBChargerTid10 = "CBC.TID.9 Off Mode";
export const CBChargerTid11 = "CBC.TID.10 Over Temperature Protection";
export const CBChargerTid14 = "CBC.TID.14 FR_Swap Capability Field Check";
export const USBFunctionalDeadBatteryTest = "TD.4.11.2 Sink Dead Battery Test";
export const USBFunctionalHubPortTypesTest = "TD.4.12.2 Hub Port Types Test";
export const MFiTests = "MFi Charger Tests";
export const BC_1_2Tests = "BC1.2 DCP Sink Tests";
export const Qc3PlusTests = "QC3+ Tests"

//Test Selection START
export const MoiList = ["Power Delivery 3.0 Tests", "BC 1.2 Tests", "MFi Tests", "MFG and WWC Tests", "Source Power Tests", "Quick Charge 4 Tests", "PD2 Deterministic Tests", "USB-C Functional Tests", "PD2 Communication Engine Tests", "DisplayPort Alternate Mode Tests", "Quick Charger 3.0 Tests", "Thunderbolt Power Tests"]
//Test Selection END
export const LEFT_PANEL_WIDTH = '35%';
export const MAX_PANEL_HEIGHT = '100%';
export const VIFELEMENTLIST = "VIFElementList";
export const LISTSOURCEPDO = "ListSourcePDO";
export const LISTSINKPDO = "ListSinkPDO";
export const SVIDLIST = "SvidList";

//Test Cable Combo Select
export const CABLE_DATA_TYPES = ["GRL-SPL Test Cable 1", "GRL-SPL Test Cable 2", "USB-C STD Test Cable 1", "USB-C STD Test Cable 2", "Captive Cable", "No Cable"];

export const CABLE_DATA_TYPES_FOR_UI_ONLY = ["GRL-SPL Test Cable 1", "GRL-SPL Test Cable 2", "USB-C STD Test Cable 1", "USB-C STD Test Cable 2", "Captive Cable", "No Cable"];

export const COMPLIANCE_CABLE_TYPES = ["GRL-SPL Test Cable 1", "GRL-SPL Test Cable 2"]
//C2 App Status
export const READY = "READY";
export const BUSY = "BUSY";
export const ERROR = 'ERROR';

//C2 Connection Status
export const CONNECTED = "CONNECTED";
export const DISCONNECTED = "DISCONNECTED";

//Alert Categories
export const Alert_Error = 0;
export const Alert_Info = 1;
export const Alert_Warning = 2;


//Plot constant values
export const LEFT_NAV_WIDTH = 63;   //88;   //128; // plot marker calculation this width used
export const TOP_NAVBAR_HEIGHT = 130;       //90+40 (PlotToolbar height=50)
export const GRAPH_YAXIS_WIDTH = 55;    //120;
export const SPLITTER_BAR_WIDTH = 8;
export const GAP_BW_SPLITTER_CANVAS = 8;
export const PACKET_ICON_WIDTH = 25;      //20;
export const CC_PACKET_TIMESTAMP_WIDTH = 100;   //128;
export const PACKET_ICON_HEIGHT = 25;
//export const TEMP_OFFSET_VBAR = 130;
export const CUSTOM_YAXIS_LABEL_WIDTH = 40; // minus this width to "LEFT_NAV_WIDTH" & "GRAPH_YAXIS_WIDTH"
export const PLOT_TOOLBAR_HEIGHT = 40;
export const PLOT_XAISLABEL_HEIGHT = 35;
export const PLOTTOOLBAR_ICON_TOTAL_WIDTH = 940;         //830;
export const MARGIN_BORDER_PADDING_BW_SPLITTERANDLABEL = 6;         // className="channel-container" having some gap (margin, padding and boder)
export const MARGIN_BORDER_PADDING_AND_SCROLLBAR_CCPACKET = 19;         // Before ComponentMount we need to take currentDrawableAreaWidth from ccPacket div tag (that is having margin and scollbar)

export const GRAPH_COLOR = ['yellow', '#18de29', 'orange', '#fa075c', 'turquoise', 'magenta', '#b474e8', '#1c42ff', '#18de29', '#b474e8', 'orange', '#fa075c', 'yellow', 'magenta', 'turquoise', 'purple'];

export const GRAPH_YAXIS_LABEL = ['PORT1-VBUS(A)', 'PORT1-CC2(A)', 'PORT1-CC1(A)', 'PORT1-VBUS(V)', 'PORT1-CC2(V)', 'PORT1-CC1(V)', 'PORT1 D-PLUS', 'PORT1 D-MINUS', 'PORT1 D-PLUS(A)', 'PORT2-VBUS(A)', 'PORT2-CC2(A)', 'PORT2-CC1(A)', 'PORT2-VBUS(V)', 'PORT2-CC2(V)', 'PORT2-CC1(V)', 'PORT1 QC-D-PLUS CURRENT-FUNC-TEST'];

export const GRAPH_MARKER_LABEL = ['', '', '', 'Vbus', 'CC2', 'CC1', 'D-Plus(V)', 'D-Minus', 'D-Plus(A)', '', '', '', '', '', '', 'QC-D-PLUS CURRENT-FUNC-TEST'];
export const SORTED_VOLTAGE_CURRENT_GROUP = [3, 0, 12, 9, 5, 2, 14, 11, 4, 1, 13, 10, 6, 8, 7, 15];            //[3, 0, 5, 2, 4, 1, 8, 6, 7, 12, 9, 14, 11, 13, 10, 15]

export const MODE_CURSORE = 0;
export const MODE_ZOOM_IN = 1;
export const MODE_ZOOM_OUT = 2;
export const MODE_PAN = 3;
export const MODE_VERTICAL_ZOOM = 4;

export const MARKER_ONE = "marker-one";
export const MARKER_TWO = "marker-two";

export const RESPONSE_VALID = 200;
export const RESPONSE_INVALID = 400;

export const YES_NO = "Yes_No";
export const ELEMENT_PDO_INDEX = -1;
export const ID_SEPERATOR = "_";
export const TYPE_FILE = "type_file";
export const TYPE_DEVICE = "type_device";
export const SrcPDO = "SrcPDO";
export const SnkPDO = "SnkPDO";
export const SopSVID = "SOPSVID";
export const CableSVID = "CableSVID";
export const SUCCESS = true;
export const FAIL = false;
export const STR_TEXT = "_text";
export const STR_VALUE = "value";
export const VIF_SUPPORTED_VERSION = "3.1.0.1";
export const DecodedValueMismatch = "XML value does not match with the decoded value"

//RulesEngine Combobox Entries
export const TypeC_Snk = "1:SNK";
export const TypeC_Src = "0:SRC";
export const TypeC_Drp = "2:DRP"
export const BC_None = "0:None";
export const BC_PortableDevice = "1:Portable Device";
export const BC_ChargingPort = "2:Charging Port";
export const BC_Both = "3:Both";

//Server Connection Status 
export const Connected = true;
export const Disconnected = false;

export const VIF_NO = 0;
export const VIF_YES = 1;
export const VIF_IGNORE = "ignore";
export const VIF_MINVALUE = "MinValue";
export const VIF_MAXVALUE = "MaxValue";
export const VIF_MULTIPLIER = "Multipliers";
export const VIF_COMBOBOXENTRIES = "ComboBoxEntries";
export const VIF_TEXTBOXUNITS = "Units";
export const VIF_CURRENTDROPDOWNINDEX = "currentSelectedDropDownIndex";
export const EDIT_TEXTBOX = "Edit VIF Values";
export const VIF_ELEMENT_TYPE = "VifFieldType";
export const VIF_METADATA_COMBOBOXENTRY = "ComboBoxEntries";

export const REMOVE_ELEMENTS = ["Num_Src_PDOs",
    "PD_Power_As_Source",
    "USB_Suspend_May_Be_Cleared",
    "Sends_Pings",
    "PD_OC_Protection",
    "PD_OCP_Method",
    "Num_Snk_PDOs",
    "PD_Power_As_Sink",
    "No_USB_Suspend_May_Be_Set",
    "GiveBack_May_Be_Set",
    "Higher_Capability_Set",
    "FR_Swap_Reqd_Type_C_Current_As_Initial_Source",
    "SVID_Fixed_SOP",
    "Num_SVIDs_Max_SOP",
    "Num_SVIDs_Min_SOP"
];

export const SOURCE_PDO_SPECIFIC_ELEMENTS_STOREDIN_COMPONENT = ["Num_Src_PDOs", "PD_Power_As_Source", "USB_Suspend_May_Be_Cleared", "Sends_Pings", "PD_OC_Protection", "PD_OCP_Method",];
export const SINK_PDO_SPECIFIC_ELEMENTS_STOREDIN_COMPONENT = ["Num_Snk_PDOs", "PD_Power_As_Sink", "No_USB_Suspend_May_Be_Set", "GiveBack_May_Be_Set", "Higher_Capability_Set", "FR_Swap_Reqd_Type_C_Current_As_Initial_Source",];
export const SVID_PDO_SPECIFIC_ELEMENTS_STOREDIN_COMPONENT = ["SVID_Fixed_SOP", "Num_SVIDs_Max_SOP", "Num_SVIDs_Min_SOP"];
export const CABLE_SVID_PDO_SPECIFIC_ELEMENTS_STOREDIN_COMPONENT = ["SVID_Fixed", "Cable_Num_SVIDs_Min", "Cable_Num_SVIDs_Max"];


export const CERTIFICATION_FILTER = [
    "All Supported Certifications",
    "Quick Charge 4 Certification",
    "Quick Charger 3.0 Certification",
    "USB Power Delivery Certification",
    "Non-PD Type-C Certification",
    "Thunderbolt 3 Certification",
    "DisplayPort Certification",
]


export const CONTROLLER_MODES = ['UFP/Sink', 'DFP/Source', 'DRP', 'Cable Tester'];
export const PORT_TYPES = ['PortA', 'PortB'];
export const APP_MODE = ["CTS", "DP AUX"];
export const FIXTURE_SELECTION = ['C2 DP AUX Sniffer', 'USB-C SBU']
export const CABLE_EMULATION = ['Ra in CC1', 'Ra in CC2', 'Ra in Both CC Lines']
export const RP_LEVELS = ["Rp 900mA", "Rp 1.5A", "Rp 3A"]
export const EX_PORT_TYPES = ['ExPortA', 'ExPortB', 'ExPortC', 'ExPortD', 'ExPortE', 'None']
export const PDREV_TYPES = ['Spec Rev2', 'Spec Rev3'];
export const SOP_TYPES = ['SOP', 'SOP1', 'SOP2'];
export const MESSAGE_TYPES = ['VDM Disocver ID Initiator', 'VDM SVID Initiator', 'VDM Mode Initiator', 'VDM Enter Mode Initiator', 'VDM Exit Mode Initiator', 'Data Role Swap', 'Power Role Swap', 'Vconn Swap', 'Hard Reset', 'Cable Reset', 'Soft Reset', 'Get Sink capability', 'Get Source capability', 'BIST Carrier Mode2', 'Ping', 'Get Source Cap Extended', 'Get_Status', 'Get_PPS Status', 'BIST Test Data', 'Get_Manufacturer Info']
export const PDO_TYPES = ['1', '2', '3', '4', '5', '6', '7'];
export const SUPPLY_TYPES = ['Fixed', 'PPS', 'Variable', 'Battery'];
// Toast Types
export const TOAST_SUCCESS = "success"
export const TOAST_ERROR = "error"
export const TOAST_WARN = "warning"
export const TOAST_INFO = "info"

//App Execution Mode
export const COMPLIANCE_MODE = "ComplianceMode"
export const INFORMATIONAL_MODE = "InformationalMode"

//New Project Popup Panel Product capability
export const PROJECT_POPUP_DESCRIPTION = "Please enter the name of the project under which all further report are to be saved";

//5Port Testing 
export const MOI_TYPES = ['Power Delivery 3.0 Tests', "Source Power Tests", 'Quick Charge 4 Tests', 'PD2 Deterministic Tests', 'USB-C Functional Tests', 'PD2 Communication Engine Tests',
    'DisplayPort Alternate Mode Tests', 'Quick Charger 3.0 Tests', 'Thunderbolt Power Tests', "PD merged Tests", "BC 1.2 Tests", "MFi Tests"]

export const ELOAD_CHANNEL = ["1", "2", "3", "4"]

export const FAILURE_REPEAT_CONDITION = ["All Tests", "Fail Tests", "Pass Tests", "Incomplete Tests"]
//Ir Drop calibration
export const SAVE_LOCATION = ['1', '2', '3', '4']

//VIF Config Modal
export const DUT_TYPE = ['Consumer Only', 'Provider Only', 'Cable', 'Dual Role Power']

//IR Drop Test Cable Combo Select
export const IR_DROP_CABLE_DATA_TYPES = ["GRL-SPL test cable 1", "GRL-SPL test cable 2", "USB-C STD test cable 1", "USB-C STD test cable 2"];

export const QC_LEGACY_PARENT_NAMES = ["QC_LEGACY_Shorting", "QC_LEGACY_HVDCP", "QC_LEGACY_PD_Req", "QC_LEGACY_PD_Removal", "QC_LEGACY_PD_Phy_Err_Rej", "QC_LEGACY_PD_Req_Reg", "QC_LEGACY_Trans", "QC_LEGACY_Continuous_mode", "QC_LEGACY_Pwr_pf", "QC_LEGACY_USBPD_Trans",]


export const MANUAL_UPDATE_FIRMWARWE_INSTRUCTIONS = `Automatic Firmware Update Procedure:
1. Connect firmware update USB port of C2 to the test PC using standard USB Type-B cable where C2 Browser Application is running 
2. Click on the "Update Firmware Update" button 
3. If automatic firmware update fails, please update the firmware manually using below instructions

Manual firmware update procedure:
1. Connect firmware update USB port of C2 to the test PC using standard USB Type-B cable where C2 Browser Application is running 
2. Press the reset button on the back-side of the C2 controller"
3. Wait for the test PC to detect a new removable USB drive"
4. Copy all the files from \"C:\\GRL\\USBPD-C2-Browser-App\\Firmware_Files\" folder into newly detected removable USB drive 
5. Power cycle the C2 controller using the push button on the left top corner in the front panel of C2 controller 
Note1. If Step-4 fails, format the C2 SD card's removable drive that appears in the Test PC after connecting FW update USB cable 
Note2. If the above step(Note1) Fails, remove the SD card, connect it to the Test PC, and format it`