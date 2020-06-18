import * as Constants from '../Constants';
import * as VIF_ENUMS from '../Constants/VIF_ENUMS';


export class VIFRules {
    //Rule for USB_PD_Support that depends on vifproducttype and connectortype
    rule_Usb_Pd_Support(component) {
        let connectorType = component.getElementByName(VIF_ENUMS.Connector_Type);
        let vifProductType = component.parent.getElementByName(VIF_ENUMS.VIF_Product_Type);
        if (vifProductType.getSelectedIndex() === 0 && connectorType.getSelectedIndex() !== 2) {
            return true;
        }
        return false;
    }

    //Rule for USB_COomms_Capable that depends on Vifproducttype and pdPortType
    //Rule for Unconstrained Power
    //Rule for DR_Swap_To_DFP/UFP_Supported
    rule_Usb_Comms_Capable(component) {
        let vifProductType = component.parent.getElementByName(VIF_ENUMS.VIF_Product_Type);
        let pdPortType = component.getElementByName(VIF_ENUMS.PD_Port_Type);
        if (vifProductType.getSelectedIndex() === 1 || pdPortType.getSelectedIndex() === 5) {
            return true;
        }
        return false;
    }

    //Rule for Complete USB Type_C Fields Section
    rule_Usb_TypeC_Fields(component) {
        let vifProductType = component.parent.getElementByName(VIF_ENUMS.VIF_Product_Type);
        let connectorType = component.getElementByName(VIF_ENUMS.Connector_Type);
        if (vifProductType.getSelectedIndex() === 0 || connectorType.getSelectedIndex() !== 2) {
            return true;
        }
        return false;
    }

    //Rule for TypeCCanActAsHost ,TypeCCanActAsDevice
    rule_Type_C_Can_Act(component) {
        let usbPdSupport = component.getElementByName(VIF_ENUMS.USB_PD_Support);
        let typeCStateMAchine = component.getElementByName(VIF_ENUMS.Type_C_State_Machine);
        if (usbPdSupport.getSelectedIndex() !== Constants.VIF_YES && typeCStateMAchine.getSelectedIndex() === 1) {
            return true;
        }
        return false;
    }

    //Rule for USB Device Fields section 3.2.5
    rule_USB_Device_Fields(component) {
        let connectorType = component.getElementByName(VIF_ENUMS.Connector_Type);
        let typeCCanActAsDevice = component.getElementByName(VIF_ENUMS.Type_C_Can_Act_As_Device);
        if ((connectorType.getSelectedIndex() === 1 || 2 || 3) && typeCCanActAsDevice.getSelectedIndex() === Constants.VIF_YES) {
            return true;
        }
        return false;
    }

    //Rule for Device_Genx1x1_tlinkTurnaround
    rule_Device_Gen1x1_TlinkTurnaround(component) {
        let deviceSpeed = component.getElementByName(VIF_ENUMS.Device_Speed);
        let deviceTruncatesDpForTdhpResponse = component.getElementByName(VIF_ENUMS.Device_Truncates_DP_For_tDHPResponse);
        if (deviceSpeed.getSelectedIndex() === 0 || deviceTruncatesDpForTdhpResponse !== Constants.VIF_YES) {
            return true;
        }
        return false;
    }

    //Rule for Device_Gen2x1_tlinkTurnaround
    rule_Device_Gen2x1_TlinkTurnaround(component) {
        let deviceSpeed = component.getElementByName(VIF_ENUMS.Device_Speed);
        let deviceTruncatesDpForTdhpResponse = component.getElementByName(VIF_ENUMS.Device_Truncates_DP_For_tDHPResponse);
        if ((deviceSpeed.getSelectedIndex() === 0 || 1 || 2) || deviceTruncatesDpForTdhpResponse !== Constants.VIF_YES) {
            return true;
        }
        return false;
    }

    //Rule for USB Host Fields section 3.2.6
    rule_USB_Host_Fields(component) {
        let connectorType = component.getElementByName(VIF_ENUMS.Connector_Type);
        let typeCCanActAsHost = component.getElementByName(VIF_ENUMS.Type_C_Can_Act_As_Host);
        if ((connectorType.getSelectedIndex() === 0 || 2 || 3) && typeCCanActAsHost.getSelectedIndex() === Constants.VIF_YES) {
            return true;
        }
        return false;
    }
    //Rule for Host_Genx1x1_tlinkTurnaround
    rule_Host_Gen1x1_TlinkTurnaround(component) {
        let hostSpeed = component.getElementByName(VIF_ENUMS.Host_Speed);
        let hostTruncatesDpForTdhpResponse = component.getElementByName(VIF_ENUMS.Host_Truncates_DP_For_tDHPResponse);
        if (hostSpeed.getSelectedIndex() === 0 || hostTruncatesDpForTdhpResponse !== Constants.VIF_YES) {
            return true;
        }
        return false;
    }

