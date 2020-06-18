import * as Constants from '../Constants';
import * as VIF_ENUMS from '../Constants/VIF_ENUMS';
import { VIFRules } from './Rules';
/**
 * All rules and conditions goes into RulesEngine methods
 */
const rules = new VIFRules();
export class RulesEngine {

    onVIF_setVIFElementPropertyValue(vif, element, propertyName, val) {
        // var elementName = element.elementName;
        // let component = vif.getComponents()[0];
        // let connectorType = component.getElementByName(VIF_ENUMS.Connector_Type);
        // let portLabel = component.getElementByName(VIF_ENUMS.Port_Label);
        // let usbPdSupport = component.getElementByName(VIF_ENUMS.USB_PD_Support);
        // let pdPortType = component.getElementByName(VIF_ENUMS.PD_Port_Type);
        // let portBatteryPowered = component.getElementByName(VIF_ENUMS.Port_Battery_Powered);
        // let usbCommsCapable = component.getElementByName(VIF_ENUMS.USB_Comms_Capable);
        // let unconstrainedPower = component.getElementByName(VIF_ENUMS.Unconstrained_Power);
        // let vconnSwapToOnSupported = component.getElementByName(VIF_ENUMS.VCONN_Swap_To_On_Supported);
        // let vconnSwapToOffSupported = component.getElementByName(VIF_ENUMS.VCONN_Swap_To_Off_Supported);
        // let respondsToDiscov_Sop_Ufp = component.getElementByName(VIF_ENUMS.Responds_To_Discov_SOP_UFP);
        // let respondsToDiscov_Sop_Dfp = component.getElementByName(VIF_ENUMS.Responds_To_Discov_SOP_DFP);
        // let attemptsDiscovSop = component.getElementByName(VIF_ENUMS.Attempts_Discov_SOP);
        // let chunkingImplementedSop = component.getElementByName(VIF_ENUMS.Chunking_Implemented_SOP);
        // let unchunkedExtendedMessagesSupported = component.getElementByName(VIF_ENUMS.Unchunked_Extended_Messages_Supported);
        // let manufacturerInfoSupportedPort = component.getElementByName(VIF_ENUMS.Manufacturer_Info_Supported_Port);
        // let manufacturerInfoVidPort = component.getElementByName(VIF_ENUMS.Manufacturer_Info_VID_Port);
        // let securityMsgsSupportedSop = component.getElementByName(VIF_ENUMS.Security_Msgs_Supported_SOP);
        // let numFixedBatteries = component.getElementByName(VIF_ENUMS.Num_Fixed_Batteries);
        // let numSwappableBatterySlots = component.getElementByName(VIF_ENUMS.Num_Swappable_Battery_Slots);
        // //let sopCapable = component.getElementByName(VIF_ENUMS.SOP_Capable);
        // let typeCImplementsTrySRC = component.getElementByName(VIF_ENUMS.Type_C_Implements_Try_SRC);
        // let typeCImplementsTrySNK = component.getElementByName(VIF_ENUMS.Type_C_Implements_Try_SNK);
        // let rPValue = component.getElementByName(VIF_ENUMS.RP_Value);
        // let typeCSupportsVCONNPoweredAccessory = component.getElementByName(VIF_ENUMS.Type_C_Supports_VCONN_Powered_Accessory);
        // let typeCIsVCONNPoweredAccessory = component.getElementByName(VIF_ENUMS.Type_C_Is_VCONN_Powered_Accessory);
        // let typeCIsDebug_TargetSRC = component.getElementByName(VIF_ENUMS.Type_C_Is_Debug_Target_SRC);
        // let typeCIsDebug_TargetSNK = component.getElementByName(VIF_ENUMS.Type_C_Is_Debug_Target_SNK);
        // let typeCCanActAsHost = component.getElementByName(VIF_ENUMS.Type_C_Can_Act_As_Host);
        // let typeCIsAltModeController = component.getElementByName(VIF_ENUMS.Type_C_Is_Alt_Mode_Controller);
        // let typeCCanActAsDevice = component.getElementByName(VIF_ENUMS.Type_C_Can_Act_As_Device);
        // let typeCIsAltModeAdapter = component.getElementByName(VIF_ENUMS.Type_C_Is_Alt_Mode_Adapter);
        // let typeCPowerSource = component.getElementByName(VIF_ENUMS.Type_C_Power_Source);
        // let typeCPortOnHub = component.getElementByName(VIF_ENUMS.Type_C_Port_On_Hub);
        // let typeCSupportsAudioAccessory = component.getElementByName(VIF_ENUMS.Type_C_Supports_Audio_Accessory);
        // let typeCSourcesVCONN = component.getElementByName(VIF_ENUMS.Type_C_Sources_VCONN);
        // let drSwapToDfpSupported = component.getElementByName(VIF_ENUMS.DR_Swap_To_DFP_Supported);
        // let drSwapToUfpSupported = component.getElementByName(VIF_ENUMS.DR_Swap_To_UFP_Supported);
        // //Cable/Emaker Fields
        // let xid = component.getElementByName(VIF_ENUMS.XID);
        // let dataCapableasUsbhost = component.getElementByName(VIF_ENUMS.Data_Capable_As_USB_Host);
        // let dataCapableasUsbDevice = component.getElementByName(VIF_ENUMS.Data_Capable_As_USB_Device);
        // let producttype = component.getElementByName(VIF_ENUMS.Product_Type);
        // let modalOperationSupportes = component.getElementByName(VIF_ENUMS.Modal_Operation_Supported);
        // let usbVid = component.getElementByName(VIF_ENUMS.USB_VID);
        // let pid = component.getElementByName(VIF_ENUMS.PID);
        // let bcdDevice = component.getElementByName(VIF_ENUMS.bcdDevice);
        // let cableHwVers = component.getElementByName(VIF_ENUMS.Cable_HW_Vers);
        // let cableFwVers = component.getElementByName(VIF_ENUMS.Cable_FW_Vers);
        // let typeCtotypeABC = component.getElementByName(VIF_ENUMS.Type_C_To_Type_A_B_C);
        // let typeCtotypeCcaptVdmV2 = component.getElementByName(VIF_ENUMS.Type_C_To_Type_C_Capt_Vdm_V2);
        // let typeCtoPlugReceptacle = component.getElementByName(VIF_ENUMS.Type_C_To_Plug_Receptacle);
        // let cableLatency = component.getElementByName(VIF_ENUMS.Cable_Latency);
        // let cableterminationType = component.getElementByName(VIF_ENUMS.Cable_Termination_Type);
        // let cableVbusCurrent = component.getElementByName(VIF_ENUMS.Cable_VBUS_Current);
        // let vBusThroughCable = component.getElementByName(VIF_ENUMS.VBUS_Through_Cable);
        // let cableSopController = component.getElementByName(VIF_ENUMS.Cable_SOP_PP_Controller);
        // let cableSuperspeedSupport = component.getElementByName(VIF_ENUMS.Cable_Superspeed_Support);
        // let maxVbusVoltageVdmV2 = component.getElementByName(VIF_ENUMS.Max_VBUS_Voltage_Vdm_V2);
        // let manufacturerInfoSupported = component.getElementByName(VIF_ENUMS.Manufacturer_Info_Supported);
        // let manufacturerInfoVid = component.getElementByName(VIF_ENUMS.Manufacturer_Info_VID);
        // let manufacturerInfoPid = component.getElementByName(VIF_ENUMS.Manufacturer_Info_PID);
        // let chunckingImplemented = component.getElementByName(VIF_ENUMS.Chunking_Implemented);
        // let securityMsgsSupported = component.getElementByName(VIF_ENUMS.Security_Msgs_Supported);
        // let numSVIDmin = component.getElementByName(VIF_ENUMS.Num_SVIDs_Min);
        // let numSVIDmax = component.getElementByName(VIF_ENUMS.Num_SVIDs_Max);
        // let svidFixed = component.getElementByName(VIF_ENUMS.SVID_Fixed);
        // switch (elementName) {
        //     case VIF_ENUMS.VIF_Product_Type:
        //         {
        //             //ConnectorType dependencies
        //             connectorType.setIgnore(val !== 0);

        //             //PortLabel Dependencies
        //             portLabel.setIgnore(val !== 0)

        //             //UsbPdSupport dependencies
        //             if (rules.rule_Usb_Pd_Support(component) === true) {
        //             // if (val === 0) {
        //                 usbPdSupport.setSelectedIndex(Constants.VIF_NO);
        //             }
        //             else if (val === 1) {
        //                 usbPdSupport.setSelectedIndex(Constants.VIF_YES);
        //             }
        //             usbPdSupport.setIgnore(val === 2);

        //             //PdPortType Dependencies
        //             pdPortType.setIgnore(val !== 0)

        //             //PortBatteryPowered Dependencies
        //             portBatteryPowered.setIgnore(val !== 0)

        //             //UsbCommsCapable,UnconstrainedPower,VconnSwapToOnSupported,VconnSwapToOffSupported,RespondsToDiscov_Sop_Ufp,RespondsToDiscov_Sop_Dfp,AttemptsDiscovSop Dependencies
        //             // validateSetLocalProperty(usbCommsCapable,Constants.VIF_IGNORE,rules.rule_Usb_Comms_Capable(component))
        //             // validateSetLocalProperty(unconstrainedPower,Constants.VIF_IGNORE,rules.rule_Usb_Comms_Capable(component))
        //             // validateSetLocalProperty(vconnSwapToOnSupported,Constants.VIF_IGNORE,rules.rule_Usb_Comms_Capable(component))
        //             // validateSetLocalProperty(vconnSwapToOffSupported,Constants.VIF_IGNORE,rules.rule_Usb_Comms_Capable(component))
        //             // validateSetLocalProperty(respondsToDiscov_Sop_Ufp,Constants.VIF_IGNORE,rules.rule_Usb_Comms_Capable(component))
        //             // validateSetLocalProperty(respondsToDiscov_Sop_Dfp,Constants.VIF_IGNORE,rules.rule_Usb_Comms_Capable(component))
        //             // validateSetLocalProperty(attemptsDiscovSop,Constants.VIF_IGNORE,rules.rule_Usb_Comms_Capable(component))
        //             // validateSetLocalProperty(chunkingImplementedSop,Constants.VIF_IGNORE,rules.rule_Usb_Comms_Capable(component))
        //             // validateSetLocalProperty(unchunkedExtendedMessagesSupported,Constants.VIF_IGNORE,rules.rule_Usb_Comms_Capable(component))
        //             // validateSetLocalProperty(manufacturerInfoSupportedPort,Constants.VIF_IGNORE,rules.rule_Usb_Comms_Capable(component))
        //             // validateSetLocalProperty(manufacturerInfoVidPort,Constants.VIF_IGNORE,rules.rule_Usb_Comms_Capable(component))
        //             // validateSetLocalProperty(securityMsgsSupportedSop,Constants.VIF_IGNORE,rules.rule_Usb_Comms_Capable(component))
        //             // validateSetLocalProperty(numFixedBatteries,Constants.VIF_IGNORE,rules.rule_Usb_Comms_Capable(component))
        //             // validateSetLocalProperty(numSwappableBatterySlots,Constants.VIF_IGNORE,rules.rule_Usb_Comms_Capable(component))
        //             // validateSetLocalProperty(sopCapable,Constants.VIF_IGNORE,rules.rule_Usb_Comms_Capable(component))
        //             usbCommsCapable.setIgnore(rules.rule_Usb_Comms_Capable(component))
        //             unconstrainedPower.setIgnore(rules.rule_Usb_Comms_Capable(component))
        //             vconnSwapToOnSupported.setIgnore(rules.rule_Usb_Comms_Capable(component))
        //             vconnSwapToOffSupported.setIgnore(rules.rule_Usb_Comms_Capable(component))
        //             respondsToDiscov_Sop_Ufp.setIgnore(rules.rule_Usb_Comms_Capable(component))
        //             respondsToDiscov_Sop_Dfp.setIgnore(rules.rule_Usb_Comms_Capable(component))
        //             attemptsDiscovSop.setIgnore(rules.rule_Usb_Comms_Capable(component))
        //             chunkingImplementedSop.setIgnore(rules.rule_Usb_Comms_Capable(component))
        //             unchunkedExtendedMessagesSupported.setIgnore(rules.rule_Usb_Comms_Capable(component))
        //             manufacturerInfoSupportedPort.setIgnore(rules.rule_Usb_Comms_Capable(component))
        //             manufacturerInfoVidPort.setIgnore(rules.rule_Usb_Comms_Capable(component))
        //             securityMsgsSupportedSop.setIgnore(rules.rule_Usb_Comms_Capable(component))
        //             numFixedBatteries.setIgnore(rules.rule_Usb_Comms_Capable(component))
        //             numSwappableBatterySlots.setIgnore(rules.rule_Usb_Comms_Capable(component))
        //             // sopCapable.setIgnore(rules.rule_Usb_Comms_Capable(component))
        //             drSwapToDfpSupported.setIgnore(rules.rule_Usb_Comms_Capable(component))
        //             drSwapToUfpSupported.setIgnore(rules.rule_Usb_Comms_Capable(component))


        //             //Common Dependency for complete USB Type-C Section
        //             //validateSetLocalProperty(typeCImplementsTrySRC,Constants.VIF_IGNORE,rules.rule_Usb_Comms_Capable(component))
        //             typeCImplementsTrySRC.setIgnore(rules.rule_Usb_TypeC_Fields(component))
        //             typeCImplementsTrySNK.setIgnore(rules.rule_Usb_TypeC_Fields(component))
        //             rPValue.setIgnore(rules.rule_Usb_TypeC_Fields(component))
        //             typeCSupportsVCONNPoweredAccessory.setIgnore(rules.rule_Usb_TypeC_Fields(component))
        //             typeCIsVCONNPoweredAccessory.setIgnore(rules.rule_Usb_TypeC_Fields(component))
        //             typeCIsDebug_TargetSRC.setIgnore(rules.rule_Usb_TypeC_Fields(component))
        //             typeCIsDebug_TargetSNK.setIgnore(rules.rule_Usb_TypeC_Fields(component))
        //             typeCCanActAsHost.setIgnore(rules.rule_Usb_TypeC_Fields(component))
        //             typeCIsAltModeController.setIgnore(rules.rule_Usb_TypeC_Fields(component))
        //             typeCCanActAsDevice.setIgnore(rules.rule_Usb_TypeC_Fields(component))
        //             typeCIsAltModeAdapter.setIgnore(rules.rule_Usb_TypeC_Fields(component))
        //             typeCPowerSource.setIgnore(rules.rule_Usb_TypeC_Fields(component))
        //             typeCPortOnHub.setIgnore(rules.rule_Usb_TypeC_Fields(component))
        //             typeCSupportsAudioAccessory.setIgnore(rules.rule_Usb_TypeC_Fields(component))
        //             typeCSourcesVCONN.setIgnore(rules.rule_Usb_TypeC_Fields(component))

        //             //cable/Marker Fields
        //             xid.setIgnore(rules.rule_Cable_eMarker_Fields(component))
        //             dataCapableasUsbhost.setIgnore(rules.rule_Cable_eMarker_Fields(component))
        //             dataCapableasUsbDevice.setIgnore(rules.rule_Cable_eMarker_Fields(component))
        //             producttype.setIgnore(rules.rule_Cable_eMarker_Fields(component))
        //             modalOperationSupportes.setIgnore(rules.rule_Cable_eMarker_Fields(component))
        //             usbVid.setIgnore(rules.rule_Cable_eMarker_Fields(component))
        //             pid.setIgnore(rules.rule_Cable_eMarker_Fields(component))
        //             bcdDevice.setIgnore(rules.rule_Cable_eMarker_Fields(component))
        //             cableHwVers.setIgnore(rules.rule_Cable_eMarker_Fields(component))
        //             cableFwVers.setIgnore(rules.rule_Cable_eMarker_Fields(component))
        //             typeCtotypeABC.setIgnore(rules.rule_Cable_eMarker_Fields(component))
        //             typeCtotypeCcaptVdmV2.setIgnore(rules.rule_Cable_eMarker_Fields(component))
        //             typeCtoPlugReceptacle.setIgnore(rules.rule_Cable_eMarker_Fields(component))
        //             cableLatency.setIgnore(rules.rule_Cable_eMarker_Fields(component))
        //             cableterminationType.setIgnore(rules.rule_Cable_eMarker_Fields(component))
        //             cableVbusCurrent.setIgnore(rules.rule_Cable_eMarker_Fields(component))
        //             vBusThroughCable.setIgnore(rules.rule_Cable_eMarker_Fields(component))
        //             cableSopController.setIgnore(rules.rule_Cable_eMarker_Fields(component))
        //             cableSuperspeedSupport.setIgnore(rules.rule_Cable_eMarker_Fields(component))
        //             maxVbusVoltageVdmV2.setIgnore(rules.rule_Cable_eMarker_Fields(component))
        //             manufacturerInfoSupported.setIgnore(rules.rule_Cable_eMarker_Fields(component))
        //             manufacturerInfoVid.setIgnore(rules.rule_Cable_eMarker_Fields(component))
        //             manufacturerInfoPid.setIgnore(rules.rule_Cable_eMarker_Fields(component))
        //             chunckingImplemented.setIgnore(rules.rule_Cable_eMarker_Fields(component))
        //             securityMsgsSupported.setIgnore(rules.rule_Cable_eMarker_Fields(component))
        //             numSVIDmin.setIgnore(rules.rule_Cable_eMarker_Fields(component))
        //             numSVIDmax.setIgnore(rules.rule_Cable_eMarker_Fields(component))
        //             svidFixed.setIgnore(rules.rule_Cable_eMarker_Fields(component))
        //             break;
        //         }

        //     default:
        //         {

        //         }
        // }
        return Constants.SUCCESS;
    }

