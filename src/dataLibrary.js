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
    dataFull = [];

    init(){
        
        return new Promise( (resolve, reject) => {
            window.fetch(window.location.href.split('not-found')[0].split('index.aspx')[0].split('index.html')[0] + "/json.categories", { credentials:'include' }).then( (file) => file.json() )
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
                    if(item.User === cur.ID){
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
    add(item){
        return new Promise((resolve, reject)=>{
            if(Config.local){
                item.ID = new Date().getTime();
                item.User = userLibrary.localCurrentUser();
                this.data.unshift(item);
                this.dataFull.unshift(item);
                resolve(item);
                return;
            }
            SH.createListItem('Items', item).then((results) => {
                item.ID = results.ID;
                this.data.unshift(item);
                this.dataFull.unshift(item);
                resolve(item);
            });
        });

        
    }
    notify(item){
        if(Config.local){
            return;
        }
        let list = [];
        userLibrary.users.forEach(u => {
            list.push(u.Email);
        });
        SH.notify(item.Title, item.Type, Config.itemUrl + item.ID, list);
    }
    update(item){
        return new Promise((resolve, reject)=>{
            var tmp, found;
            if(Config.local){
                tmp = 0;
                found = false;
                while(tmp < this.data.length && !found){
                    if(this.data[tmp].ID === item.ID){
                        this.data[tmp] = item;
                        found = true;
                    }
                    tmp++;
                }
                resolve(item);
                return;
            }
            tmp = 0;
            found = false;
            while(tmp < this.data.length && !found){
                if(this.data[tmp].ID === item.ID){
                    this.data[tmp] = item;
                    found = true;
                    SH.updateListItem('Items', item, item.ID).then((results) => {
                        resolve(item);
                    });
                }
                tmp++;
            }
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
    get(){
        return new Promise((resolve, reject)=>{
            if(this.data.length === 0){
                if(Config.local){
                    var d = oldItems;
                    this.data = d;
                    this.sortByCategories();
                    this.sortByDate();
                    resolve(this.data);
                }else{
                    var s = SH.getListItems('Items');
                    s.then((result) => {
                        this.data = result;
                        this.sortByCategories();
                        this.sortByDate();
                        resolve(this.data);
                    });
                }
            }
            else{
                resolve(this.data);
            }
        });
    }
    getFull(){
        return new Promise((resolve, reject) => {
            var self = this;
            if(this.dataFull.length === 0){
                userLibrary.get().then(() =>{
                    self.get().then((d)=>{
                        self.dataFull = d;
                        if(Config.local){
                            for(var i = 0; i < self.data.length; i++) {
                                self.dataFull[i].User = userLibrary.localCurrentUser();
                            }
                        }else{
                            for(var i = 0; i < self.data.length; i++) {
                                for(var j = 0; j < userLibrary.users.length; j++) {
                                    if(self.data[i].User === userLibrary.users[j].ID){
                                        self.dataFull[i].User = userLibrary.users[j];
                                    }
                                }
                            }
                        }
                    });
                });
            }
            else{
                resolve(this.dataFull);
            }
        });
    }
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
            this.getFull().then((result) =>{
                var item;
                var i = 0;
                var found = false;
                while(!found && i < this.dataFull.length){
                    if(this.dataFull[i].ID === Number(id)){
                        item = this.dataFull[i];
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