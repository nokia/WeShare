var SH;
var $REST = require('gd-sprest');
var lz = require('lz-string');

SH = (function() {
  function SH() {
    // this.url = "sites/learn/weshare";
  }

  SH.prototype.init = function(url) {
    this.url = url;
  };


  SH.prototype.getListItems = function(listName) {
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

  SH.prototype.createListItem = function(listName, object) {
    var self = this;
    return new Promise((resolve, reject) => {
      var list, web, obj;
      web = new $REST.Web(self.url);
      list = web.Lists(listName);
      // console.log('create', object, lz.compressToBase64(JSON.stringify(object)));
      obj = lz.compressToBase64(JSON.stringify(object))
      list.Items().add({
        Data: obj
      }).execute((function(_this) {
        return function(item) {
          // console.log('iiiiittt', _this, item);
          resolve('ok');
        };
      })(this));
    });
    
  };


  SH.prototype.getItemById = function(listName, id) {
    var def, list, web;
    def = new Promise();
    web = new $REST.Web;
    list = web.Lists(listName);
    list.getItemById(id).execute(function(item) {
      var obj;
      obj = JSON.parse(item.Object);
      obj.ID = parseInt(id);
      return def.resolve(obj);
    });
    return def;
  };

  SH.prototype.removeItemById = function(listName, id) {
    var def, list, web;
    def = new Promise();
    web = new $REST.Web;
    list = web.Lists(listName);
    list.getItemById(id)["delete"]().execute(function(rep) {
      return def.resolve('deleted');
    });
    return def;
  };

  SH.prototype.getCurrentUser = function() {
    var def, user, web;
    def = new Promise();
    web = new $REST.Web;
    user = web.CurrentUser().execute(function(user) {
      return def.resolve(user);
    });
    return def;
  };

  // SH.prototype.createListItem = function(listName, object) {
  //   return new Promise((resolve, reject) => {
  //     var list, web;
  //     web = new $REST.Web(this.url);
  //     list = web.Lists(listName);
  //     list.Items().add({
  //       Object: lz.compressToBase64(JSON.stringify(object))
  //     }).execute((function(_this) {
  //       return function(item) {
  //         return def.resolve(item);
  //       };
  //     })(this));
  //   });
    
  // };
  

  SH.prototype.updateListItem = function(listName, object, id, document) {
    var def, ext, file, list, web;
    def = new Promise();
    web = new $REST.Web;
    list = web.Lists(listName);
    // if (document && document.input) {
    //   file = document.input[0].files[0];
    //   if (file) {
    //     ext = document.name.split('.').pop();
    //     document.name = Math.floor(Math.random() * (90000000 - 10000000 + 1)) + 10000000 + "." + ext;
    //     object.Document = document.name;
    //     object.DocumentName = document.fullName;
    //     this.AddFileToFolder(document.name, file, document.folder);
    //   }
    // } else if (document && document.DocumentName) {
    //   object.Document = document.Document;
    //   object.DocumentName = document.DocumentName;
    // }
    list.getItemById(id).execute((function(_this) {
      return function(item) {
        return item.update({
          Object: JSON.stringify(object)
        }).execute(function(itemN) {
          return def.resolve(item);
        });
      };
    })(this));
    return def;
  };

  // SH.prototype.AddFileToFolder = function(name, file, folder) {
  //   var def, getFileBuffer;
  //   def = new Promise();
  //   getFileBuffer = function(file) {
  //     var deferred, reader;
  //     deferred = new Promise();
  //     reader = new FileReader;
  //     reader.onload = function(e) {
  //       return deferred.resolve(e.target.result);
  //     };
  //     reader.onerror = function(e) {
  //       return deferred.reject(e.target.error);
  //     };
  //     reader.readAsArrayBuffer(file);
  //     return deferred.promise();
  //   };
  //   getFileBuffer(file).then((function(_this) {
  //     return function(data) {
  //       var web;
  //       web = new $REST.Web;
  //       return web.getFolderByServerRelativeUrl("/sites/learn/bsp/SitePages/" + folder).execute(function(folder) {
  //         return folder.Files().add(false, name, data).execute(function() {
  //           return def.resolve('ok');
  //         });
  //       });
  //     };
  //   })(this));
  //   return def;
  // };

  // SH.prototype.getDocuments = function(list, items) {
  //   var def, query;
  //   def = new Promise();
  //   query = this.url + "_api/lists/getByTitle('" + list + "')/items?$select=AttachmentFiles,Title&$expand=AttachmentFiles";
  //   $.getJSON(query, function(data) {
  //     if (typeof items === 'object') {
  //       $.each(data.value, function(index, object) {
  //         return $.each(items, function(index, item) {
  //           if (object.Title === item.Title) {
  //             if (object.AttachmentFiles[0]) {
  //               item.DocumentUrl = object.AttachmentFiles[0].ServerRelativeUrl;
  //               return item.DocumentName = object.AttachmentFiles[0].FileName;
  //             }
  //           }
  //         });
  //       });
  //     }
  //     if (items.length === 1) {
  //       return def.resolve(items[0]);
  //     } else {
  //       return def.resolve(items);
  //     }
  //   });
  //   return def;
  // };

  // SH.prototype.getAttributeById = function(list, ids, properties) {
  //   var def, clientContext, cpt, d, promisesLength, ret, targetList;
  //   def = new Promise();
  //   clientContext = new SP.ClientContext(this.url);
  //   targetList = clientContext.get_web().get_lists().getByTitle(list);
  //   ret = [];
  //   promisesLength = ids.length;
  //   cpt = 0;
  //   ids.forEach(function(index, id) {
  //     var targetListItem;
  //     targetListItem = targetList.getItemById(id);
  //     properties.forEach(function(index, value) {
  //       return clientContext.load(targetListItem, value);
  //     });
  //     return clientContext.executeQueryAsync((function() {
  //       var obj;
  //       obj = {};
  //       properties.forEach(function(index, value) {
  //         var tmp;
  //         tmp = targetListItem.get_item(value);
  //         if (tmp) {
  //           return obj[value] = tmp;
  //         }
  //       });
  //       ret.push(obj);
  //       cpt++;
  //       if (cpt === promisesLength) {
  //         return d.resolve(ret);
  //       }
  //     }));
  //   });
  //   return d;
  // };

  return SH;

})();

module.exports = new SH();
