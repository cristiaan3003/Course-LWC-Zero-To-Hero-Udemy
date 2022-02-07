import { LightningElement } from 'lwc';
import {loadStyle} from 'lightning/platformResourceLoader'
//import FONTAWESOME from '@salesforce/resourceUrl/fontawesome'
import FONTAWESOME from '@salesforce/resourceUrl/fontawesome5'
export default class MemoryGameLwc extends LightningElement {

    isLibLoaded = false
    openFigures =[]
    moves = 0
    machedFigures = []
    totalTime = '00.00'
    showCongratulations = false
    timerRef
    figures =[
        {id:1, listClass:"figure", type:'cat', icon:'fas fa-cat'},
        {id:2, listClass:"figure",type:'car',icon:'fas fa-car'},
        {id:3, listClass:"figure",type:'mask',icon:'fas fa-mask'},
        {id:4, listClass:"figure",type:'heart',icon:'fas fa-heart'},
        {id:5, listClass:"figure",type:'carrot',icon:'fas fa-carrot'},
        {id:6, listClass:"figure",type:'snowman',icon:'fas fa-snowman'},
        {id:7, listClass:"figure",type:'guitar',icon:'fas fa-guitar'},
        {id:8, listClass:"figure",type:'store',icon:'fas fa-store'},
        {id:9, listClass:"figure", type:'cat', icon:'fas fa-cat'},
        {id:10, listClass:"figure",type:'car',icon:'fas fa-car'},
        {id:11, listClass:"figure",type:'mask',icon:'fas fa-mask'},
        {id:12, listClass:"figure",type:'heart',icon:'fas fa-heart'},
        {id:13, listClass:"figure",type:'carrot',icon:'fas fa-carrot'},
        {id:14, listClass:"figure",type:'snowman',icon:'fas fa-snowman'},
        {id:15, listClass:"figure",type:'guitar',icon:'fas fa-guitar'},
        {id:16, listClass:"figure",type:'store',icon:'fas fa-store'},

    ]

    get gameRating(){
        let starts = this.moves>9 && this.moves<12 ? [1,2,3]: this.moves>=13 ? [1,2]:[1]
        return this.machedFigures.length === 16 ? starts : []
    }
    displayCard(event){
        let currentCard = event.target
        currentCard.classList.add("open","show","disabled")
        this.openFigures = this.openFigures.concat(event.target)
        const len = this.openFigures.length
        if(len === 2){
            this.moves = this.moves + 1
            if(this.moves=== 1){
                this.timer()
            }
            if(this.openFigures[0].type === this.openFigures[1].type){ //matched

                this.machedFigures = this.machedFigures.concat(this.openFigures[0], this.openFigures[0]) // add to mached list
                this.openFigures[0].classList.add("match","disabled")
                this.openFigures[1].classList.add("match","disabled")
                this.openFigures[0].classList.remove("show","open")
                this.openFigures[1].classList.remove("show","open")
                this.openFigures=[]

                if(this.machedFigures.length === 16){ // cut timer when all figures are discover
                    window.clearInterval(this.timerRef)
                    this.showCongratulations = true
                }

            } else { //unmatched
                this.openFigures[0].classList.add("unmatched")
                this.openFigures[1].classList.add("unmatched")
                this.action('DISABLE')
                setTimeout(() =>{
                    this.openFigures[0].classList.remove("show","open","unmatched")
                    this.openFigures[1].classList.remove("show","open","unmatched")
                    this.action('ENABLE')
                    this.openFigures=[] 
                }, 1000)
            }

            
        }

    }

    action(action){
        let figures = this.template.querySelectorAll('.figure')
        Array.from(figures).forEach(item =>{
            if(action === 'ENABLE'){
                let isMatch = item.classList.contains('match')
                if(!isMatch){
                    item.classList.remove('disabled')
                }
            }
            if(action == 'DISABLE'){
                item.classList.add('disabled')
            }
        })
    }

    timer(){
        let startTime = new Date()
        this.timerRef = setInterval(()=>{
            let diff = new Date().getTime() - startTime.getTime()
            let d = Math.floor(diff/1000)
            let m = Math.floor(d % 3600 / 60)
            let s = Math.floor(d % 3600 % 60)
            const mDisplay = m>0 ? m+(m===1 ? " minute, ":" minutes, "):""
            const sDisplay = s>0 ? s+(s===1 ? " second, ":" seconds, "):""
            this.totalTime = mDisplay + sDisplay
        }, 1000)
    }

    restartGame(){
        this.showCongratulations = false
        this.openFigures =[]
        this.moves = 0
        this.machedFigures = []
        this.totalTime = '00.00'
        window.clearInterval(this.timerRef)
        let elem = this.template.querySelectorAll('.figure')
        Array.from(elem).forEach(item => {
            item.classList.remove("show","open", "disabled", "match")
        })

        this.figures = this.shufler(this.figures)
    }

    shufler(objectList){
        let array = [... objectList]
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // swap
        }
        return [... array]
    }

    renderedCallback(){
        if(this.isLibLoaded){
            return
        } else {
            Promise.all(
                [
                    //loadStyle(this, FONTAWESOME+'/fontawesome/css/font-awesome.min.css')
                    loadStyle(this, FONTAWESOME+'/css/all.min.css')
                ]
            ).then(() =>{
                //loads successfully
                console.log('loaded successfully')
    
            }).catch(error =>{
                console.log(error)
            })
            this.isLibLoaded = true
        }
    }

}