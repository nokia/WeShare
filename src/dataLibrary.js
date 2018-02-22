import {Config} from './config.js';
import userLibrary from './userLibrary.js';
import oldItems from './lib/oldItems.js';
import SH from './sharePoint.js';
class Data{
    data = [];

    //Local
    // dataLocal1 = {ID: 2373726535663, User: {email: "felix.fuin@nokia.com", phone: "07383883"}, Category: 'JavaScript', Type:'request', Title:'Healthier Together', Description:"dsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessef", Duration:15, Date:new Date(), Ratings:2.5};
    // dataLocal2 = {ID: 3899787878290, User: {email: "feliiiiix.fuin@nokia.com"}, Category: 'Bureautique', Type:'share', Title:'Pivotable Excel file for NokiaEdu team', Description:"dsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessef", Duration:30, Date:new Date('December 17, 1995 03:24:00'), Ratings:4};
    // dataLocal3 = {ID: 2373787655668, User: {email: "felix.fuin@nokia.com", phone: "3344343"}, Type:'request', Title:'Need to know how to send emoji in Outlook', Description:"dsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessef", Duration:15, Date:new Date('December 19, 1995 03:24:00'), Ratings:1};
    // dataLocal4 = {ID: 2373745433666, User: {email: "feliiiiiix.fuin@nokia.com"}, Category: 'Fake Category', Type:'share', Title:'How to use the Learning Store', Description:"dsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessefdsesefsefsef osiefsefsfefes oishef fessef", Duration:15, Date:new Date('December 24, 1995 03:24:00'), Ratings:5};


    countCategory(category){
        // console.log('count', category, this.data);
        var count = 0;
        if(category === 'all'){
            count = this.data.length;
        }else if(category === 'my'){
            this.data.forEach(item => {
            // console.log('my', item.User, userLibrary.get().email)
                count += item.User === userLibrary.get().ID ? 1 : 0;
            });
        }else{
            this.data.forEach(item => {
                count += item.Category === category ? 1 : 0;
            });
            // console.log(count);
        }
        return count; 
        
    }
    countCategories(){
        // console.log('count', category, this.data);
        var self = this;
        return new Promise(function(resolve, reject){
            userLibrary.getCurrentUser().then((cur) => {
                var countTab = [];
                Config.Categories.forEach(confCat => {
                    countTab[confCat] = 0;
                });
                countTab["all"] = 0;
                countTab["my"] = 0;
                countTab["unclassified"] = 0;
                // console.log('tab', countTab);
                // console.log('cur', cur.ID);
                self.data.forEach(item => {
                    // console.log('it', item);
                    countTab["all"] = countTab["all"] + 1;
                    item.User === cur.ID ? countTab["my"] = countTab["my"] + 1 : null;
                    if(item.Category === "Unclassified"){
                        countTab["unclassified"] = countTab["unclassified"] + 1;
                    }else{
                        countTab[item.Category] = countTab[item.Category] + 1;
                    }
                });


                // if(category === 'all'){
                //     count = this.data.length;
                // }else if(category === 'my'){
                //     this.data.forEach(item => {
                //     // console.log('my', item.User, userLibrary.get().email)
                //         count += item.User === cur.ID ? 1 : 0;
                //     });
                // }else{
                //     this.data.forEach(item => {
                //         count += item.Category === category ? 1 : 0;
                //     });
                //     // console.log(count);
                // }
                // return count; 

                resolve(countTab);
            });
            
        });
        
        
    }
    add(item){
        this.data.push(item);

        SH.createListItem('Items', item).then((results) => {
            console.log('created item', results);
        });
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
        var self = this;
        var ret = [];
        return new Promise(function(resolve, reject){
            if(self.data.length === 0){
                // this.data = [this.dataLocal3, this.dataLocal4, this.dataLocal1,this.dataLocal1,this.dataLocal1,this.dataLocal2,this.dataLocal2,this.dataLocal2,this.dataLocal1,this.dataLocal1,this.dataLocal1,this.dataLocal1,this.dataLocal2,this.dataLocal2,this.dataLocal1,this.dataLocal1,this.dataLocal1,this.dataLocal2,this.dataLocal1,this.dataLocal2, this.dataLocal2,this.dataLocal2,this.dataLocal2];
                if(Config.local){
                    var d = oldItems;
                    // console.log('oldItems', d);

                    self.data = d;
                    self.sortByCategories();
                    self.sortByDate();
                    resolve(self.data);
                }else{
                    var s = SH.getListItems('Items');
                    s.then((result) => {
                        // result.forEach(r => {
                        //     ret.push(r.Data);
                        // });
                        self.data = result;
                        self.sortByCategories();
                        self.sortByDate();
                        resolve(self.data);
                    });
                }
                
            }
            else{
                resolve(self.data);
            }
        });
        
    }
    sortByDate(){
        this.data.sort(function(a, b) {
            var dateA = new Date(a.Date), dateB = new Date(b.Date);
            return dateB - dateA;
        });
    }
    sortByCategories(){
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
    getById(id){
        var self = this;
        return new Promise(function(resolve, reject){
            self.get().then((result) =>{
                var item;
                var i = 0;
                var found = false;
                while(!found && i < self.data.length){
                    // console.log(this.data[i].ID, id)
                    if(self.data[i].ID === Number(id)){
                        item = self.data[i];
                        found = true;
                    }
                    i++;
                }
                resolve(item);
            });
        });
    }
}
export default new Data();