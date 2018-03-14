/*
  @author Félix Fuin
  Copyright Nokia 2018. All rights reserved.
*/

import lz from 'lz-string';
import {Config} from './config.js';
import {Web, Utility} from 'gd-sprest';

class SH{
  init(url) { this.url = url; }

  getListItems(listName) {
    return new Promise( (resolve, reject) => {
      const list = new Web(this.url).Lists(listName);
      list.Items().query({ Top: 5000, GetAllItems: true }).execute( items => {
        const tabItems = []; 
        items.results.forEach( item => {
          const obj = JSON.parse(lz.decompressFromBase64(item.Data));
          obj.ID = item.ID;
          tabItems.push(obj);
        });
        resolve(tabItems);
      });
    });
  }

  getCurrentUser() {
    const loc = window._spPageContextInfo.userDisplayName.split('/')[1];
    const name = window._spPageContextInfo.userDisplayName.split(' ')[0];
    return {
      Email: window._spPageContextInfo.userEmail,
      Lastname: window._spPageContextInfo.userDisplayName.split(' ')[1],
      Name: name.substring(0, name.length - 1),
      Location: loc.substring(0, loc.length - 1)
    }
  }

  createListItem(listName, object) {
    return new Promise((resolve, reject) => {
      const list = new Web(this.url).Lists(listName);
      list.Items().add({ Data: lz.compressToBase64(JSON.stringify(object)) }).execute( item => resolve(item) );
    });
  }

  updateListItem(listName, object, id) {
    return new Promise( (resolve, reject) => {
      const list = new Web(this.url).Lists(listName);
      list.getItemById(id).execute( item => {
        item.update({ Data: lz.compressToBase64(JSON.stringify(object)) }).execute( itemN => resolve(itemN) );
      });
    });
  }

  removeItemById(listName, id) {
    return new Promise( (resolve, reject) => {
      const list = new Web(this.url).Lists(listName);
      list.getItemById(id)["delete"]().execute( rep => resolve(rep) );
    });
  }

  notify(title, type, url, list){
    var body = "Hi, <br />";
    body += "A new " + type;
    body += " has been issued. <br />You can discover it here:";
    body += " <a href='" + url + "'>" + title + "</a>";
    body += "<br /><br />Kind regards,<br />";
    body += Config.Admin;

    new Utility().sendEmail({
      To:[""], 
      BCC: ["felix.fuin@nokia.com"], 
      Subject: Config.Name + " | Notification : " + title, 
      Body:body
    }).execute();
  }

  contact(FromMail, ToMail, title, message) {
    return new Promise( (resolve, reject) => {
      new Utility().sendEmail({
        To:["felix.fuin@nokia.com"], 
        // To:[ToMail], 
        From: FromMail,
        Subject:Config.Name + " | Contact : " + title, 
        Body:message.replace(/\r\n|\r|\n/g,"<br />")
      }).execute( rep => resolve(rep) );
    });
  };
}

export default new SH();