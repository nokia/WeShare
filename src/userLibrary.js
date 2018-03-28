/*
  @author Félix Fuin
  Copyright Nokia 2018. All rights reserved.
*/

import SH from './sharePoint.js';
import { Config } from './config.js';

class User{

    currentUser;
    users;

    localCurrentUser(){
        return {
            Email: "john.doe@nokia.com",
            Number: "+3611223344",
            Location: "Paris-Saclay",
            Lastname: "John",
            Name: "Doe",
            Notification: true,
            ID: 999999999
        };
    }

    update(user){
        return new Promise( (resolve, reject) => {
            if(Config.local){
                this.currentUser = user;
                resolve('user')
                return;
            }
            this.currentUser = user;
            SH.updateListItem('Users', user, user.ID).then( results => resolve(results) );
        });
        
    }

    contact(email, title, message){
        return new Promise( (resolve, reject) => {
            if(Config.local){
                resolve('local')
                return;
            }
            SH.contact(this.currentUser.Email, email, title, message).then( result => resolve('sent') );
        });
    }


    getCurrentUser(){
        const prom = new Promise( (resolve, reject) => {
            if(Config.local){
                resolve(this.localCurrentUser());
                return;
            }
            if(this.currentUser){
                resolve(this.currentUser);
                return;
            }
 
            const cur = SH.getCurrentUser();
            this.get().then( tabUsers => {
                let found = false;
                for(var i = 0; i < tabUsers.length; i++) {
                    if (tabUsers[i].Email === cur.Email) {
                        found = true;
                        this.currentUser = tabUsers[i];
                        break;
                    }
                }
                if(!found){
                    cur.Notification = true;
                    SH.createListItem('Users', cur).then( result => {
                        cur.ID = result.ID;
                        this.currentUser = cur;
                        resolve(this.currentUser);
                    });
                }else{
                    if(this.currentUser.Number){
                        cur.Number = this.currentUser.Number;
                    }
                    if(this.currentUser.ID){
                        cur.ID = this.currentUser.ID;
                    }
                    if(this.currentUser.Notification){
                        cur.Notification = true;
                    }
                    this.currentUser = cur;
                    this.update(cur);
                    resolve(cur);
                }
            });
        });
        return prom;
    }

    get(){
        return new Promise( (resolve, reject) => {
            if(Config.local){
                resolve(this.localCurrentUser());
                return;
            }
            if(!this.users){
                var s = SH.getListItems('Users');
                s.then( result => {
                    this.users = result;
                    this.users.forEach(element => {
                        if(!element.hasOwnProperty('Notification')){
                            element.Notification = true;
                        }
                        if(!element.Lastname){
                            element.Lastname = element.Email.split('.')[0];
                            element.Lastname = element.Lastname.charAt(0).toUpperCase() + element.Lastname.slice(1);
                        }
                        if(!element.Name){
                            element.Name = element.Email.split('.')[1];
                            element.Name = element.Name.split('@')[0];
                            element.Name = element.Name.charAt(0).toUpperCase() + element.Name.slice(1);
                        }
                    });
                    resolve(this.users);
                });
            }
            else{
                resolve(this.users);
            }
        });
    }
}

export default new User();