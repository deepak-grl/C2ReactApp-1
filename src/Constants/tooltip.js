export const IP_CONFIG = "C2 IP address type";
export const PROD_CAPABILITY = "Device category info source";
export const CABLE_TYPE = "Type of test cable being used";
export const REPORT_CONFIG = "Report config";

export const CS_CONNECT_BTN = "Connect C2";
export const PC_RESET_BTN = "Reset get capabilities";
export const PC_GETCAP_BTN = "Get device capabilities";
export const PC_CLEAR_BTN = "Reset VIF editor"
export const PC_FILE_CONVERTER_BTN = "VIF text to XML format converter tool"
export const PC_NEW_PROJECT_SAVE_BTN = "Save Project Folder"
export const PC_DUT_DISBALE_MODE = "Click on Clear VIF to change the DUT Type"

export const NAV_RUN_BTN = "Run test cases";
export const NAV_EXT_BTN = "Adjust";
export const NAV_SETTING_BTN = "Setting";

export const TC_RUN_BTN = "Execute test cases";
export const TC_STOP_BTN = "Stop test case execution";

export const RP_SAVE_REPORT = "Dowload html report file";
export const RP_SAVE_REPORT_DATA = "Download test report data";
export const RP_DELETE_REPORT = "Delete test report data";
export const RP_SETTINGS = "Test reports settings";
export const RP_DATA_SIZE = "Size of report files on server";
export const RP_REFRESH = "Refresh";

export const PLT_SAVE = "Save trace file";
export const PLT_LOAD = "Load trace file";
export const PLT_MOUSE_PAN = "Pan plot [Mouse]";
export const PLT_CURSOR = "Disable plot tool";
export const PLT_ZOOM_IN = "Horizontal zoom in";
export const PLT_ZOOM_OUT = "Horizontal zoom out";
export const PLT_PAN_LEFT = "Pan signal to left";
export const PLT_PAN_RIGHT = "Pan signal to right";
export const PLT_PAN_TOP = "Pan signal to top";
export const PLT_PAN_BOTTOM = "Pan Signal to bottom"
export const PLT_HMARKER = "Enable/Disable horizontal markers";
export const PLT_RESET = "Fit Plot";
export const PLT_MERGE = "Merge Charts";
export const PLT_UNMERGE = "Unmerge Charts";
export const PLT_VERTICAL_ZOOM = "Vertical zoom in";
export const PLT_VERTICAL_ZOOMOUT = "Vertical zoom out";
export const PLT_LIVE_UPDATES = "Live mode";
export const PLT_UNLIVE_UPDATES = "Offline mode";
export const PLT_MASK = "Signal mask";
export const PLT_SCREENSHOT = "Screenshot";

export const TC_PASSTESTCASES = "Click here to select passed test cases";
export const TC_FAILEDTESTCASES = "Click here to select failed test cases";
export const TC_WARNINGTESTCASES = "Click here to select test cases with warnings";
export const TC_CLEARFILTERS = "Click here to Clear test selection";
export const TC_INCOMPLETETESTCASE = "Click here to select incompleted test cases"
export const TC_REPEAT = "Repeat selected test cases";

export const CO_SEND_BTN = "Send message";
export const CO_REQUEST_BTN = "Request message";

export const EDIT_TEXTBOX = "Edit values";
export const FIRMWARE_UPDATE = "Update firmware"
export const UPDATE_ELOAD_FIRMWARE = "Update eload firmware"
export const CS_IPDISCOVER_BTN = "Discover GRL-C2s in the network"

export const SCROLL_TO_TESTCASE = "Scroll to test case being executed"
export const STOP_SCROLL_TO_TESTCASE = "Stop Scroll to test case being executed"

export const ENABLE_PORT = "Enable Port"
export const APPLY_CONFIGURE = "Apply Configurations"
export const AUTO_CONNECT = "Connect Port"
export const BROWSE_VIF = "Load XML VIF File"

