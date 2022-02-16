import { LightningElement, api } from 'lwc';

export default class CarTile extends LightningElement {
    @api car ={}

    handleClick(){
        // fire event "selected" (onselected) to parent component
        this.dispatchEvent(new CustomEvent('selected', {
            //detail:this.car.Id
            detail:this.car
        }))
    }
}