var src;
var lcl;
if(window.location.hostname == "localhost"){
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
  // Source: '/',
  // Source: '/WeShare',
  Source: src,
  Email: 'learningstore@nokia.com',
  // Source: '/sites/learn/weshare/SitePages/',
  itemUrl: 'https://nokia.sharepoint.com/sites/learn/weshare/SitePages/index.aspx/item/',
  trackingID: 'UA-107717760-1', // Google Analytics 
};