export const IRDROP_CABLENAME_INFO = "Provide test cable name to differentiate the cable IR drop for different test cables"
export const IRDROP_GRL_SPL_CABLE = "This is a VCONN passthrough USB-C test cable provided by GRL (GRL-USB-PD-STC)"
export const IRDROP_USB_C_CABLE = "This is a standard USB Type-C test cable available in the market"
export const IRDROP_SAVE_LOCATION = "C2 controller can store cable IR drop for 4 different test cables.Select the memory location in C2 controller for saving the IR drop computed for connected test cable"

export const FP_CABLE_SELECTION = "After loading vif file, please check the test cable selection that it is same as actual test cable connected in setup"
export const COMPLIANCE_CABLE_SELECTION = `1. GRL-SPL test cable(Vconn pass-through) is mandatory for running test cases in Compliance mode. Tethered and cable DUT's can be directly connected to Tester. 
2. Primary test port of DUT should be connected to Port 1 of Tester.
3. To run test cases with standard USB - C cable, select informational test mode and choose the test cable type`

export const DUT_TYPE_INFO =`Provider: Supplies power to the port partner.Ex: Wall/car charger
Consumer: Sinks power from the port partner.Ex: Bus-powered Hub/Dock, adapter
DRP: Can act as Source or Sink.Ex: Notebook PC, self-powered Dock/Hub, power bank
Cable: Interconnects source and sink
Note: A self-power Dock(DRP) and bus-powered dock(Consumer-Only) will have 2 different VIF file to test`

export const USB_C_FUNCTIONAL_MOI_INFO = `TD 4.11.2 Sink Dead Battery Test
Please visually inspect the presence of battery in PUT. Enable this check box if battery is available else, disable it.`

export const STATE_MACHINE_INFO = `VIF Field  Type_C_State_Machine: Indicates which Type-C connection state machine is implemented on the DUT`

export const USB_FUNCTIONAL_DEVICE_URL = `Refer above setup image and enter the URL displayed in the Golden device(Google pixel phone).\n(Example : http://192.168.255.5:5324)`

export const USB_TYPE_B_PORT = `TD 4.12.2 Hub Port Types Test
Step - 4 and 5 validation: Enter the number of USB Type-B or Micro-B ports that is present in the product.`

export const USB_TYPE_C_PORT = `TD 4.12.2 Hub Port Types Test
Enter the Number of USB Type-C ports that are available in the connected Hub DUT`

export const USB_HUB_CONNECTED = `TD 4.12.2 Hub Port Types Test
Enable checkbox if the connected Hub is embedded, else disable the checkbox`

export const ENABLEORDISABLEPOPUP = `This feature can be used only in Informational Mode
Enable this checkbox to disable all pop-up during test execution, else disable it
Note: Test results will vary if checkbox is enabled`

export const FRSWAP_TEST_INFO = `Select this option if FR_Swap AUTO test fixture is available in the test setup
This test fixture is required for running Fast Role Swap test cases when DUT acts as Initial Source 
Fast Role Swap test results are for informational only for now and these are not mandatory for certification testing`

export const VCONN_INFO =`Deterministic tests need to be tested using VCONN voltage 2.75V , 5.75V`
export const PD3_VCONN_INFO=`PD3 tests need to be tested using VCONN voltage 2.75V , 5.75V`
export const COMM_VCONN_INFO=`1. All the Communication Engine Cable tests need to be tested using VCONN voltage 2.75V , 5.75V
2. TDA 1.1.1.1.1 CABLE PHY TX EYE test need to be tested using VCONN voltage 2.75V , 4.25V , 5.75V`

export const CAR_CHARGER = `For Car Chargers, repeat all the test cases with 9V, 12.5V and 16V input voltage supply connected to DUT`

export const MFILIGHTNINGCABLE = ` Please select this option when UUT connected with Lightning cable`

export const ENABLEDEBUGMODE = `Additional information will be added to test case capture. So test capture size will be comparatively more. This is recommended only for debug purpose.`

export const FIVEPORTREPEATCOUNT = `Use this option to repeat the test execution for a given number of times`

export const FIVEPORTNOTE = `Navigate to product capability panel and select informational mode`

export const CONFIG_CTRL_APP_MODE= `Enable DP AUX Sniffer License to decode DP AUX packets`
