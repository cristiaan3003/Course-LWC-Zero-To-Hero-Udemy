import { LightningElement, api, wire} from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';

//schema
import MAKE_FILED from '@salesforce/schema/Car__c.Make__c'
import CAR_OBJECT from '@salesforce/schema/Car__c'

//controllers
import getSimilarCars from '@salesforce/apex/CarController.getSimilarCars'


//navigation
import {NavigationMixin} from 'lightning/navigation'

export default class SimilarCars extends NavigationMixin(LightningElement) {

    @api recordId
    car = []
    error
    similarCars

    @wire(getRecord,{recordId:'$recordId',fields:[MAKE_FILED]})
    SimilarCars({data,error}){
        if(data){
            this.car = data
        }
        if(error){
            this.error = error
        }
    }

    handlerFetchSimilarCars(){
        //console.log('handlerFetchSimilarCars')
        //console.log(this.car)
        getSimilarCars({
            carId:this.recordId,
            makeType:this.car.fields.Make__c.value
        })
        .then((result) => {
            this.similarCars = result
            console.log(this.similarCars)
        })
        .catch((error) => {
            console.log(error);
        })
    }

    /* Navigate to record page: Navigation Mixin */
    /* 
                button inside a html loop, so was added way to identidy like a index, to
                identify what button was clickedwhen event is fired in html propety button "data-id"
                Here I get that info with  event.target.dataset.id
    */
    handleViewDetails(event){
        console.log(event.target.dataset.id)
        this[NavigationMixin.Navigate]({
            type:'standard__recordPage',
            attributes:{
                recordId: event.target.dataset.id,
                objectApiName: CAR_OBJECT.objectApiName,
                actionName:'view'
           }
        })
    }
}