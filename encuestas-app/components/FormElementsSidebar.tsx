import { FormElements } from "./FormElements";
import SidebarBtnElement from "./SidebarBtnElement";
import { Separator } from "./ui/separator";

function FormElementsSidebar(){


    return(
        <div>
            <p className="text-sm text-foreground/70">Arrastra y Suelta los elementos</p>
            <Separator className="my-2"/>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 place-items-center">
            <p className="text-sm text-muted-foreground col-span-1 md:col-span-2 my-2 place-self-start">Elementos de Diseño</p>
            
            <SidebarBtnElement formElement={FormElements.TitleField}></SidebarBtnElement>   
            <SidebarBtnElement formElement={FormElements.SubTitleField}></SidebarBtnElement>
            <SidebarBtnElement formElement={FormElements.ParagraphField}></SidebarBtnElement>
            
            <SidebarBtnElement formElement={FormElements.SeparatorField}></SidebarBtnElement>
            
            <SidebarBtnElement formElement={FormElements.SpacerField}></SidebarBtnElement>
            <p className="text-sm text-muted-foreground col-span-1 md:col-span-2 my-2 place-self-start">
                Elementos del Formulario</p>
            <SidebarBtnElement formElement={FormElements.TextField}></SidebarBtnElement>
            <SidebarBtnElement formElement={FormElements.NumberField}></SidebarBtnElement>
           {/* <SidebarBtnElement formElement={FormElements.TextAreaField}></SidebarBtnElement>*/}
            
            <SidebarBtnElement formElement={FormElements.DateField}></SidebarBtnElement>
            
            <SidebarBtnElement formElement={FormElements.SelectField}></SidebarBtnElement>
            
            {/*<SidebarBtnElement formElement={FormElements.CheckboxField}></SidebarBtnElement>*/}
            
           {/*<SidebarBtnElement formElement={FormElements.LinearScaleField}></SidebarBtnElement>*/}

            </div>

        </div>
    )

}export default FormElementsSidebar;