    onComponent_setVIFElementPropertyValue(component, element, propertyName, val) {
        var elementName = element.elementName;
        //     let pdPortType = component.getElementByName(VIF_ENUMS.PD_Port_Type);
        //     let connectorType = component.getElementByName(VIF_ENUMS.Connector_Type);
        //     let captiveCable = component.getElementByName(VIF_ENUMS.Captive_Cable);
        //     let usbPdSupport = component.getElementByName(VIF_ENUMS.USB_PD_Support);
        //     let pdSpecificationRevision = component.getElementByName(VIF_ENUMS.PD_Specification_Revision);
        //     let usbCommsCapable = component.getElementByName(VIF_ENUMS.USB_Comms_Capable);
        //     let drSwapToDfpSupported = component.getElementByName(VIF_ENUMS.DR_Swap_To_DFP_Supported);
        //     let drSwapToUfpSupported = component.getElementByName(VIF_ENUMS.DR_Swap_To_UFP_Supported);
        //     let unconstrainedPower = component.getElementByName(VIF_ENUMS.Unconstrained_Power);
        //     let vconnSwapToOnSupported = component.getElementByName(VIF_ENUMS.VCONN_Swap_To_On_Supported);
        //     let vconnSwapToOffSupported = component.getElementByName(VIF_ENUMS.VCONN_Swap_To_Off_Supported);
        //     let respondsToDiscov_Sop_Ufp = component.getElementByName(VIF_ENUMS.Responds_To_Discov_SOP_UFP);
        //     let respondsToDiscov_Sop_Dfp = component.getElementByName(VIF_ENUMS.Responds_To_Discov_SOP_DFP);
        //     let attemptsDiscovSop = component.getElementByName(VIF_ENUMS.Attempts_Discov_SOP);
        //     let chunkingImplementedSop = component.getElementByName(VIF_ENUMS.Chunking_Implemented_SOP);
        //     let unchunkedExtendedMessagesSupported = component.getElementByName(VIF_ENUMS.Unchunked_Extended_Messages_Supported);
        //     let manufacturerInfoSupportedPort = component.getElementByName(VIF_ENUMS.Manufacturer_Info_Supported_Port);
        //     let manufacturerInfoVidPort = component.getElementByName(VIF_ENUMS.Manufacturer_Info_VID_Port);
        //     let manufacturerInfoPidPort = component.getElementByName(VIF_ENUMS.Manufacturer_Info_PID_Port);
        //     let securityMsgsSupportedSop = component.getElementByName(VIF_ENUMS.Security_Msgs_Supported_SOP);
        //     let numFixedBatteries = component.getElementByName(VIF_ENUMS.Num_Fixed_Batteries);
        //     let numSwappableBatterySlots = component.getElementByName(VIF_ENUMS.Num_Swappable_Battery_Slots);
        //     //let sopCapable = component.getElementByName(VIF_ENUMS.SOP_Capable);
        //     let sopPCapable = component.getElementByName(VIF_ENUMS.SOP_P_Capable);
        //     let sopPpCapable = component.getElementByName(VIF_ENUMS.SOP_PP_Capable);
        //     let sopPDebugCapable = component.getElementByName(VIF_ENUMS.SOP_P_Debug_Capable);
        //     let sopPPDebugCapable = component.getElementByName(VIF_ENUMS.SOP_PP_Debug_Capable);
        //     let typeCImplementsTrySRC = component.getElementByName(VIF_ENUMS.Type_C_Implements_Try_SRC);
        //     let typeCImplementsTrySNK = component.getElementByName(VIF_ENUMS.Type_C_Implements_Try_SNK);
        //     let rPValue = component.getElementByName(VIF_ENUMS.RP_Value);
        //     let typeCSupportsVCONNPoweredAccessory = component.getElementByName(VIF_ENUMS.Type_C_Supports_VCONN_Powered_Accessory);
        //     let typeCIsVCONNPoweredAccessory = component.getElementByName(VIF_ENUMS.Type_C_Is_VCONN_Powered_Accessory);
        //     let typeCIsDebugTargetSRC = component.getElementByName(VIF_ENUMS.Type_C_Is_Debug_Target_SRC);
        //     let typeCIsDebugTargetSNK = component.getElementByName(VIF_ENUMS.Type_C_Is_Debug_Target_SNK);
        //     let typeCCanActAsHost = component.getElementByName(VIF_ENUMS.Type_C_Can_Act_As_Host);
        //     let typeCIsAltModeController = component.getElementByName(VIF_ENUMS.Type_C_Is_Alt_Mode_Controller);
        //     let typeCCanActAsDevice = component.getElementByName(VIF_ENUMS.Type_C_Can_Act_As_Device);
        //     let typeCIsAltModeAdapter = component.getElementByName(VIF_ENUMS.Type_C_Is_Alt_Mode_Adapter);
        //     let typeCPowerSource = component.getElementByName(VIF_ENUMS.Type_C_Power_Source);
        //     let typeCPortOnHub = component.getElementByName(VIF_ENUMS.Type_C_Port_On_Hub);
        //     let typeCSupportsAudioAccessory = component.getElementByName(VIF_ENUMS.Type_C_Supports_Audio_Accessory);
        //     let typeCSourcesVCONN = component.getElementByName(VIF_ENUMS.Type_C_Sources_VCONN);
        //     let deviceSpeed = component.getElementByName(VIF_ENUMS.Device_Speed);
        //     let deviceContainsCaptiveRetimer = component.getElementByName(VIF_ENUMS.Device_Contains_Captive_Retimer);
        //     let deviceTruncatesDpForTdhpresponse = component.getElementByName(VIF_ENUMS.Device_Truncates_DP_For_tDHPResponse);
        //     let devicegen1x1TlinkAround = component.getElementByName(VIF_ENUMS.Device_Gen1x1_tLinkTurnaround);
        //     let devicegen2x1TlinkAround = component.getElementByName(VIF_ENUMS.Device_Gen2x1_tLinkTurnaround);
        //     let hostSpeed = component.getElementByName(VIF_ENUMS.Host_Speed);
        //     let isDfpOnHub = component.getElementByName(VIF_ENUMS.Is_DFP_On_Hub);
        //     let hubPortNumber = component.getElementByName(VIF_ENUMS.Hub_Port_Number);
        //     let hostContainsCaptiveRetimer = component.getElementByName(VIF_ENUMS.Host_Contains_Captive_Retimer);
        //     let hostTruncatesDpForTdhpresponse = component.getElementByName(VIF_ENUMS.Host_Truncates_DP_For_tDHPResponse);
        //     let hostgen1x1TlinkAround = component.getElementByName(VIF_ENUMS.Host_Gen1x1_tLinkTurnaround);
        //     let hostgen2x1TlinkAround = component.getElementByName(VIF_ENUMS.Host_Gen2x1_tLinkTurnaround);
        //     let hostIsEmbedded = component.getElementByName(VIF_ENUMS.Host_Is_Embedded);
        //     let hostSuspendSupported = component.getElementByName(VIF_ENUMS.Host_Suspend_Supported);
        //     let pdPowerAsSource = component.getElementByName(VIF_ENUMS.PD_Power_As_Source);
        //     let usbSuspendMaybeCleared = component.getElementByName(VIF_ENUMS.USB_Suspend_May_Be_Cleared);
        //     let sendsPings = component.getElementByName(VIF_ENUMS.Sends_Pings);
        // let numSrcPdos = component.getElementByName(VIF_ENUMS.Num_Src_PDOs);
        //     let pdOcProtection = component.getElementByName(VIF_ENUMS.PD_OC_Protection);
        //     let pdOcpMethod = component.getElementByName(VIF_ENUMS.PD_OCP_Method);
        //     let srcPdoSupplyType = component.getElementByName(VIF_ENUMS.Src_PDO_Supply_Type);
        //     let srcPdoPeakCurrent = component.getElementByName(VIF_ENUMS.Src_PDO_Peak_Current);
        //     let srcPdoVoltage = component.getElementByName(VIF_ENUMS.Src_PDO_Voltage);
        //     let srcPdoMaxCurrent = component.getElementByName(VIF_ENUMS.Src_PDO_Max_Current);
        //     let srcPdoMinVoltage = component.getElementByName(VIF_ENUMS.Src_PDO_Min_Voltage);
        //     let srcPdoMaxVoltage = component.getElementByName(VIF_ENUMS.Src_PDO_Max_Voltage);
        //     let srcPdoMaxPower = component.getElementByName(VIF_ENUMS.Src_PDO_Max_Power);
        //     let srcPdOcpOcDebounce = component.getElementByName(VIF_ENUMS.Src_PD_OCP_OC_Debounce);
        //     let srcPdOcpOcThreshold = component.getElementByName(VIF_ENUMS.Src_PD_OCP_OC_Threshold);
        //     let srcPdOcpUvDebounce = component.getElementByName(VIF_ENUMS.Src_PD_OCP_UV_Debounce);
        //     let srcPdOcpUvThresholdType = component.getElementByName(VIF_ENUMS.Src_PD_OCP_UV_Threshold_Type);
        //     let srcPdOcpUvThreshold = component.getElementByName(VIF_ENUMS.Src_PD_OCP_UV_Threshold);
        //     let pdPowerAsSink = component.getElementByName(VIF_ENUMS.PD_Power_As_Sink);
        //     let noUsbSuspendMayBeSet = component.getElementByName(VIF_ENUMS.No_USB_Suspend_May_Be_Set);
        //     let givebackMayBeSet = component.getElementByName(VIF_ENUMS.GiveBack_May_Be_Set);
        //     let higherCapabilitySet = component.getElementByName(VIF_ENUMS.Higher_Capability_Set);
        //     let frSwapReqdTypeCCurrentAsInitialSource = component.getElementByName(VIF_ENUMS.FR_Swap_Reqd_Type_C_Current_As_Initial_Source);
        //     let numSnkPdos = component.getElementByName(VIF_ENUMS.Num_Snk_PDOs);
        //     let snkPdoSupplyType = component.getElementByName(VIF_ENUMS.Snk_PDO_Supply_Type);
        //     let snkPdoVoltage = component.getElementByName(VIF_ENUMS.Snk_PDO_Voltage);
        //     let snkPdoOpCurrent = component.getElementByName(VIF_ENUMS.Snk_PDO_Op_Current);
        //     let snkPdoOpPower = component.getElementByName(VIF_ENUMS.Snk_PDO_Op_Power);
        //     let snkPdoMinVoltage = component.getElementByName(VIF_ENUMS.Snk_PDO_Min_Voltage);
        //     let snkPdoMaxVoltage = component.getElementByName(VIF_ENUMS.Snk_PDO_Max_Voltage);
        //     let acceptsPrSwapAsSrc = component.getElementByName(VIF_ENUMS.Accepts_PR_Swap_As_Snk);
        //     let acceptsPrSwapAsSnk = component.getElementByName(VIF_ENUMS.Accepts_PR_Swap_As_Snk);
        //     let requestsPrSwapAsSrc = component.getElementByName(VIF_ENUMS.Requests_PR_Swap_As_Src);
        //     let frSwapSupportedAsInitialSink = component.getElementByName(VIF_ENUMS.FR_Swap_Supported_As_Initial_Sink);
        //     let xidSop = component.getElementByName(VIF_ENUMS.XID_SOP);
        //     let dataCapableAsUsbHostSop = component.getElementByName(VIF_ENUMS.Data_Capable_As_USB_Host_SOP);
        //     let dataCapableAsUsbDeviceSop = component.getElementByName(VIF_ENUMS.Data_Capable_As_USB_Device_SOP);
        //     let productTypeUfpSop = component.getElementByName(VIF_ENUMS.Product_Type_UFP_SOP);
        //     let productTypeDfpSop = component.getElementByName(VIF_ENUMS.Product_Type_DFP_SOP);
        //     let modalOperationSupportedSop = component.getElementByName(VIF_ENUMS.Modal_Operation_Supported_SOP);
        //     let usbVidSop = component.getElementByName(VIF_ENUMS.USB_VID_SOP);
        //     let pidSop = component.getElementByName(VIF_ENUMS.PID_SOP);
        //     let bcdDeviceSop = component.getElementByName(VIF_ENUMS.bcdDevice_SOP);
        //     let numSvidsMinSop = component.getElementByName(VIF_ENUMS.Num_SVIDs_Min_SOP);
        //     let numSvidsMaxSop = component.getElementByName(VIF_ENUMS.Num_SVIDs_Max_SOP);
        //     let svidFixedSop = component.getElementByName(VIF_ENUMS.SVID_Fixed_SOP);
        //     //let productTotalSourcePowermw = component.getElementByName(VIF_ENUMS.Product_Total_Source_Power_mW);
        //     //let portSourcePowerType = component.getElementByName(VIF_ENUMS.Port_Source_Power_Type);
        //     let portSourcePowerGang = component.getElementByName(VIF_ENUMS.Port_Source_Power_Gang);
        //     let portSourcePowerGangMaxPower = component.getElementByName(VIF_ENUMS.Port_Source_Power_Gang_Max_Power);
        //     //Alternate Mode ADapter
        //     let amaHwVers = component.getElementByName(VIF_ENUMS.AMA_HW_Vers);
        //     let amaFwVers = component.getElementByName(VIF_ENUMS.AMA_FW_Vers);
        //     let amaVconnPower = component.getElementByName(VIF_ENUMS.AMA_VCONN_Power);
        //     let amaVconnreqd = component.getElementByName(VIF_ENUMS.AMA_VCONN_Reqd);
        //     let amaVbusreqd = component.getElementByName(VIF_ENUMS.AMA_VBUS_Reqd);
        //     let amaSuperspeedSupport = component.getElementByName(VIF_ENUMS.AMA_Superspeed_Support);
        //     //Battery Charging 1.2 fields
        //     let bc12ChargingPortType = component.getElementByName(VIF_ENUMS.BC_1_2_Charging_Port_Type);
        //     //Cable/Emaker Fields
        //     let xid = component.getElementByName(VIF_ENUMS.XID);
        //     let dataCapableasUsbhost = component.getElementByName(VIF_ENUMS.Data_Capable_As_USB_Host);
        //     let dataCapableasUsbDevice = component.getElementByName(VIF_ENUMS.Data_Capable_As_USB_Device);
        //     let producttype = component.getElementByName(VIF_ENUMS.Product_Type);
        //     let modalOperationSupportes = component.getElementByName(VIF_ENUMS.Modal_Operation_Supported);
        //     let usbVid = component.getElementByName(VIF_ENUMS.USB_VID);
        //     let pid = component.getElementByName(VIF_ENUMS.PID);
        //     let bcdDevice = component.getElementByName(VIF_ENUMS.bcdDevice);
        //     let cableHwVers = component.getElementByName(VIF_ENUMS.Cable_HW_Vers);
        //     let cableFwVers = component.getElementByName(VIF_ENUMS.Cable_FW_Vers);
        //     let typeCtotypeABC = component.getElementByName(VIF_ENUMS.Type_C_To_Type_A_B_C);
        //     let typeCtotypeCcaptVdmV2 = component.getElementByName(VIF_ENUMS.Type_C_To_Type_C_Capt_Vdm_V2);
        //     let typeCtoPlugReceptacle = component.getElementByName(VIF_ENUMS.Type_C_To_Plug_Receptacle);
        //     let cableLatency = component.getElementByName(VIF_ENUMS.Cable_Latency);
        //     let cableterminationType = component.getElementByName(VIF_ENUMS.Cable_Termination_Type);
        //     let cableVbusCurrent = component.getElementByName(VIF_ENUMS.Cable_VBUS_Current);
        //     let vBusThroughCable = component.getElementByName(VIF_ENUMS.VBUS_Through_Cable);
        //     let cableSopController = component.getElementByName(VIF_ENUMS.Cable_SOP_PP_Controller);
        //     let cableSuperspeedSupport = component.getElementByName(VIF_ENUMS.Cable_Superspeed_Support);
        //     let maxVbusVoltageVdmV2 = component.getElementByName(VIF_ENUMS.Max_VBUS_Voltage_Vdm_V2);
        //     let manufacturerInfoSupported = component.getElementByName(VIF_ENUMS.Manufacturer_Info_Supported);
        //     let manufacturerInfoVid = component.getElementByName(VIF_ENUMS.Manufacturer_Info_VID);
        //     let manufacturerInfoPid = component.getElementByName(VIF_ENUMS.Manufacturer_Info_PID);
        //     let chunckingImplemented = component.getElementByName(VIF_ENUMS.Chunking_Implemented);
        //     let securityMsgsSupported = component.getElementByName(VIF_ENUMS.Security_Msgs_Supported);
        //     let numSVIDmin = component.getElementByName(VIF_ENUMS.Num_SVIDs_Min);
        //     let numSVIDmax = component.getElementByName(VIF_ENUMS.Num_SVIDs_Max);
        //     let svidFixed = component.getElementByName(VIF_ENUMS.SVID_Fixed);

        switch (elementName) {
            //         case VIF_ENUMS.USB_PD_Support:
            //             {
            //                 //Dependency for all elements in section 3.2.3 General PD Fields
            //                 pdSpecificationRevision.setIgnore(val !== Constants.VIF_YES)
            //                 usbCommsCapable.setIgnore(val !== Constants.VIF_YES)
            //                 drSwapToDfpSupported.setIgnore(val !== Constants.VIF_YES)
            //                 drSwapToUfpSupported.setIgnore(val !== Constants.VIF_YES)
            //                 unconstrainedPower.setIgnore(val !== Constants.VIF_YES)
            //                 vconnSwapToOnSupported.setIgnore(val !== Constants.VIF_YES)
            //                 vconnSwapToOffSupported.setIgnore(val !== Constants.VIF_YES)
            //                 respondsToDiscov_Sop_Ufp.setIgnore(val !== Constants.VIF_YES)
            //                 respondsToDiscov_Sop_Dfp.setIgnore(val !== Constants.VIF_YES)
            //                 attemptsDiscovSop.setIgnore(val !== Constants.VIF_YES)
            //                 chunkingImplementedSop.setIgnore(val !== Constants.VIF_YES)
            //                 unchunkedExtendedMessagesSupported.setIgnore(val !== Constants.VIF_YES)
            //                 manufacturerInfoSupportedPort.setIgnore(val !== Constants.VIF_YES)
            //                 manufacturerInfoVidPort.setIgnore(val !== Constants.VIF_YES)
            //                 manufacturerInfoPidPort.setIgnore(val !== Constants.VIF_YES)
            //                 securityMsgsSupportedSop.setIgnore(val !== Constants.VIF_YES)
            //                 numFixedBatteries.setIgnore(val !== Constants.VIF_YES)
            //                 numSwappableBatterySlots.setIgnore(val !== Constants.VIF_YES)
            //                 // sopCapable.setIgnore(val !== Constants.VIF_YES)
            //                 sopPCapable.setIgnore(val !== Constants.VIF_YES)
            //                 sopPpCapable.setIgnore(val !== Constants.VIF_YES)
            //                 sopPDebugCapable.setIgnore(val !== Constants.VIF_YES)
            //                 sopPPDebugCapable.setIgnore(val !== Constants.VIF_YES)
            //                 typeCIsAltModeAdapter.setIgnore(val !== Constants.VIF_YES)

            //                 //PdPortType Dependencies
            //                 pdPortType.setIgnore(val !== Constants.VIF_YES)

            //                 //typeCCanActAsHost ,TypeCCanActAsDevice Dependencies
            //                 typeCCanActAsHost.setSelectedIndex(rules.rule_Type_C_Can_Act(component) === true ? Constants.VIF_NO : Constants.VIF_YES);
            //                 typeCCanActAsDevice.setSelectedIndex(rules.rule_Type_C_Can_Act(component) === true ? Constants.VIF_NO : Constants.VIF_YES);


            //                 break;
            //             }
            //         case VIF_ENUMS.Connector_Type:
            //             {
            //                 //UsbPdSupport dependencies
            //                 if (rules.rule_Usb_Pd_Support(component)) {
            //                     usbPdSupport.setSelectedIndex(Constants.VIF_NO);
            //                 }

            //                 //PdPortType Dependencies
            //                 pdPortType.setIgnore(val !== 2)

            //                 //CaptiveCable Dependencies
            //                 captiveCable.setIgnore(val !== 1 || 2)

            //                 //Common Dependency for complete USB Type-C Section
            //                 typeCImplementsTrySRC.setIgnore(rules.rule_Usb_TypeC_Fields(component))
            //                 typeCImplementsTrySNK.setIgnore(rules.rule_Usb_TypeC_Fields(component))
            //                 rPValue.setIgnore(rules.rule_Usb_TypeC_Fields(component))
            //                 typeCSupportsVCONNPoweredAccessory.setIgnore(rules.rule_Usb_TypeC_Fields(component))
            //                 typeCIsVCONNPoweredAccessory.setIgnore(rules.rule_Usb_TypeC_Fields(component))
            //                 typeCIsDebugTargetSRC.setIgnore(rules.rule_Usb_TypeC_Fields(component))
            //                 typeCIsDebugTargetSNK.setIgnore(rules.rule_Usb_TypeC_Fields(component))
            //                 typeCCanActAsHost.setIgnore(rules.rule_Usb_TypeC_Fields(component))
            //                 typeCIsAltModeController.setIgnore(rules.rule_Usb_TypeC_Fields(component))
            //                 typeCCanActAsDevice.setIgnore(rules.rule_Usb_TypeC_Fields(component))
            //                 typeCIsAltModeAdapter.setIgnore(rules.rule_Usb_TypeC_Fields(component))
            //                 typeCPowerSource.setIgnore(rules.rule_Usb_TypeC_Fields(component))
            //                 typeCPortOnHub.setIgnore(rules.rule_Usb_TypeC_Fields(component))
            //                 typeCSupportsAudioAccessory.setIgnore(rules.rule_Usb_TypeC_Fields(component))
            //                 typeCSourcesVCONN.setIgnore(rules.rule_Usb_TypeC_Fields(component))

            //                 //Common Dependency for USB Device Fields Section
            //                 deviceSpeed.setIgnore(rules.rule_USB_Device_Fields(component))
            //                 deviceContainsCaptiveRetimer.setIgnore(rules.rule_USB_Device_Fields(component))
            //                 deviceTruncatesDpForTdhpresponse.setIgnore(rules.rule_USB_Device_Fields(component))
            //                 devicegen1x1TlinkAround.setIgnore(rules.rule_USB_Device_Fields(component))
            //                 devicegen2x1TlinkAround.setIgnore(rules.rule_USB_Device_Fields(component))

            //                 //Common Dependency for USB Host Fields Section
            //                 hostSpeed.setIgnore(rules.rule_USB_Host_Fields(component))
            //                 isDfpOnHub.setIgnore(rules.rule_USB_Host_Fields(component))
            //                 hubPortNumber.setIgnore(rules.rule_USB_Host_Fields(component))
            //                 hostContainsCaptiveRetimer.setIgnore(rules.rule_USB_Host_Fields(component))
            //                 hostTruncatesDpForTdhpresponse.setIgnore(rules.rule_USB_Host_Fields(component))
            //                 hostgen1x1TlinkAround.setIgnore(rules.rule_USB_Host_Fields(component))
            //                 hostgen2x1TlinkAround.setIgnore(rules.rule_USB_Host_Fields(component))
            //                 hostIsEmbedded.setIgnore(rules.rule_USB_Host_Fields(component))
            //                 hostSuspendSupported.setIgnore(rules.rule_USB_Host_Fields(component))

            //                 //Dependency for Is_DFP_On_Hub
            //                 if (val === 2) {
            //                     isDfpOnHub.setSelectedIndex(typeCPortOnHub.getSelectedIndex());
            //                 }

            //                 //Dependency for Product Power Fields Section
            //                 // productTotalSourcePowermw = component.setIgnore( rules.rule_Product_Power_Fields(component));
            //                 // portSourcePowerType = component.setIgnore( rules.rule_Product_Power_Fields(component));
            //                 // portSourcePowerGang = component.setIgnore( rules.rule_Product_Power_Fields(component));
            //                 // portSourcePowerGangMaxPower = component.setIgnore( rules.rule_Product_Power_Fields(component));
            //                 break;
            //             }

            //         //Type_C_State_Machine yet to do
            //         //BC_1_2_Support yet to do
            //         case VIF_ENUMS.Type_C_Sources_VCONN:
            //             {
            //                 //VconnSwapToOffSupported Dependencies
            //                 vconnSwapToOffSupported.setSelectedIndex(val === Constants.VIF_YES ? Constants.VIF_YES : Constants.VIF_NO)

            //                 break;

            //             }
            //         case VIF_ENUMS.PD_Port_Type:
            //             {
            //                 //CaptiveCable Dependencies
            //                 captiveCable.setSelectedIndex(val === 5 ? Constants.VIF_YES : Constants.VIF_NO)

            //                 //SopPCapable Dependencies
            //                 sopPCapable.setSelectedIndex(val === 5 ? Constants.VIF_YES : Constants.VIF_NO)

            //                 //UsbCommsCapable,UnconstrainedPower,VconnSwapToOnSupported,VconnSwapToOffSupported,RespondsToDiscov_Sop_Ufp,RespondsToDiscov_Sop_Dfp,AttemptsDiscovSop Dependencies
            //                 usbCommsCapable.setIgnore(rules.rule_Usb_Comms_Capable(component))
            //                 unconstrainedPower.setIgnore(rules.rule_Usb_Comms_Capable(component))
            //                 vconnSwapToOnSupported.setIgnore(rules.rule_Usb_Comms_Capable(component))
            //                 vconnSwapToOffSupported.setIgnore(rules.rule_Usb_Comms_Capable(component))
            //                 respondsToDiscov_Sop_Ufp.setIgnore(rules.rule_Usb_Comms_Capable(component))
            //                 respondsToDiscov_Sop_Dfp.setIgnore(rules.rule_Usb_Comms_Capable(component))
            //                 attemptsDiscovSop.setIgnore(rules.rule_Usb_Comms_Capable(component))
            //                 chunkingImplementedSop.setIgnore(rules.rule_Usb_Comms_Capable(component))
            //                 unchunkedExtendedMessagesSupported.setIgnore(rules.rule_Usb_Comms_Capable(component))
            //                 manufacturerInfoSupportedPort.setIgnore(rules.rule_Usb_Comms_Capable(component))
            //                 manufacturerInfoVidPort.setIgnore(rules.rule_Usb_Comms_Capable(component))
            //                 securityMsgsSupportedSop.setIgnore(rules.rule_Usb_Comms_Capable(component))
            //                 numFixedBatteries.setIgnore(rules.rule_Usb_Comms_Capable(component))
            //                 numSwappableBatterySlots.setIgnore(rules.rule_Usb_Comms_Capable(component))
            //                 // sopCapable.setIgnore(rules.rule_Usb_Comms_Capable(component))

            //                 //SopPPCapable Dependencies
            //                 sopPpCapable.setSelectedIndex(val === 5 ? Constants.VIF_NO : Constants.VIF_YES)

            //                 //TypeCSupportsVCONNPoweredAccessory
            //                 typeCSupportsVCONNPoweredAccessory.setIgnore(val !== 0)

            //                 //TypeCIsVCONNPoweredAccessory
            //                 typeCIsVCONNPoweredAccessory.setIgnore(val !== 3)
            //                 typeCIsVCONNPoweredAccessory.setSelectedIndex(val === 5 ? Constants.VIF_NO : Constants.VIF_YES)

            //                 //TypeCCanActAsHost
            //                 typeCCanActAsHost.setSelectedIndex(val === 5 ? Constants.VIF_NO : Constants.VIF_YES)

            //                 //TypeCPortOnHub
            //                 typeCPortOnHub.setSelectedIndex(val === 5 ? Constants.VIF_NO : Constants.VIF_YES)

            //                 //TypeCSourcesVconn
            //                 typeCSourcesVCONN.setSelectedIndex(val === 5 ? Constants.VIF_NO : Constants.VIF_YES)

            //                 //PDSourceFields
            //                 pdPowerAsSource.setIgnore(rules.rule_Pd_Source_Fields(component))
            //                 usbSuspendMaybeCleared.setIgnore(rules.rule_Pd_Source_Fields(component))
            //                 sendsPings.setIgnore(rules.rule_Pd_Source_Fields(component))
            //                 numSrcPdos.setIgnore(rules.rule_Pd_Source_Fields(component))
            //                 pdOcProtection.setIgnore(rules.rule_Pd_Source_Fields(component))
            //                 pdOcpMethod.setIgnore(rules.rule_Pd_Source_Fields(component))
            //                 srcPdoSupplyType.setIgnore(rules.rule_Pd_Source_Fields(component))
            //                 srcPdoPeakCurrent.setIgnore(rules.rule_Pd_Source_Fields(component))
            //                 srcPdoVoltage.setIgnore(rules.rule_Pd_Source_Fields(component))
            //                 srcPdoMaxCurrent.setIgnore(rules.rule_Pd_Source_Fields(component))
            //                 srcPdoMinVoltage.setIgnore(rules.rule_Pd_Source_Fields(component))
            //                 srcPdoMaxVoltage.setIgnore(rules.rule_Pd_Source_Fields(component))
            //                 srcPdoMaxPower.setIgnore(rules.rule_Pd_Source_Fields(component))
            //                 srcPdOcpOcDebounce.setIgnore(rules.rule_Pd_Source_Fields(component))
            //                 srcPdOcpOcThreshold.setIgnore(rules.rule_Pd_Source_Fields(component))
            //                 srcPdOcpUvDebounce.setIgnore(rules.rule_Pd_Source_Fields(component))
            //                 srcPdOcpUvThresholdType.setIgnore(rules.rule_Pd_Source_Fields(component))
            //                 srcPdOcpUvThreshold.setIgnore(rules.rule_Pd_Source_Fields(component))

            //                 //PD Sink Fields
            //                 pdPowerAsSink.setIgnore(rules.rule_Pd_Sink_Fields(component))
            //                 noUsbSuspendMayBeSet.setIgnore(rules.rule_Pd_Sink_Fields(component))
            //                 givebackMayBeSet.setIgnore(rules.rule_Pd_Sink_Fields(component))
            //                 higherCapabilitySet.setIgnore(rules.rule_Pd_Sink_Fields(component))
            //                 frSwapReqdTypeCCurrentAsInitialSource.setIgnore(rules.rule_Pd_Sink_Fields(component))
            //                 numSnkPdos.setIgnore(rules.rule_Pd_Sink_Fields(component))
            //                 snkPdoSupplyType.setIgnore(rules.rule_Pd_Sink_Fields(component))
            //                 snkPdoVoltage.setIgnore(rules.rule_Pd_Sink_Fields(component))
            //                 snkPdoOpCurrent.setIgnore(rules.rule_Pd_Sink_Fields(component))
            //                 snkPdoOpPower.setIgnore(rules.rule_Pd_Sink_Fields(component))
            //                 snkPdoMinVoltage.setIgnore(rules.rule_Pd_Sink_Fields(component))
            //                 snkPdoMaxVoltage.setIgnore(rules.rule_Pd_Sink_Fields(component))

            //                 //PD Dual Role Fields
            //                 acceptsPrSwapAsSrc.setIgnore(rules.rule_Pd_Dual_Role_Fields(component))
            //                 acceptsPrSwapAsSnk.setIgnore(rules.rule_Pd_Dual_Role_Fields(component))
            //                 requestsPrSwapAsSrc.setIgnore(rules.rule_Pd_Dual_Role_Fields(component))
            //                 frSwapSupportedAsInitialSink.setIgnore(rules.rule_Pd_Dual_Role_Fields(component))

            //                 //Cable/eMarker fields
            //                 xid.setIgnore(rules.rule_Cable_eMarker_Fields(component))
            //                 dataCapableasUsbhost.setIgnore(rules.rule_Cable_eMarker_Fields(component))
            //                 dataCapableasUsbDevice.setIgnore(rules.rule_Cable_eMarker_Fields(component))
            //                 producttype.setIgnore(rules.rule_Cable_eMarker_Fields(component))
            //                 modalOperationSupportes.setIgnore(rules.rule_Cable_eMarker_Fields(component))
            //                 usbVid.setIgnore(rules.rule_Cable_eMarker_Fields(component))
            //                 pid.setIgnore(rules.rule_Cable_eMarker_Fields(component))
            //                 bcdDevice.setIgnore(rules.rule_Cable_eMarker_Fields(component))
            //                 cableHwVers.setIgnore(rules.rule_Cable_eMarker_Fields(component))
            //                 cableFwVers.setIgnore(rules.rule_Cable_eMarker_Fields(component))
            //                 typeCtotypeABC.setIgnore(rules.rule_Cable_eMarker_Fields(component))
            //                 typeCtotypeCcaptVdmV2.setIgnore(rules.rule_Cable_eMarker_Fields(component))
            //                 typeCtoPlugReceptacle.setIgnore(rules.rule_Cable_eMarker_Fields(component))
            //                 cableLatency.setIgnore(rules.rule_Cable_eMarker_Fields(component))
            //                 cableterminationType.setIgnore(rules.rule_Cable_eMarker_Fields(component))
            //                 cableVbusCurrent.setIgnore(rules.rule_Cable_eMarker_Fields(component))
            //                 vBusThroughCable.setIgnore(rules.rule_Cable_eMarker_Fields(component))
            //                 cableSopController.setIgnore(rules.rule_Cable_eMarker_Fields(component))
            //                 cableSuperspeedSupport.setIgnore(rules.rule_Cable_eMarker_Fields(component))
            //                 maxVbusVoltageVdmV2.setIgnore(rules.rule_Cable_eMarker_Fields(component))
            //                 manufacturerInfoSupported.setIgnore(rules.rule_Cable_eMarker_Fields(component))
            //                 manufacturerInfoVid.setIgnore(rules.rule_Cable_eMarker_Fields(component))
            //                 manufacturerInfoPid.setIgnore(rules.rule_Cable_eMarker_Fields(component))
            //                 chunckingImplemented.setIgnore(rules.rule_Cable_eMarker_Fields(component))
            //                 securityMsgsSupported.setIgnore(rules.rule_Cable_eMarker_Fields(component))
            //                 numSVIDmin.setIgnore(rules.rule_Cable_eMarker_Fields(component))
            //                 numSVIDmax.setIgnore(rules.rule_Cable_eMarker_Fields(component))
            //                 svidFixed.setIgnore(rules.rule_Cable_eMarker_Fields(component))

            //                 //SR Swap to Ufp/Dfp Supported
            //                 drSwapToDfpSupported.setIgnore(rules.rule_Usb_Comms_Capable(component))
            //                 drSwapToUfpSupported.setIgnore(rules.rule_Usb_Comms_Capable(component))
            //                 break;
            //             }
            //         case VIF_ENUMS.Manufacturer_Info_Supported_Port:
            //             {
            //                 manufacturerInfoVidPort.setIgnore(val !== Constants.VIF_YES)
            //                 manufacturerInfoPidPort.setIgnore(val !== Constants.VIF_YES)
            //                 break;
            //             }

            //         case VIF_ENUMS.PD_Specification_Revision:
            //             {
            //                 chunkingImplementedSop.setIgnore(val !== 2)
            //                 unchunkedExtendedMessagesSupported.setIgnore(val !== 2)
            //                 manufacturerInfoSupportedPort.setIgnore(val !== 2)
            //                 securityMsgsSupportedSop.setIgnore(val !== 2)
            //                 numFixedBatteries.setIgnore(val !== 2)
            //                 numSwappableBatterySlots.setIgnore(val !== 2)
            //                 frSwapReqdTypeCCurrentAsInitialSource.setIgnore(val === 1)
            //                 frSwapSupportedAsInitialSink.setIgnore(val === 1)
            //                 break;
            //             }
            //         case VIF_ENUMS.SOP_P_Capable:
            //             {
            //                 sopPpCapable.setIgnore(val !== Constants.VIF_YES)
            //                 break;
            //             }
            //         case VIF_ENUMS.Type_C_Implements_Try_SRC:
            //             {
            //                 typeCImplementsTrySNK.setSelectedIndex(val === Constants.VIF_YES ? Constants.VIF_NO : Constants.VIF_YES)
            //                 break;
            //             }
            //         case VIF_ENUMS.Type_C_Implements_Try_SNK:
            //             {
            //                 typeCImplementsTrySRC.setSelectedIndex(val === Constants.VIF_YES ? Constants.VIF_NO : Constants.VIF_YES)
            //                 break;
            //             }
            //         case VIF_ENUMS.Type_C_State_Machine:
            //             {
            //                 typeCImplementsTrySRC.setIgnore(val !== 2)
            //                 typeCImplementsTrySNK.setIgnore(val !== 2)
            //                 rPValue.setIgnore(val !== 0 || 2)
            //                 typeCIsDebugTargetSRC.setIgnore(val !== 0 || 2)
            //                 typeCIsDebugTargetSNK.setIgnore(val !== 1 || 2)

            //                 //typeCCanActAsHost ,TypeCCanActAsDevice Dependencies
            //                 typeCCanActAsHost.setSelectedIndex(rules.rule_Type_C_Can_Act(component) ? Constants.VIF_NO : Constants.VIF_YES);
            //                 typeCCanActAsDevice.setSelectedIndex(rules.rule_Type_C_Can_Act(component) ? Constants.VIF_NO : Constants.VIF_YES);

            //                 //DR_Swap_To_DFP_Supported
            //                 drSwapToDfpSupported.setSelectedIndex(rules.rule_dr_Swap_To_Dfp_Ufp_Supported(component) ? Constants.VIF_YES : Constants.VIF_NO);
            //                 drSwapToUfpSupported.setSelectedIndex(rules.rule_dr_Swap_To_Dfp_Ufp_Supported(component) ? Constants.VIF_YES : Constants.VIF_NO);

            //                 //Dependency for Product Power Fields Section
            //                 // productTotalSourcePowermw = component.setIgnore( rules.rule_Product_Power_Fields(component));
            //                 // portSourcePowerType = component.setIgnore( rules.rule_Product_Power_Fields(component));
            //                 // portSourcePowerGang = component.setIgnore( rules.rule_Product_Power_Fields(component));
            //                 // portSourcePowerGangMaxPower = component.setIgnore( rules.rule_Product_Power_Fields(component));
            //                 break;
            //             }
            //         case VIF_ENUMS.Type_C_Can_Act_As_Device:
            //             {
            //                 typeCIsAltModeAdapter.setIgnore(val !== Constants.VIF_YES)

            //                 //Common Dependency for USB Device Fields Section
            //                 deviceSpeed.setIgnore(rules.rule_USB_Device_Fields(component))
            //                 deviceContainsCaptiveRetimer.setIgnore(rules.rule_USB_Device_Fields(component))
            //                 deviceTruncatesDpForTdhpresponse.setIgnore(rules.rule_USB_Device_Fields(component))
            //                 devicegen1x1TlinkAround.setIgnore(rules.rule_USB_Device_Fields(component))
            //                 devicegen2x1TlinkAround.setIgnore(rules.rule_USB_Device_Fields(component))

            //                 //DATACAPABLEASUSBDEVICESOP
            //                 dataCapableAsUsbDeviceSop.setSelectedIndex(val);

            //                 //DR_Swap_To_DFP/UFP_Supported
            //                 drSwapToDfpSupported.setSelectedIndex(rules.rule_dr_Swap_To_Dfp_Ufp_Supported(component) ? Constants.VIF_YES : Constants.VIF_NO);
            //                 drSwapToUfpSupported.setSelectedIndex(rules.rule_dr_Swap_To_Dfp_Ufp_Supported(component) ? Constants.VIF_YES : Constants.VIF_NO);

            //                 break;
            //             }
            //         case VIF_ENUMS.Type_C_Can_Act_As_Host:
            //             {
            //                 //Common Dependency for USB Host Fields Section
            //                 hostSpeed.setIgnore(rules.rule_USB_Host_Fields(component))
            //                 isDfpOnHub.setIgnore(rules.rule_USB_Host_Fields(component))
            //                 hubPortNumber.setIgnore(rules.rule_USB_Host_Fields(component))
            //                 hostContainsCaptiveRetimer.setIgnore(rules.rule_USB_Host_Fields(component))
            //                 hostTruncatesDpForTdhpresponse.setIgnore(rules.rule_USB_Host_Fields(component))
            //                 hostgen1x1TlinkAround.setIgnore(rules.rule_USB_Host_Fields(component))
            //                 hostgen2x1TlinkAround.setIgnore(rules.rule_USB_Host_Fields(component))
            //                 hostIsEmbedded.setIgnore(rules.rule_USB_Host_Fields(component))
            //                 hostSuspendSupported.setIgnore(rules.rule_USB_Host_Fields(component))

            //                 //dataCApableAsUSBHOSTSOP
            //                 dataCapableAsUsbHostSop.setSelectedIndex(val);

            //                 //DR_Swap_To_DFP/UFP_Supported
            //                 drSwapToDfpSupported.setSelectedIndex(rules.rule_dr_Swap_To_Dfp_Ufp_Supported(component) ? Constants.VIF_YES : Constants.VIF_NO);
            //                 drSwapToUfpSupported.setSelectedIndex(rules.rule_dr_Swap_To_Dfp_Ufp_Supported(component) ? Constants.VIF_YES : Constants.VIF_NO);

            //                 break;
            //             }
            //         case VIF_ENUMS.Type_C_Is_Alt_Mode_Controller:
            //             {
            //                 //DR_Swap_To_DFP/UFP_Supported
            //                 drSwapToDfpSupported.setSelectedIndex(rules.rule_dr_Swap_To_Dfp_Ufp_Supported(component) ? Constants.VIF_YES : Constants.VIF_NO);
            //                 drSwapToUfpSupported.setSelectedIndex(rules.rule_dr_Swap_To_Dfp_Ufp_Supported(component) ? Constants.VIF_YES : Constants.VIF_NO);

            //                 break;
            //             }
            //         case VIF_ENUMS.Product_Type_UFP_SOP:
            //             {
            //                 //AMA_HW_VErs
            //                 amaHwVers.setIgnore(rules.rule_Alternate_Mode_Adapter_Fields(component))
            //                 amaFwVers.setIgnore(rules.rule_Alternate_Mode_Adapter_Fields(component))
            //                 amaVconnPower.setIgnore(rules.rule_Alternate_Mode_Adapter_Fields(component))
            //                 amaVconnreqd.setIgnore(rules.rule_Alternate_Mode_Adapter_Fields(component))
            //                 amaVbusreqd.setIgnore(rules.rule_Alternate_Mode_Adapter_Fields(component))
            //                 amaSuperspeedSupport.setIgnore(rules.rule_Alternate_Mode_Adapter_Fields(component))
            //                 break;
            //             }
            //         case VIF_ENUMS.Responds_To_Discov_SOP_UFP:
            //             {
            //                 typeCIsAltModeAdapter.setSelectedIndex(val !== Constants.VIF_YES ? Constants.VIF_NO : Constants.VIF_YES);
            //                 break;
            //             }
            //         case VIF_ENUMS.USB_Comms_Capable:
            //             {
            //                 typeCCanActAsHost.setSelectedIndex(val === Constants.VIF_NO ? Constants.VIF_NO : Constants.VIF_YES)
            //                 break;
            //             }
            //         case VIF_ENUMS.VCONN_Swap_To_On_Supported:
            //             {
            //                 typeCSourcesVCONN.setSelectedIndex(val === Constants.VIF_YES ? Constants.VIF_YES : Constants.VIF_NO)
            //                 break;
            //             }
            //         case VIF_ENUMS.Type_C_Sources_VCONN:
            //             {
            //                 captiveCable.setSelectedIndex(val === Constants.VIF_YES ? Constants.VIF_NO : Constants.VIF_YES)
            //                 break;
            //             }
            //         case VIF_ENUMS.Captive_Cable:
            //             {
            //                 typeCSourcesVCONN.setSelectedIndex(val === Constants.VIF_YES ? Constants.VIF_NO : Constants.VIF_YES)
            //                 break;
            //             }
            //         case VIF_ENUMS.Device_Speed:
            //             {
            //                 deviceTruncatesDpForTdhpresponse.setIgnore(val === 0)
            //                 devicegen1x1TlinkAround.setIgnore(rules.rule_Device_Gen1x1_TlinkTurnaround(component))
            //                 devicegen2x1TlinkAround.setIgnore(rules.rule_Device_Gen2x1_TlinkTurnaround(component))
            //                 break;
            //             }
            //         case VIF_ENUMS.Host_Speed:
            //             {
            //                 hostTruncatesDpForTdhpresponse.setIgnore(val === 0)
            //                 hostgen1x1TlinkAround.setIgnore(rules.rule_Host_Gen1x1_TlinkTurnaround(component))
            //                 hostgen2x1TlinkAround.setIgnore(rules.rule_Host_Gen2x1_TlinkTurnaround(component))

            //                 //Dependency for Hub_Port_Number
            //                 if (val === 1 || 2 || 3 || 4) {
            //                     hubPortNumber.setMinValue(1);
            //                     hubPortNumber.setMaxValue(15);
            //                 }
            //                 break;
            //             }
            //         case VIF_ENUMS.Device_Truncates_DP_For_tDHPResponse:
            //             {
            //                 devicegen1x1TlinkAround.setIgnore(rules.rule_Device_Gen1x1_TlinkTurnaround(component))
            //                 devicegen2x1TlinkAround.setIgnore(rules.rule_Device_Gen2x1_TlinkTurnaround(component))
            //                 break;
            //             }
            //         case VIF_ENUMS.Host_Truncates_DP_For_tDHPResponse:
            //             {
            //                 hostgen1x1TlinkAround.setIgnore(rules.rule_Host_Gen1x1_TlinkTurnaround(component))
            //                 hostgen2x1TlinkAround.setIgnore(rules.rule_Host_Gen2x1_TlinkTurnaround(component))
            //                 break;
            //             }
            //         case VIF_ENUMS.Host_Is_Embedded:
            //             {
            //                 hostSuspendSupported.setSelectedIndex(val === Constants.VIF_NO ? Constants.VIF_YES : Constants.VIF_NO)
            //                 break;
            //             }
            case VIF_ENUMS.Num_Src_PDOs:
                {
                    component.srcPdoList.resizeCategoryArray(val)
                    break;
                }
            //         case VIF_ENUMS.PD_OC_Protection:
            //             {
            //                 pdOcpMethod.setIgnore(val !== Constants.VIF_YES)
            //                 break;
            //             }
            //         case VIF_ENUMS.Num_Snk_PDOs:
            //             {
            //                 component.snkPdoList.resizeCategoryArray(val);
            //                 break;
            //             }
            //         case VIF_ENUMS.AMA_VCONN_Reqd:
            //             {
            //                 amaVconnPower.setIgnore(val !== Constants.VIF_YES)
            //                 break;
            //             }

            //         case VIF_ENUMS.BC_1_2_Support:
            //             {
            //                 bc12ChargingPortType.setIgnore(val !== 1 || 2 || 3)
            //                 break;
            //             }
            //         case VIF_ENUMS.Responds_To_Discov_SOP_UFP:
            //             {
            //                 xidSop.setIgnore(rules.rule_Sop_Discovery_Fields(component))
            //                 dataCapableAsUsbHostSop.setIgnore(rules.rule_Sop_Discovery_Fields(component))
            //                 dataCapableAsUsbDeviceSop.setIgnore(rules.rule_Sop_Discovery_Fields(component))
            //                 productTypeUfpSop.setIgnore(rules.rule_Sop_Discovery_Fields(component))
            //                 productTypeDfpSop.setIgnore(rules.rule_Sop_Discovery_Fields(component))
            //                 modalOperationSupportedSop.setIgnore(rules.rule_Sop_Discovery_Fields(component))
            //                 usbVidSop.setIgnore(rules.rule_Sop_Discovery_Fields(component))
            //                 pidSop.setIgnore(rules.rule_Sop_Discovery_Fields(component))
            //                 bcdDeviceSop.setIgnore(rules.rule_Sop_Discovery_Fields(component))
            //                 numSvidsMinSop.setIgnore(rules.rule_Sop_Discovery_Fields(component))
            //                 numSvidsMaxSop.setIgnore(rules.rule_Sop_Discovery_Fields(component))
            //                 svidFixedSop.setIgnore(rules.rule_Sop_Discovery_Fields(component))
            //                 break;
            //             }
            //         case VIF_ENUMS.Responds_To_Discov_SOP_DFP:
            //             {
            //                 xidSop.setIgnore(rules.rule_Sop_Discovery_Fields(component))
            //                 dataCapableAsUsbHostSop.setIgnore(rules.rule_Sop_Discovery_Fields(component))
            //                 dataCapableAsUsbDeviceSop.setIgnore(rules.rule_Sop_Discovery_Fields(component))
            //                 productTypeUfpSop.setIgnore(rules.rule_Sop_Discovery_Fields(component))
            //                 productTypeDfpSop.setIgnore(rules.rule_Sop_Discovery_Fields(component))
            //                 modalOperationSupportedSop.setIgnore(rules.rule_Sop_Discovery_Fields(component))
            //                 usbVidSop.setIgnore(rules.rule_Sop_Discovery_Fields(component))
            //                 pidSop.setIgnore(rules.rule_Sop_Discovery_Fields(component))
            //                 bcdDeviceSop.setIgnore(rules.rule_Sop_Discovery_Fields(component))
            //                 numSvidsMinSop.setIgnore(rules.rule_Sop_Discovery_Fields(component))
            //                 numSvidsMaxSop.setIgnore(rules.rule_Sop_Discovery_Fields(component))
            //                 svidFixedSop.setIgnore(rules.rule_Sop_Discovery_Fields(component))
            //                 break;
            //             }
            //         case VIF_ENUMS.Type_C_Port_On_Hub:
            //             {
            //                 if (connectorType.getSelectedIndex() === 2) {
            //                     isDfpOnHub.setSelectedIndex(val);
            //                 }
            //             }
            //         case VIF_ENUMS.Port_Source_Power_Type:
            //             {
            //                 portSourcePowerGang.setIgnore(val !== 1);
            //                 portSourcePowerGangMaxPower.setIgnore(val !== 1);
            //                 break;
            //             }


            //         //Num_Fixed_Batteries and Num_Swappabale_Battery_Slots pg21 4th line yet to do.Remove Combobox entry with index 0.
            //         //PD_Power_as_Source yet to do
            //         //Section 3.2.7.1 Source PDOs yet to do
            //         //PD_Power_as_Sink yet to do
            //         //Section 3.2.8.1 Sink PDOs yet to do
            //         //Product_Type_UFP_SOP yet to do
            //         //Product_Type_DFP_SOP yet to do
            //         //Section 3.2.10 yet to do
                }
                return Constants.SUCCESS;
            }
            onCategoryList_setVIFElementPropertyValue(categoryList, element, propertyName, val) {
                return Constants.SUCCESS;
            }
            onCategory_setVIFElementPropertyValue(category, element, propertyName, val, index) {
            //     var elementName = element.elementName;
            //     // var arrayIndex = category.categoryIndex + 1;
            //     // let srcPdoSupplyType = category.getElementByName(VIF_ENUMS.Src_PDO_Supply_Type);
            //     // let srcPdoPeakCurrent = category.getElementByName(VIF_ENUMS.Src_PDO_Peak_Current);
            //     // let srcPdoVoltage = category.getElementByName(VIF_ENUMS.Src_PDO_Voltage);
            //     // let srcPdoMaxCurrent = category.getElementByName(VIF_ENUMS.Src_PDO_Max_Current);
            //     // let srcPdOcpOcDebounce = category.getElementByName(VIF_ENUMS.Src_PD_OCP_OC_Debounce);
            //     // let srcPdOcpOcThreshold = category.getElementByName(VIF_ENUMS.Src_PD_OCP_OC_Threshold);
            //     // let srcPdOcpUvDebounce = category.getElementByName(VIF_ENUMS.Src_PD_OCP_UV_Debounce);
            //     // let srcPdOcpUvThresholdType = category.getElementByName(VIF_ENUMS.Src_PD_OCP_UV_Threshold_Type);
            //     // let srcPdOcpUvThreshold = category.getElementByName(VIF_ENUMS.Src_PD_OCP_UV_Threshold);
            //     // let srcPdoMinVoltage = category.getElementByName(VIF_ENUMS.Src_PDO_Min_Voltage);
            //     // let srcPdoMaxVoltage = category.getElementByName(VIF_ENUMS.Src_PDO_Max_Voltage);
            //     // let srcPdoMaxPower = category.getElementByName(VIF_ENUMS.Src_PDO_Max_Power);
            //     // let snkPdoSupplyType = category.getElementByName(VIF_ENUMS.Snk_PDO_Supply_Type);
            //     // let snkPdoVoltage = category.getElementByName(VIF_ENUMS.Snk_PDO_Voltage);
            //     // let snkPdoOpCurrent = category.getElementByName(VIF_ENUMS.Snk_PDO_Op_Current);
            //     // let snkPdoOpPower = category.getElementByName(VIF_ENUMS.Snk_PDO_Op_Power);
            //     // let snkPdoMinVoltage = category.getElementByName(VIF_ENUMS.Snk_PDO_Min_Voltage);
            //     // let snkPdoMaxVoltage = category.getElementByName(VIF_ENUMS.Snk_PDO_Max_Voltage);
            //     switch (elementName) {
            //         case VIF_ENUMS.Src_PDO_Supply_Type:
            //             {
            //                 // Source PDO Supply Type Dependencies
            //                 break;

        
        
        return Constants.SUCCESS;
    }

}