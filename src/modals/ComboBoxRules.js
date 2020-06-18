//import * as VIF_ENUMS from '../Constants/VIF_ENUMS';

export class VIFComboBoxRules {
    rule_Categories(category, component) {
        // var arrayIndex = category.categoryIndex + 1;
        // //SourcePDO's
        // let srcPdoSupplyType = category.getElementByName(VIF_ENUMS.Src_PDO_Supply_Type);
        // let srcPdoPeakCurrent = category.getElementByName(VIF_ENUMS.Src_PDO_Peak_Current);
        // let srcPdoVoltage = category.getElementByName(VIF_ENUMS.Src_PDO_Voltage);
        // let srcPdoMaxCurrent = category.getElementByName(VIF_ENUMS.Src_PDO_Max_Current);
        // let srcPdOcpOcDebounce = category.getElementByName(VIF_ENUMS.Src_PD_OCP_OC_Debounce);
        // let srcPdOcpOcThreshold = category.getElementByName(VIF_ENUMS.Src_PD_OCP_OC_Threshold);
        // let srcPdOcpUvDebounce = category.getElementByName(VIF_ENUMS.Src_PD_OCP_UV_Debounce);
        // let srcPdOcpUvThresholdType = category.getElementByName(VIF_ENUMS.Src_PD_OCP_UV_Threshold_Type);
        // let srcPdoMinVoltage = category.getElementByName(VIF_ENUMS.Src_PDO_Min_Voltage);
        // let srcPdoMaxVoltage = category.getElementByName(VIF_ENUMS.Src_PDO_Max_Voltage);
        // let srcPdoMaxPower = category.getElementByName(VIF_ENUMS.Src_PDO_Max_Power);
        // let pdOcpMethod = component.getElementByName(VIF_ENUMS.PD_OCP_Method);

        // //SinkPdo's
        // let snkPdoSupplyType = category.getElementByName(VIF_ENUMS.Snk_PDO_Supply_Type);
        // let snkPdoVoltage = category.getElementByName(VIF_ENUMS.Snk_PDO_Voltage);
        // let snkPdoOpCurrent = category.getElementByName(VIF_ENUMS.Snk_PDO_Op_Current);
        // let snkPdoOpPower = category.getElementByName(VIF_ENUMS.Snk_PDO_Op_Power);
        // //Values required for Source Pdo's
        // let valSrcPdoSupplyType = srcPdoSupplyType.getSelectedIndex();
        // let valPdOcpMethod = pdOcpMethod.getSelectedIndex();
        // //Values required for Source Pdo's
        // let valSnkPdoSupplyType = snkPdoSupplyType.getSelectedIndex();
        // //Rules For Source Pdos
        // srcPdoPeakCurrent.setIgnore(valSrcPdoSupplyType !== 0);
        // srcPdoVoltage.setIgnore(valSrcPdoSupplyType !== 0);
        // srcPdoMaxCurrent.setIgnore(valSrcPdoSupplyType !== 0 || 2 || 3);
        // srcPdoMinVoltage.setIgnore(valSrcPdoSupplyType !== 0 || 2 || 3);
        // srcPdoMaxVoltage.setIgnore(valSrcPdoSupplyType !== 0 || 2 || 3);
        // srcPdoMaxPower.setIgnore(valSrcPdoSupplyType !== 1);
        // srcPdOcpOcDebounce.setIgnore(valSrcPdoSupplyType !== 0);
        // srcPdOcpOcThreshold.setIgnore(valSrcPdoSupplyType !== 0);
        // srcPdOcpOcDebounce.setIgnore(valPdOcpMethod !== 0 || 2);
        // srcPdOcpOcThreshold.setIgnore(valPdOcpMethod !== 0 || 2);
        // srcPdOcpUvDebounce.setIgnore(valSrcPdoSupplyType !== 0);
        // srcPdOcpUvDebounce.setIgnore(valPdOcpMethod !== 1 || 2);
        // srcPdOcpUvThresholdType.setIgnore(valSrcPdoSupplyType !== 0);
        // srcPdOcpUvThresholdType.setIgnore(valPdOcpMethod !== 1 || 2);
        // //Rules for Sink PDOs
        // snkPdoVoltage.setIgnore(valSnkPdoSupplyType !== 0);
        // snkPdoOpCurrent.setIgnore(valSnkPdoSupplyType !== 0 || 2 || 3);
        // snkPdoOpPower.setIgnore(valSnkPdoSupplyType !== 1);


        // if (arrayIndex === 1) {
        //     //Source Pdos
        //     srcPdoSupplyType.setSelectedIndex(0);
        //     srcPdoVoltage.setVIFElementRawValue(100);
        //     //Sink Pdos
        //     snkPdoSupplyType.setSelectedIndex(0);
        //     snkPdoVoltage.setVIFElementRawValue(100);
        // }


        //Yet to do SrcPdoMaxCurrent,srcPdoMaxVoltage,Src_PDO_Max_Power,Src_PD_OCP_UV_Threshold and SrcPDoMinVoltage
        //SnkPdoOpCurrent,snkPdoMinVoltage,SnkPdoMaxVoltage
        //Check the min max multipliers if present in metadata once for all
        //SetVIFElementRawValue() Check
    }
}

