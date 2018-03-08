import SH from './sharePoint.js';
import { Config } from './config.js';
class User{

    localCurrentUser(){
        return {
            Email: "john.doe@nokia.com",
            Number: "+3611223344",
            Location: "Paris-Saclay",
            Lastname: "John",
            Name: "Doe",
            ID: 999999999
        };
    }
    currentUser;
    users;

    update(user){
        var self = this;
        return new Promise(function(resolve, reject){
            if(Config.local){
                self.currentUser = user;
                resolve('user')
                return;
            }
            self.currentUser = user;
            SH.updateListItem('Users', user, user.ID).then((results) => {
                resolve(results);
            });
        });
        
    }
    contact(email, title, message){
        var self = this;
        return new Promise(function(resolve, reject){
            if(Config.local){
                resolve('local')
                return;
            }
            SH.contact(self.currentUser.Email, email, title, message).then((result) =>{
                resolve('sent');
            });
        });
    }


    getCurrentUser(){
        var self = this;
        return new Promise(function(resolve, reject){
            if(Config.local){
                resolve(self.localCurrentUser());
                return;
            }
            if(self.currentUser){
                resolve(self.currentUser);
            } else{
                var s = self.get();
                SH.getCurrentUser().then((cur) =>{
                    s.then((tabUsers) => {
                        var found = false;
                        for(var i = 0; i < tabUsers.length; i++) {
                            if (tabUsers[i].Email === cur.Email) {
                                found = true;
                                self.currentUser = tabUsers[i];
                                break;
                            }
                        }
                        if(!found){
                            SH.createListItem('Users', cur).then((result) => {
                                cur.ID = result.ID;
                                self.currentUser = cur;
                                resolve(self.currentUser);
                            });
                        }else{
                            if(self.currentUser.Number){
                                cur.Number = self.currentUser.Number;
                            }
                            if(self.currentUser.ID){
                                cur.ID = self.currentUser.ID;
                            }
                            self.currentUser = cur;
                            self.update(cur);
                            resolve(cur);
                        }
                    });
                });
            }
        });
    }

    get(){
        var self = this;
        return new Promise(function(resolve, reject){
            
            if(!self.users){
                var s = SH.getListItems('Users');
                s.then((result) => {
                    self.users = result;
                    resolve(self.users);
                });
            }
            else{
                resolve(self.users);
            }
        });
    }
}
export default new User();