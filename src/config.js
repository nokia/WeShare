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
  Categories: ["Bureautique", ["Information Technology", ["JavaScript", "Python", "C++", "PHP"]], "Science", "Art"],
  trackingID: 'UA-107717760-1', // Google Analytics 
};