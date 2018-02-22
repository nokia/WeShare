import SH from './sharePoint.js';
class User{

    // user = {
    //     email: "felix.fuin@nokia.com",
    //     lastname: "Félix",
    //     name: "Fuin",
    //     ID: 50,
    //     location: "Paris-Saclay"
    // };
    currentUser;
    users;
    


    getCurrentUser(){
        var self = this;
        return new Promise(function(resolve, reject){
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
                        // console.log('found ?', found)
                        if(!found){
                            SH.createListItem('Users', cur).then((result) => {
                                // console.log('create userrrrr', result);
                                cur.ID = result.ID;
                                self.currentUser = cur;
                                resolve(self.currentUser);
                            });
                        }
                        else{
                            resolve(self.currentUser);
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
                // this.data = [this.dataLocal3, this.dataLocal4, this.dataLocal1,this.dataLocal1,this.dataLocal1,this.dataLocal2,this.dataLocal2,this.dataLocal2,this.dataLocal1,this.dataLocal1,this.dataLocal1,this.dataLocal1,this.dataLocal2,this.dataLocal2,this.dataLocal1,this.dataLocal1,this.dataLocal1,this.dataLocal2,this.dataLocal1,this.dataLocal2, this.dataLocal2,this.dataLocal2,this.dataLocal2];
                
                var s = SH.getListItems('Users');
                s.then((result) => {
                    // result.forEach(r => {
                    //     ret.push(r.Data);
                    // });
                    // console.log('res us', result);
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
