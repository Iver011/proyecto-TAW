import { CheckboxFieldFormElement } from "./fields/CheckboxField";
import { DateFieldFormElement } from "./fields/DateField";
import { LinearScaleFormElement } from "./fields/LinearScaleField";
import { NumberFieldFormElement } from "./fields/NumberField";
import { ParagraphFieldFormElement } from "./fields/ParagraphField";
import { SelectFieldFormElement } from "./fields/SelectField";
import { SeparatorFieldFormElement } from "./fields/SeparatorField";
import { SpacerFieldFormElement } from "./fields/SpacerField";
import { SubTitleFormFieldElement } from "./fields/SubTitleField";
import { TextAreaFieldFormElement } from "./fields/TextAreaField";
import { TextFieldFormElement } from "./fields/TextField";
import { TitleFieldFormElement } from "./fields/TitleField";

export type SubmitFunction= (key:string,value:string)=>void;
export type ElementsType =
    |"TextField"
    |"TitleField"
    |"SubTitleField"
    |"ParagraphField"
    |"SeparatorField"
    |"SpacerField"
    |"NumberField"
    |"TextAreaField"
    |"DateField"
    |"SelectField"
    |"CheckboxField"
    |"LinearScaleField";
export type FormElement = {
    type:ElementsType;

    construct:(id:string)=> FormElementInstance;
    designerBtnElement:{
        icon:React.ElementType;
        label:string;
    };

    designerComponenet:React.FC<{
        elementInstance:FormElementInstance;
    }>;
    formComponent:React.FC<
    {
        elementInstance:FormElementInstance;
        submitValue:SubmitFunction;

        
    }>;
    propertiesComponent: React.FC<{
        elementInstance:FormElementInstance
    }>;
};
export type FormElementInstance={
    id:string;
    type:ElementsType;
    extraAtributes?:Record<string, any>;
}
type FormElementsType={
    [key in ElementsType]: FormElement;
}
export const FormElements:FormElementsType={
    TextField:TextFieldFormElement,
    TitleField:TitleFieldFormElement,
    SubTitleField:SubTitleFormFieldElement,
    ParagraphField:ParagraphFieldFormElement,
    SeparatorField:SeparatorFieldFormElement,
    SpacerField:SpacerFieldFormElement,
    NumberField:NumberFieldFormElement,
    TextAreaField:TextAreaFieldFormElement,
    DateField:DateFieldFormElement,
    SelectField:SelectFieldFormElement,
    CheckboxField:CheckboxFieldFormElement,
    LinearScaleField:LinearScaleFormElement
};