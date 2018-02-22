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
  // Source: '/',
  // Source: '/WeShare',
  Source: src,
  // Source: '/sites/learn/weshare/SitePages/',
  // Categories: ["Word, Excel, etc.", ["Information Technology", ["JavaScript", "Python", "C++", "PHP"]], "Science", "Art"],
  Categories: ["Word, Excel, etc.", "OneDrive", "SharePoint Online", "Cloud", "Collaboration", "Big Data", "O365 on Mobile Devices", "Agility", "Get 1 Hour Back", "Office 365", "Power BI"],
  trackingID: 'UA-107717760-1', // Google Analytics 
};