import lz from 'lz-string';
import {Config} from './config.js';
import {Web, Utility} from 'gd-sprest';

// var Web, Utility
// if(!Config.local){
//   import('gd-sprest')
//   .then( (sprest) => {
//       Web = sprest.Web;
//       Utility = sprest.Utility;
//   });
// }

class SH{
  init(url) {
    this.url = url;
  };


  getListItems(listName) {
    var self = this;
    return new Promise(function(resolve, reject){
      var list, tabItems, web;

      web = new Web(self.url);
      list = web.Lists(listName);
      tabItems = [];

      list.Items().query({ Top: 5000, GetAllItems: true }).execute(function(items) {
        items.results.forEach( function(item) {
          var obj = {};
          obj = JSON.parse(lz.decompressFromBase64(item.Data));
          obj.ID = item.ID;
          tabItems.push(obj);
        });
        resolve(tabItems);
      });
    });
  };

  getCurrentUser() {
    var self = this;
    return new Promise(function(resolve, reject){
     
      var web;
      web = new Web(self.url);
      web.CurrentUser().execute(function(user) {
        var loc = user.Title.split('/')[1];
        var name = user.Title.split(' ')[0];
        var obj = {};
        obj.Email = user.Email;
        obj.Lastname = user.Title.split(' ')[1];
        obj.Name = name.substring(0, name.length - 1);
        obj.Location = loc.substring(0, loc.length - 1);
        resolve(obj);
      });
    });


  
  };


  createListItem(listName, object) {
    var self = this;
    return new Promise((resolve, reject) => {
      var list, web, obj;
      web = new Web(self.url);
      list = web.Lists(listName);
      obj = lz.compressToBase64(JSON.stringify(object))
      list.Items().add({
        Data: obj
      }).execute((function(_this) {
        return function(item) {
          resolve(item);
        };
      })(this));
    });
    
  };

  updateListItem(listName, object, id) {
    var self = this;
    return new Promise((resolve, reject) => {
      var list, web, obj;
      web = new Web(self.url);
      list = web.Lists(listName);
      obj = lz.compressToBase64(JSON.stringify(object))
      list.getItemById(id).execute((function(_this) {
        return function(item) {
          return item.update({
            Data: obj
          }).execute(function(itemN) {
            resolve(itemN);
          });
        };
      })(this));
    });
  };

  removeItemById(listName, id) {
    var self = this;
    return new Promise((resolve, reject) => {
      var list, web;
      web = new Web(self.url);
      list = web.Lists(listName);
      list.getItemById(id)["delete"]().execute(function(rep) {
        resolve(rep);
      });
    });
  };



  notify(title, type, url, list){
    var body = "Hi, <br />";
    body += "A new " + type;
    body += " has been issued. <br />You can discover it here:";
    body += " <a href='" + url + "'>" + title + "</a>";
    body += "<br /><br />Kind regards,<br />";
    body += Config.Admin;
    let subject = Config.Name + " | Notification : " + title;

    let util = new Utility();
    util.sendEmail({
      To:[""], 
      BCC: ["felix.fuin@nokia.com"], 
      Subject: subject, 
      Body:body
    }).execute();
  }

  contact(FromMail, ToMail, title, message) {
    return new Promise((resolve, reject) => {
      let subject, body, from;
      
      subject = Config.Name + " | Contact : " + title;
      body = message.replace(/\r\n|\r|\n/g,"<br />");
      from = FromMail;

      let util = new Utility();
      util.sendEmail({
        To:["felix.fuin@nokia.com"], 
        // To:[ToMail], 
        From: from,
        Subject:subject, 
        Body:body
      }).execute(function(rep) {
        resolve(rep);
      });
    });
  };
}
export default new SH();