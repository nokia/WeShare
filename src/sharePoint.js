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
      
      
      list.Items().query({ Select: ["ID", "Data"], Top: 5000, GetAllItems: true }).execute( items => {
        const tabItems = items.results.map( item => {
          const obj = JSON.parse(lz.decompressFromBase64(item.Data));
          obj.ID = item.ID;
          return obj;
        });
        resolve(tabItems);
      });
    });
  }

  getCurrentUser() {
    const loc = window._spPageContextInfo.userDisplayName.split('/')[1];
    const name = window._spPageContextInfo.userDisplayName.split(', ')[0];
    const lastname = window._spPageContextInfo.userDisplayName.split(', ')[1].split(' (')[0];
    // console.log(window._spPageContextInfo.userDisplayName  )
    // console.log(window._spPageContextInfo.userDisplayName.split(' ')[0])
    // console.log(window._spPageContextInfo.userDisplayName.split(' ')[1])
    // console.log(name.substring(0, name.length - 1))
    if(loc) return {
        Email: window._spPageContextInfo.userEmail,
        Lastname: lastname,
        Name: name,
        Location: loc.substring(0, loc.length - 1)
      }
    return {
        Email: window._spPageContextInfo.userEmail,
        Lastname: lastname,
        Name: name
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
    var body = "Hi, <br /><br />";
    if(type === "share"){
      body += "A new help proposal";
    }else{
      body += "A new request for help";
    }
    body += " has been published:";
    body += " <a href='" + url + "'>" + title + "</a>";
    body += "<br /><br /><em>You can disable notifications in the settings by clicking on your profile</em><br />";
    body += "<br /><br />Best regards,<br />";
    body += Config.Admin;

    new Utility().sendEmail({
      // To:["felix.fuin@nokia.com"], 
      To: ["digimentorproject@groups.nokia.com"],
      BCC: list,
      Subject: Config.Name + " | Notification : " + title, 
      Body:body
    }).execute();
  }

  contact(FromMail, ToMail, title, message) {
    return new Promise( (resolve, reject) => {
      new Utility().sendEmail({
        // To:["felix.fuin@nokia.com"], 
        To:[ToMail], 
        From: FromMail,
        Subject:Config.Name + " | Contact : " + title, 
        Body:message.replace(/\r\n|\r|\n/g,"<br />")
      }).execute( rep => resolve(rep) );
    });
  };
}

export default new SH();