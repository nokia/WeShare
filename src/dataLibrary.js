import {Config} from './config.js';
import userLibrary from './userLibrary.js';

class Data{
    data = [];

    //Local
    dataLocal1 = {ID: 2373726535663, User: {email: "felix.fuin@nokia.com", phone: "07383883"}, Category: 'JavaScript', Type:'request', Title:'Healthier Together', Description:"dsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessef", Duration:15, Date:new Date(), Ratings:2.5};
    dataLocal2 = {ID: 3899787878290, User: {email: "feliiiiix.fuin@nokia.com"}, Category: 'Bureautique', Type:'share', Title:'Pivotable Excel file for NokiaEdu team', Description:"dsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessef", Duration:30, Date:new Date('December 17, 1995 03:24:00'), Ratings:4};
    dataLocal3 = {ID: 2373787655668, User: {email: "felix.fuin@nokia.com", phone: "3344343"}, Type:'request', Title:'Need to know how to send emoji in Outlook', Description:"dsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessef", Duration:15, Date:new Date('December 19, 1995 03:24:00'), Ratings:1};
    dataLocal4 = {ID: 2373745433666, User: {email: "feliiiiiix.fuin@nokia.com"}, Category: 'Fake Category', Type:'share', Title:'How to use the Learning Store', Description:"dsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessef", Duration:15, Date:new Date('December 24, 1995 03:24:00'), Ratings:5};


    countCategory(category){
        // console.log('count', category, this.data);
        var count = 0;
        let data = this.get()
        
        if(category === 'all'){
            count = data.length;
        }else if(category === 'my'){
            data.forEach(item => {
            // console.log('my', item.User, userLibrary.get().email)
                count += item.User.email === userLibrary.get().email ? 1 : 0;
            });
        }else{
            data.forEach(item => {
                count += item.Category === category ? 1 : 0;
            });
            // console.log(count);
        }
        return count; 
    }
    add(item){
        this.data.push(item);

        /* UPLOAD ON SHAREPOINT */
    }
    update(item){
        var tmp = 0;
        var found = false;
        while(tmp < this.data.length && !found){
            if(this.data.ID === item.ID){
                this.data[tmp] = item;
                found = true;
            }
            tmp++;
        }
    }
    remove(item){
        var tmp = 0;
        var found = false;
        while(tmp < this.data.length && !found){
            if(this.data[tmp].ID === item.ID){
                this.data.splice(tmp, 1);
                found = true;
            }
            tmp++;
        }
    }
    get(){
        if(this.data.length === 0){
            this.data = [this.dataLocal3, this.dataLocal4, this.dataLocal1,this.dataLocal1,this.dataLocal1,this.dataLocal2,this.dataLocal2,this.dataLocal2,this.dataLocal1,this.dataLocal1,this.dataLocal1,this.dataLocal1,this.dataLocal2,this.dataLocal2,this.dataLocal1,this.dataLocal1,this.dataLocal1,this.dataLocal2,this.dataLocal1,this.dataLocal2, this.dataLocal2,this.dataLocal2,this.dataLocal2];
            this.data.forEach(item =>{
                if(!item.Category){
                    item.Category = "Unclassified";
                }else{
                    if(Config.Categories.includes(item.Category)){
                        return;
                    }
                    else{
                        let found = false;
                        Config.Categories.forEach(confCat => {
                            if(Array.isArray(confCat)){
                                if(confCat[1].includes(item.Category)){
                                    found = true;
                                }
                            }
                        });
                        if(!found){
                            item.Category = "Unclassified";
                        }
                    }
                   
                }
            });
        }
        this.data.sort(function(a, b) {
            var dateA = new Date(a.Date), dateB = new Date(b.Date);
            return dateB - dateA;
        });
        return this.data;
    }
    getById(id){
        var item;
        if(this.data.length === 0){
            //get database
            this.get();
        }
        var i = 0;
        var found = false;
        while(!found && i < this.data.length){
            // console.log(this.data[i].ID, id)
            if(this.data[i].ID === Number(id)){
                item = this.data[i];
                found = true;
            }
            i++;
        }
        return item;
    }
}
export default new Data();