var src;
var lcl;
if(window.location.hostname === "localhost"){
  src = "/";
  lcl = true;
}else{
  src = '/sites/learn/weshare/SitePages';
  lcl = false;
}

export const Config = { 
  Name: 'WeShare', 
  local: lcl,
  Admin: 'Nokia Admin',
  Source: '/WeShare',
  // Source: src,
  Email: 'learningstore@nokia.com',
  itemUrl: 'https://nokia.sharepoint.com/sites/learn/weshare/SitePages/index.aspx/item/',
  trackingID: 'UA-107717760-1', // Google Analytics 
};