    //Rule for Host_Gen2x1_tlinkTurnaround
    rule_Host_Gen2x1_TlinkTurnaround(component) {
        let hostSpeed = component.getElementByName(VIF_ENUMS.Host_Speed);
        let hostTruncatesDpForTdhpResponse = component.getElementByName(VIF_ENUMS.Host_Truncates_DP_For_tDHPResponse);
        if ((hostSpeed.getSelectedIndex() === 0 || 1 || 2) || hostTruncatesDpForTdhpResponse !== Constants.VIF_YES) {
            return true;
        }
        return false;
    }

    //Rule for section PD Source Fields 3.2.7
    rule_Pd_Source_Fields(component) {
        let pdPortType = component.getElementByName(VIF_ENUMS.PD_Port_Type);
        if (pdPortType.getSelectedIndex() !== 1 || 2 || 3 || 4) {
            return true;
        }
        return false;
    }

    //Rule for section PD Sink Fields 3.2.8
    rule_Pd_Sink_Fields(component) {
        let pdPortType = component.getElementByName(VIF_ENUMS.PD_Port_Type);
        if (pdPortType.getSelectedIndex() !== 0 || 1 || 2 || 4) {
            return true;
        }
        return false;
    }

    //Rule for PD Dual Role Fields 3.2.9
    rule_Pd_Dual_Role_Fields(component) {
        let pdPortType = component.getElementByName(VIF_ENUMS.PD_Port_Type);
        if (pdPortType.getSelectedIndex() !== 1 || 2 || 4) {
            return true;
        }
        return false;
    }
    //Rule for AMA Fields section 3.2.11
    rule_Alternate_Mode_Adapter_Fields(component) {
        let respondsToDiscovSopUfp = component.getElementByName(VIF_ENUMS.Responds_To_Discov_SOP_UFP)
        let productTypeUfpSop = component.getElementByName(VIF_ENUMS.Product_Type_UFP_SOP)
        if (respondsToDiscovSopUfp.getSelectedIndex() === Constants.VIF_YES && productTypeUfpSop.getSelectedIndex() === 5) {
            return true;
        }
        return false;
    }

    //Rule for VIF PRoduct type
    rule_Cable_eMarker_Fields(component) {
        let vifProductType = component.getElementByName(VIF_ENUMS.VIF_Product_Type)
        let pdPortType = component.getElementByName(VIF_ENUMS.PD_Port_Type)
        if ((vifProductType.getSelectedIndex() !== 0 || 1) && pdPortType !== 5) {
            return true;
        }
        return false;
    }

    //Rule for SOP Discovery Fields 3.2.10
    rule_Sop_Discovery_Fields(component) {
        let respondsToDiscovSopUfp = component.getElementByName(VIF_ENUMS.Responds_To_Discov_SOP_UFP);
        let respondsToDiscovSopDfp = component.getElementByName(VIF_ENUMS.Responds_To_Discov_SOP_DFP)
        if (respondsToDiscovSopUfp.getSelectedIndex() === Constants.VIF_YES || respondsToDiscovSopDfp.getSelectedIndex() === Constants.VIF_YES) {
            return true;
        }
        return false
    }

    //Rule for DR_Swap_DFP_supported
    rule_dr_Swap_To_Dfp_Ufp_Supported(component) {
        let typeCStateMAchine = component.getElementByName(VIF_ENUMS.Type_C_State_Machine);
        let typeCCanActAsHost = component.getElementByName(VIF_ENUMS.Type_C_Can_Act_As_Host);
        let typeCCanActAsDevice = component.getElementByName(VIF_ENUMS.Type_C_Can_Act_As_Device);
        let typeCIsAltModeController = component.getElementByName(VIF_ENUMS.Type_C_Is_Alt_Mode_Controller);
        if (typeCStateMAchine.getSelectedIndex() === 2 && typeCCanActAsHost.getSelectedIndex() === Constants.VIF_YES && typeCCanActAsDevice.getSelectedIndex() === Constants.VIF_NO) {
            return true;
        }
        else if (typeCStateMAchine.getSelectedIndex() === 1 && (typeCCanActAsHost.getSelectedIndex() === Constants.VIF_YES || typeCIsAltModeController.getSelectedIndex() === Constants.VIF_YES)) {
            return true;
        }
        else if (typeCStateMAchine.getSelectedIndex() === 0 && typeCCanActAsDevice.getSelectedIndex() === Constants.VIF_YES) {
            return true;
        }
        return false;
    }

