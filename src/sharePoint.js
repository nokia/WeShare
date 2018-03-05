import { $REST } from 'gd-sprest';
import lz from 'lz-string';
import {Config} from './config.js';
class SH{
  init(url) {
    this.url = url;
  };


  getListItems(listName) {
    var self = this;
    return new Promise(function(resolve, reject){
      var list, tabItems, web;
      web = new $REST.Web(self.url);
      list = web.Lists(listName);
      tabItems = [];
      list.Items().execute(function(items) {
        // console.log('res', items);
        items.results.forEach( function(item) {
          var obj = new Object();
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
      web = new $REST.Web(self.url);
      web.CurrentUser().execute(function(user) {
        // console.log('us', user);
        var loc = user.Title.split('/')[1];
        var name = user.Title.split(' ')[0];
        var obj = new Object();
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
      web = new $REST.Web(self.url);
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
      web = new $REST.Web(self.url);
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
    console.log('remove');
    return new Promise((resolve, reject) => {
      var list, web;
      web = new $REST.Web(self.url);
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
    
    
    console.log('notify', Config, list);

    $REST.Utility().sendEmail({
      To:[], 
      From: "\"" + Config.Admin + " <learningstore@nokia.com>\"",
      BCC: ["felix.fuin@nokia.com"], 
      Subject:"WeShare notification : " + title, 
      Body:body
    }).execute();
  }

  contact(FromMail, ToMail, title, message) {
    var self = this;
    return new Promise((resolve, reject) => {
      let to, subject, body, from;
      to = ToMail;
      subject = title;
      body = message.replace(/\r\n|\r|\n/g,"<br />");
      from = FromMail;
      $REST.Utility().sendEmail({
        To:[to], 
        From: "\"" + Config.Admin + " <learningstore@nokia.com>\"",
        // BCC:from, 
        Subject:subject, 
        Body:body
      }).execute(function(rep) {
        resolve(rep);
      });
    });
  };
}

export default new SH();
