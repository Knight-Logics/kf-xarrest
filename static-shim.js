/* GitHub Pages static mode: no server /api. Leads/offers go to FormSubmit (free) -> nknight@knightgroup.com; live tools show a paused notice. */
(function(){
  var TO='nknight@knightgroup.com', of=window.fetch.bind(window);
  function j(o,s){return new Response(JSON.stringify(o),{status:s||200,headers:{'content-type':'application/json'}});}
  window.fetch=function(input,init){
    var url=typeof input==='string'?input:(input&&input.url)||'';
    var path; try{path=new URL(url,location.href).pathname;}catch(e){path=url;}
    if(path.indexOf('/api/')!==0) return of(input,init);
    if(path==='/api/leads'||path==='/api/offers'){
      var data={}; try{data=JSON.parse((init&&init.body)||'{}');}catch(e){}
      if(data.company_website) return Promise.resolve(j({ok:true,delivered:true}));
      delete data.company_website;
      data._subject=(path==='/api/offers'?'Domain offer':'Lead')+' - '+location.hostname+(data.name?' - '+data.name:'');
      data._template='table'; data._captcha='false'; data.site=location.hostname; data.page=location.pathname;
      return of('https://formsubmit.co/ajax/'+TO,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(data)})
        .then(function(r){return r.json().catch(function(){return {};});})
        .then(function(p){var ok=String(p.success)==='true'; return j({ok:true,delivered:ok});})
        .catch(function(){return j({ok:true,delivered:false});});
    }
    if(path==='/api/health') return Promise.resolve(j({ok:true,mode:'static'}));
    return Promise.resolve(j({ok:false,error:'This live tool is paused while the site moves hosting. Please use the Contact page or email support@knightlogics.com.'},503));
  };
})();