    //Rule for Product Power Fields section 3.2.15
    rule_Product_Power_Fields(component) {
        let connectorType = component.getElementByName(VIF_ENUMS.Connector_Type);
        let typeCStateMAchine = component.getElementByName(VIF_ENUMS.Type_C_State_Machine);

        if((connectorType.getSelectedIndex() !== 0 || 2) && (typeCStateMAchine !== 0 || 2 )) {
            return true;
        }
        return false;
    }


    //RUle for Type_C_State Machine
    rule_Type_C_State_Machine_Combobox_Entries(component) {
        let usbPdSupport = component.getElementByName(VIF_ENUMS.USB_PD_Support);
        let pdPortType = component.getElementByName(VIF_ENUMS.PD_Port_Type);
        let comboBoxEntries = [];

        if (usbPdSupport.getSelectedIndex() === Constants.VIF_YES && pdPortType.getSelectedIndex() === 0) {
            comboBoxEntries.push(Constants.TypeC_Snk);
        }
        else if (usbPdSupport.getSelectedIndex() === Constants.VIF_YES && pdPortType.getSelectedIndex() === 1) {
            comboBoxEntries.push(Constants.TypeC_Snk, Constants.TypeC_Drp);
        }
        else if (usbPdSupport.getSelectedIndex() === Constants.VIF_YES && pdPortType.getSelectedIndex() === 2) {
            comboBoxEntries.push(Constants.TypeC_Src, Constants.TypeC_Drp);
        }
        else if (usbPdSupport.getSelectedIndex() === Constants.VIF_YES && pdPortType.getSelectedIndex() === 3) {
            comboBoxEntries.push(Constants.TypeC_Src);
        }
        else if (usbPdSupport.getSelectedIndex() === Constants.VIF_YES && pdPortType.getSelectedIndex() === 4) {
            comboBoxEntries.push(Constants.TypeC_Src, Constants.TypeC_Drp);
        }
        else if (usbPdSupport.getSelectedIndex() === Constants.VIF_NO) {
            comboBoxEntries.push(Constants.TypeC_Src, Constants.TypeC_Snk, Constants.TypeC_Drp);
        }
        return comboBoxEntries;
    }

    //Rule for BC_1_2_Support
    rule_Bc_1_2_Support_Combobox_Entries(component) {
        let portBatteryPowered = component.getElementByName(VIF_ENUMS.Port_Battery_Powered);
        let typeCStateMachine = component.getElementByName(VIF_ENUMS.Type_C_State_Machine);
        let connectorType = component.getElementByName(VIF_ENUMS.Connector_Type);

        let comboBoxEntries = [];

        if (portBatteryPowered.getSelectedIndex() === Constants.VIF_YES && typeCStateMachine.getSelectedIndex() === 2) {
            comboBoxEntries.push(Constants.BC_None, Constants.BC_PortableDevice, Constants.BC_ChargingPort, Constants.BC_Both);
        }
        else if (portBatteryPowered.getSelectedIndex() === Constants.VIF_YES && (connectorType.getSelectedIndex === 1 || 3)) {
            comboBoxEntries.push(Constants.BC_None, Constants.BC_PortableDevice);
        }
        else if (portBatteryPowered.getSelectedIndex() === Constants.VIF_YES && typeCStateMachine.getSelectedIndex() === 1) {
            comboBoxEntries.push(Constants.BC_None, Constants.BC_PortableDevice);
        }
        else if (connectorType.getSelectedIndex() === 0) {
            comboBoxEntries.push(Constants.BC_None, Constants.BC_ChargingPort);
        }
        else if (connectorType.getSelectedIndex() === 2 && typeCStateMachine.getSelectedIndex() === 0) {
            comboBoxEntries.push(Constants.BC_None, Constants.BC_ChargingPort);
        }
        else if (portBatteryPowered.getSelectedIndex() === Constants.VIF_NO && connectorType.getSelectedIndex() === 2 && typeCStateMachine.getSelectedIndex() === 2) {
            comboBoxEntries.push(Constants.BC_None, Constants.BC_ChargingPort);
        }
        else if (portBatteryPowered.getSelectedIndex() === Constants.VIF_NO && connectorType.getSelectedIndex() === 1) {
            comboBoxEntries.push(Constants.BC_None);
        }
        else if (portBatteryPowered.getSelectedIndex() === Constants.VIF_NO && typeCStateMachine.getSelectedIndex() === 1) {
            comboBoxEntries.push(Constants.BC_None);
        }
        return comboBoxEntries;
    }
}



