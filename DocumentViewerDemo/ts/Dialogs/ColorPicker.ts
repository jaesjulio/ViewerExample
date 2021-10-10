/*! ************************************************************* */
/*! Copyright (c) 1991-2021 LEAD Technologies, Inc.               */
/*! All Rights Reserved.                                          */
/*! ************************************************************* */
module HTML5Demos {
   export module Dialogs {
      export interface IColorPicker {
         rootDivID: string;
      }

      export interface RGBA {
         r: number;
         g: number;
         b: number;
         a: number
      }

      export class ColorPicker {
         constructor(props: IColorPicker) {
            this.generateColorPicker(props);
         }

         private _baseColor = "red";
         private _color = "";
         public get color(): string { return this._color; }
         public set color(color: string) {
            if (this.isValidColor(color)) {
               if (this._picker)
                  this._picker.value = color;

               if (this._preview) {
                  this._preview.style.backgroundColor = color;
                  this._preview.style.borderColor = color;
               }

               this._color = color;
            }
         }

         private _picker: HTMLInputElement = null;
         private _preview: HTMLDivElement = null;
         private _hiddenPicker: HTMLInputElement = null;

         public enable = () => {
            if (this._picker && this._picker.disabled) {
               this._picker.disabled = false;
               this._hiddenPicker.disabled = false;
            }

         }

         public disable = () => {
            if (this._picker && !this._picker.disabled) {
               this._picker.disabled = true;
               this._hiddenPicker.disabled = true;
            }
         }

         private generateColorPicker = (props: IColorPicker) => {
            const root = document.getElementById(props.rootDivID);
            if (!root) {
               alert("There was an error creating the color picker - root id does not exist");
               return;
            }

            const picker = document.createElement("input");
            picker.setAttribute('type', 'text');
            picker.className = "colorPicker float";
            picker.value = this._baseColor;
            picker.disabled = true;

            const preview = document.createElement("div");
            preview.className = "colorSwatch float";
            preview.style.backgroundColor = this._baseColor;
            preview.style.borderColor = this._baseColor;

            const hiddenPicker = document.createElement("input");
            hiddenPicker.setAttribute('type', 'color');
            hiddenPicker.value = this._baseColor;
            hiddenPicker.style.display = "none";
            hiddenPicker.disabled = true


            const colorHandle = (e) => {
               const inputColor = e.target.value;
               if (picker.value != inputColor) {
                  picker.value = inputColor;
               }

               preview.style.backgroundColor = inputColor;
               preview.style.borderColor = inputColor;

               if (this.isValidColor(inputColor))
                  this._color = inputColor;
            }

            const previewClick = () => {
               hiddenPicker.click();
            }

            picker.addEventListener('input', colorHandle);
            picker.addEventListener('propertyChange', colorHandle); //Fix for IE8 and below

            preview.addEventListener('click', previewClick);
            hiddenPicker.addEventListener('input', colorHandle);

            this._picker = picker;
            this._preview = preview;
            this._hiddenPicker = hiddenPicker;

            root.appendChild(picker);
            root.appendChild(preview);
            root.appendChild(hiddenPicker);
         }

         private isValidColor = (testColor: string) => {
            if (testColor === this._baseColor)
               return true;

            const test = document.createElement('div');
            test.style.color = this._baseColor;
            test.style.color = testColor;

            let isValid = true;
            if (test.style.color === this._baseColor || test.style.color === '')
               isValid = false;

            test.remove();
            return isValid;
         }

         public colorToRGBA = (color: string): RGBA => {
            if (!color) throw new Error("Invalid color string passed");

            const temp = document.createElement('div');
            temp.style.color = color;
            document.body.appendChild(temp);

            const style = window.getComputedStyle(temp).color;
            const parsedColor = style.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
            if (!parsedColor) throw new Error("Failed to parse color");

            const rgba: RGBA = {
               r: parseInt(parsedColor[1]),
               g: parseInt(parsedColor[2]),
               b: parseInt(parsedColor[3]),
               a: parsedColor.length === 5 && parsedColor[4] ? +parsedColor[4] : 1
            };

            temp.remove();
            return rgba;
         }
      }
   }
}