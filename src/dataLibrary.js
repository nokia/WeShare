/*
  @author Félix Fuin
  Copyright Nokia 2018. All rights reserved.
*/
import {Config} from './config.js';
import userLibrary from './userLibrary.js';
import SH from './sharePoint.js';
import oldItems from './lib/oldItems.js';

class Data{
    data = [];
    // dataFull = [];

    init(){
        return new Promise( (resolve, reject) => {
            window.fetch(window.location.href.split('not-found')[0].split('#browse')[0].split('index.aspx')[0].split('index.html')[0] + "/json.categories", { credentials:'include' }).then( (file) => file.json() )
            .then( (json) => {
                this.Categories = json;
                resolve('OK');
            });
        });
    }

    countCategory(category){
        var count = 0;
        if(category === 'all'){
            count = this.data.length;
        }else if(category === 'my'){
            this.data.forEach(item => {
                count += item.User === userLibrary.get().ID ? 1 : 0;
            });
        }else{
            this.data.forEach(item => {
                count += item.Category === category ? 1 : 0;
            });
        }
        return count; 
        
    }
    countCategories(){
        return new Promise((resolve, reject) => {
            userLibrary.getCurrentUser().then((cur) => {
                var countTab = [];
                this.Categories.forEach(confCat => {
                    countTab[confCat] = 0;
                });
                countTab["all"] = 0;
                countTab["my"] = 0;
                countTab["unclassified"] = 0;
                this.data.forEach(item => {
                    countTab["all"] = countTab["all"] + 1;
                    if(item.User.ID === cur.ID){
                        countTab["my"] = countTab["my"] + 1
                    }
                    if(item.Category === "Unclassified"){
                        countTab["unclassified"] = countTab["unclassified"] + 1;
                    }else{
                        countTab[item.Category] = countTab[item.Category] + 1;
                    }
                });
                resolve(countTab);
            });
            
        });
    }
    notify(item){
        if(Config.local){
            return;
        }
        let list = [];
        userLibrary.users.forEach(u => {
            if(u.Notification){
                list.push(u.Email);
            }
        });
        let itemUrl = window.location.href.split('not-found')[0].split('#browse')[0].split('index.aspx')[0].split('index.html')[0] + "/index.aspx/item/";
        itemUrl = itemUrl + item.ID;
        if(!item.ID){
            itemUrl = window.location.href.split('not-found')[0].split('#browse')[0].split('index.aspx')[0].split('index.html')[0] + "/index.aspx";
        }
        SH.notify(item.Title, item.Type, itemUrl, list);
    }
    add(item, user){
        return new Promise((resolve, reject)=>{
            if(Config.local){
                item.ID = new Date().getTime();
                item.User = userLibrary.localCurrentUser();
                this.data.unshift(item);
                
                this.sortByCategories();
                resolve(item);
                return;
            }
            SH.createListItem('Items', item).then((results) => {
                item.ID = results.ID;
                item.User = user;
                this.data.unshift(item);
                resolve(item);
            });
        });
    }
    update(item, user){
        return new Promise((resolve, reject)=>{
            if(Config.local){
                this.data.forEach((el) =>{
                    if(el.ID === item.ID){
                        el = item;
                        return;                    }
                    resolve(item);
                    return;
                });
                return;
            }
            this.data.forEach((el) =>{
            	if(el.ID === item.ID){
                    item.User = item.User.ID;
                    SH.updateListItem('Items', item, item.ID).then((results) => {
                        item.User = user;
                       	el = item;
                        resolve(item);
                        return;
                    });
                }
            });
            // while(tmp < this.data.length && !found){
            //     if(this.data[tmp].ID === item.ID){
            //         found = true;
            //         console.log('found', item, tmp, this.data, this.data)
            //         SH.updateListItem('Items', item, item.ID).then((results) => {
            //             item.User = user;
            //             console.log('result', item);
            //             // this.data = this.dataFull.slice();
            //             this.data[tmp] = item;
            //             // this.data[tmp] = item;
            //             console.log('result2', this.data);
            //             resolve(item);
            //         });
            //     }
            //     tmp++;
            // }
        });
        
    }
    remove(item){
        return new Promise((resolve, reject)=>{
            var tmp, found;
            if(Config.local){
                tmp = 0;
                found = false;
                while(tmp < this.data.length && !found){
                    if(this.data[tmp].ID === item.ID){
                        this.data.splice(tmp, 1);
                        found = true;
                    }
                    tmp++;
                }
                resolve('deleted');
                return;
            }
            tmp = 0;
            found = false;
            while(tmp < this.data.length && !found){
                if(this.data[tmp].ID === item.ID){
                    this.data.splice(tmp, 1);
                    SH.removeItemById('Items', item.ID).then((results) => {
                        resolve('deleted');
                    });
                    found = true;
                }
                tmp++;
            }
        });
        
    }
    get(force){
        return new Promise((resolve, reject)=>{
            if(this.data.length === 0 || force){
                let i;
                if(Config.local){
                    var d = oldItems;
                    this.data = d;
                    this.sortByCategories();
                    this.sortByDate();
                    for(i = 0; i < this.data.length; i++) {
                        this.data[i].User = userLibrary.localCurrentUser();
                        this.data[i].User.ID = Math.random();
                    }
                    resolve(this.data);
                }else{
                    var s = SH.getListItems('Items');
                    var u = userLibrary.get();
                    s.then((result) => {
                        u.then(() => {
                            // console.log('lib', result)
                            this.data = result;
                            this.sortByCategories();
                            this.sortByDate();
                            for(i = 0; i < this.data.length; i++) {
                                for(var j = 0; j < userLibrary.users.length; j++) {
                                    if(this.data[i].User === userLibrary.users[j].ID){
                                        this.data[i].User = userLibrary.users[j];
                                    }
                                }
                            }
                            resolve(this.data);
                        });
                        
                    });
                }
            }
            else{
                resolve(this.data);
            }
        });
    }
    // getFull(force){
    //     return new Promise((resolve, reject) => {
    //         var self = this;
    //         if(this.dataFull.length === 0 || force){
    //             userLibrary.get().then(() =>{
    //                 self.get().then((d)=>{
    //                     self.dataFull = d.slice();
    //                     let i;
    //                     if(Config.local){
    //                         for(i = 0; i < self.data.length; i++) {
    //                             self.dataFull[i].User = userLibrary.localCurrentUser();
    //                             self.dataFull[i].User.ID = Math.random();
    //                         }
    //                     }else{
    //                         for(i = 0; i < self.data.length; i++) {
    //                             for(var j = 0; j < userLibrary.users.length; j++) {
    //                                 if(self.data[i].User === userLibrary.users[j].ID){
    //                                     self.dataFull[i].User = userLibrary.users[j];
    //                                 }
    //                             }
    //                         }
    //                     }
    //                     resolve(this.dataFull);
    //                 });
    //             });
    //         }
    //         else{
    //             resolve(this.dataFull);
    //         }
    //     });
    // }
    sortByDate(){
        this.data.sort((a, b) =>{
            var dateA = new Date(a.Date), dateB = new Date(b.Date);
            return dateB - dateA;
        });
    }
    sortByCategories(){
        this.data.forEach(item =>{
            if(!item.Category){
                item.Category = "Unclassified";
            }else{
                if(this.Categories.includes(item.Category)){
                    return;
                }
                else{
                    let found = false;
                    this.Categories.forEach(confCat => {
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
        return new Promise((resolve, reject)=>{
            this.get().then((result) =>{
                var item;
                var i = 0;
                var found = false;
                while(!found && i < this.data.length){
                    if(this.data[i].ID === Number(id)){
                        item = this.data[i];
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